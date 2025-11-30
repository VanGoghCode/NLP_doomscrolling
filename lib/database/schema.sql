-- Doomscrolling Assessment Database Schema
-- PostgreSQL schema for storing assessment data, sessions, and aggregated statistics

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (anonymous users identified by device/session)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anonymous_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_users_anonymous_id ON users(anonymous_id);

-- Assessment sessions
CREATE TABLE assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    is_complete BOOLEAN DEFAULT FALSE,
    version VARCHAR(10) DEFAULT '1.0',
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX idx_sessions_completed_at ON assessment_sessions(completed_at);
CREATE INDEX idx_sessions_is_complete ON assessment_sessions(is_complete);

-- Individual question responses
CREATE TABLE assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL,
    original_item VARCHAR(50) NOT NULL, -- e.g., DS1_4
    construct VARCHAR(50) NOT NULL,
    dimension VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 7),
    response_time_ms INTEGER, -- Time to answer in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_responses_session_id ON assessment_responses(session_id);
CREATE INDEX idx_responses_construct ON assessment_responses(construct);
CREATE INDEX idx_responses_dimension ON assessment_responses(dimension);

-- Calculated assessment results
CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID UNIQUE REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    overall_score DECIMAL(4,2) NOT NULL,
    overall_percentile INTEGER NOT NULL,
    overall_severity VARCHAR(20) NOT NULL,
    
    -- Dimension scores stored as JSONB for flexibility
    dimension_scores JSONB NOT NULL,
    construct_scores JSONB NOT NULL,
    
    -- Top concerns
    top_concerns JSONB DEFAULT '[]'::jsonb,
    
    -- Generated recommendations
    recommendations JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_results_session_id ON assessment_results(session_id);
CREATE INDEX idx_results_overall_score ON assessment_results(overall_score);
CREATE INDEX idx_results_severity ON assessment_results(overall_severity);

-- User session history (for tracking progress over time)
CREATE TABLE session_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    overall_score DECIMAL(4,2) NOT NULL,
    dimension_scores JSONB NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_history_user_id ON session_history(user_id);
CREATE INDEX idx_history_recorded_at ON session_history(recorded_at);

-- Aggregated statistics for researcher dashboard (updated periodically)
CREATE TABLE aggregated_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'all_time'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Overall statistics
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2),
    
    -- Score distributions
    score_mean DECIMAL(4,2),
    score_median DECIMAL(4,2),
    score_std_dev DECIMAL(4,2),
    score_min DECIMAL(4,2),
    score_max DECIMAL(4,2),
    
    -- Severity distribution
    severity_distribution JSONB DEFAULT '{}'::jsonb,
    
    -- Dimension averages
    dimension_averages JSONB DEFAULT '{}'::jsonb,
    
    -- Demographics (optional)
    demographic_breakdown JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(period_type, period_start)
);

CREATE INDEX idx_stats_period ON aggregated_stats(period_type, period_start);

-- Research sample comparison data (imported from the dataset)
CREATE TABLE research_sample_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    construct VARCHAR(50) NOT NULL,
    stat_type VARCHAR(20) NOT NULL, -- 'mean', 'median', 'std_dev', 'percentile_25', etc.
    value DECIMAL(6,3) NOT NULL,
    sample_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(construct, stat_type)
);

-- Insert research sample statistics
INSERT INTO research_sample_stats (construct, stat_type, value, sample_size) VALUES
('overall', 'mean', 3.54, 200),
('overall', 'std_dev', 1.12, 200),
('frequency', 'mean', 3.72, 200),
('frequency', 'std_dev', 1.45, 200),
('control', 'mean', 2.89, 200),
('control', 'std_dev', 1.38, 200),
('emotional', 'mean', 3.41, 200),
('emotional', 'std_dev', 1.52, 200),
('time', 'mean', 3.28, 200),
('time', 'std_dev', 1.41, 200),
('compulsive', 'mean', 2.95, 200),
('compulsive', 'std_dev', 1.35, 200),
('awareness', 'mean', 4.21, 200),
('awareness', 'std_dev', 1.33, 200),
('interference', 'mean', 3.65, 200),
('interference', 'std_dev', 1.47, 200),
('coping', 'mean', 4.12, 200),
('coping', 'std_dev', 1.38, 200);

-- Function to update aggregated stats
CREATE OR REPLACE FUNCTION update_aggregated_stats(p_period_type VARCHAR, p_start DATE, p_end DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO aggregated_stats (
        period_type,
        period_start,
        period_end,
        total_sessions,
        completed_sessions,
        completion_rate,
        score_mean,
        score_median,
        score_std_dev,
        score_min,
        score_max,
        severity_distribution,
        dimension_averages,
        updated_at
    )
    SELECT
        p_period_type,
        p_start,
        p_end,
        COUNT(DISTINCT s.id),
        COUNT(DISTINCT CASE WHEN s.is_complete THEN s.id END),
        ROUND(COUNT(DISTINCT CASE WHEN s.is_complete THEN s.id END)::DECIMAL / NULLIF(COUNT(DISTINCT s.id), 0) * 100, 2),
        ROUND(AVG(r.overall_score)::DECIMAL, 2),
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY r.overall_score),
        ROUND(STDDEV(r.overall_score)::DECIMAL, 2),
        MIN(r.overall_score),
        MAX(r.overall_score),
        (
            SELECT jsonb_object_agg(severity, cnt)
            FROM (
                SELECT overall_severity as severity, COUNT(*) as cnt
                FROM assessment_results ar
                JOIN assessment_sessions s2 ON ar.session_id = s2.id
                WHERE s2.completed_at BETWEEN p_start AND p_end + INTERVAL '1 day'
                GROUP BY overall_severity
            ) sev
        ),
        (
            SELECT jsonb_object_agg(dim, avg_score)
            FROM (
                SELECT key as dim, ROUND(AVG(value::text::decimal), 2) as avg_score
                FROM assessment_results ar
                JOIN assessment_sessions s2 ON ar.session_id = s2.id,
                jsonb_each(ar.dimension_scores) ds(key, value)
                WHERE s2.completed_at BETWEEN p_start AND p_end + INTERVAL '1 day'
                GROUP BY key
            ) dims
        ),
        NOW()
    FROM assessment_sessions s
    LEFT JOIN assessment_results r ON s.id = r.session_id
    WHERE s.started_at BETWEEN p_start AND p_end + INTERVAL '1 day'
    ON CONFLICT (period_type, period_start)
    DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        completed_sessions = EXCLUDED.completed_sessions,
        completion_rate = EXCLUDED.completion_rate,
        score_mean = EXCLUDED.score_mean,
        score_median = EXCLUDED.score_median,
        score_std_dev = EXCLUDED.score_std_dev,
        score_min = EXCLUDED.score_min,
        score_max = EXCLUDED.score_max,
        severity_distribution = EXCLUDED.severity_distribution,
        dimension_averages = EXCLUDED.dimension_averages,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- View for easy querying of user progress
CREATE VIEW user_progress AS
SELECT 
    u.id as user_id,
    u.anonymous_id,
    COUNT(DISTINCT sh.session_id) as total_sessions,
    MIN(sh.recorded_at) as first_assessment,
    MAX(sh.recorded_at) as latest_assessment,
    (SELECT overall_score FROM session_history WHERE user_id = u.id ORDER BY recorded_at DESC LIMIT 1) as latest_score,
    (SELECT overall_score FROM session_history WHERE user_id = u.id ORDER BY recorded_at ASC LIMIT 1) as first_score,
    CASE 
        WHEN COUNT(DISTINCT sh.session_id) > 1 THEN
            (SELECT overall_score FROM session_history WHERE user_id = u.id ORDER BY recorded_at DESC LIMIT 1) -
            (SELECT overall_score FROM session_history WHERE user_id = u.id ORDER BY recorded_at ASC LIMIT 1)
        ELSE NULL
    END as score_change
FROM users u
LEFT JOIN session_history sh ON u.id = sh.user_id
GROUP BY u.id, u.anonymous_id;

-- View for researcher dashboard stats
CREATE VIEW dashboard_overview AS
SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM assessment_sessions WHERE is_complete = true) as completed_assessments,
    (SELECT ROUND(AVG(overall_score)::DECIMAL, 2) FROM assessment_results) as avg_score,
    (SELECT COUNT(*) FROM assessment_results WHERE overall_severity = 'Low') as low_severity_count,
    (SELECT COUNT(*) FROM assessment_results WHERE overall_severity = 'Moderate') as moderate_severity_count,
    (SELECT COUNT(*) FROM assessment_results WHERE overall_severity = 'High') as high_severity_count,
    (SELECT COUNT(*) FROM assessment_results WHERE overall_severity = 'Severe') as severe_severity_count;
