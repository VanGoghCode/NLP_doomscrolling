# Architecture Diagram

## System Overview

```mermaid
flowchart TB
    subgraph Client["🖥️ Client (Browser)"]
        UI[React UI Components]
        LS[(localStorage)]
        UI <--> LS
    end

    subgraph NextJS["⚡ Next.js App Router"]
        subgraph Pages["📄 Pages"]
            Home["/"]
            Assessment["/assessment"]
            Results["/results"]
            Journal["/journal"]
            Dashboard["/dashboard"]
        end

        subgraph API["🔌 API Routes"]
            AssessmentAPI["/api/assessment/*"]
            JournalAPI["/api/journal/*"]
            ResultsAPI["/api/results/*"]
        end
    end

    subgraph External["☁️ External Services"]
        Gemini["🤖 Google Gemini AI\n(gemini-2.0-flash)"]
    end

    Client <--> NextJS
    JournalAPI <--> Gemini
    ResultsAPI <--> Gemini
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph User["👤 User Actions"]
        A1[Take Assessment]
        A2[Write Journal]
        A3[View Results]
    end

    subgraph Storage["💾 localStorage"]
        S1[assessmentResults]
        S2[journalStore]
    end

    subgraph AI["🧠 Gemini AI Analysis"]
        AI1[Sentiment Analysis]
        AI2[Emotion Detection]
        AI3[Trigger Identification]
        AI4[AI Coach Suggestions]
    end

    A1 --> S1
    A2 --> S2
    S1 --> A3
    S2 --> AI1 & AI2 & AI3
    S1 --> AI4
    AI1 & AI2 & AI3 --> S2
    AI4 --> A3
```

## Component Architecture

```mermaid
flowchart TB
    subgraph Layout["🎨 Layout Components"]
        Header
        Footer
    end

    subgraph AssessmentComponents["📊 Assessment"]
        QuestionCard
        ProgressIndicator
        CategoryLabel
    end

    subgraph ResultsComponents["📈 Results"]
        ScoreGauge
        RadarChart
        DimensionBreakdown
        ComparisonCard
        AICoach["AI Coach Panel"]
    end

    subgraph JournalComponents["📝 Journal"]
        JournalEntryForm
        JournalHistory
        JournalInsights
    end

    subgraph SharedUI["🧩 Shared UI"]
        Icon
        HeroUI["HeroUI Components"]
    end

    Layout --> AssessmentComponents & ResultsComponents & JournalComponents
    AssessmentComponents & ResultsComponents & JournalComponents --> SharedUI
```

## API Architecture

```mermaid
flowchart TB
    subgraph APIRoutes["🔌 API Routes"]
        subgraph AssessmentAPIs["/api/assessment"]
            Q["/questions\nGET: Fetch questions"]
            S["/submit\nPOST: Submit & score"]
        end

        subgraph JournalAPIs["/api/journal"]
            JA["/analyze\nPOST: Analyze entry"]
            JT["/trends\nPOST: Trend analysis"]
        end

        subgraph ResultsAPIs["/api/results"]
            RS["/suggestions\nPOST: AI Coach"]
        end
    end

    subgraph Services["⚙️ Services"]
        GeminiService["gemini.ts"]
    end

    subgraph Functions["📦 Functions"]
        F1[analyzeJournalEntry]
        F2[analyzeTrends]
        F3[generateAISuggestions]
    end

    JA --> GeminiService
    JT --> GeminiService
    RS --> GeminiService
    GeminiService --> F1 & F2 & F3
```

## Assessment Scoring Flow

```mermaid
flowchart LR
    subgraph Input["📥 Input"]
        Q1[24 Questions]
        R1[User Responses\n1-7 Likert Scale]
    end

    subgraph Processing["⚙️ Processing"]
        C1[Map to 8 Constructs]
        C2[Calculate Dimension Scores]
        C3[Apply Awareness Inversion]
        C4[Compare to Research Data\nn=401]
    end

    subgraph Output["📤 Output"]
        O1[Overall Score]
        O2[Severity Level]
        O3[Percentile Rank]
        O4[Predictions]
        O5[Recommendations]
    end

    Q1 --> R1 --> C1 --> C2 --> C3 --> C4
    C4 --> O1 & O2 & O3 & O4 & O5
```

## Journal NLP Pipeline

```mermaid
flowchart TB
    subgraph Input["✍️ User Input"]
        Entry[Journal Entry Text]
        Mood[Mood Selection 1-5]
    end

    subgraph GeminiAnalysis["🤖 Gemini AI Analysis"]
        Sentiment[Sentiment Analysis\npositive/negative/neutral/mixed]
        Emotions[Emotion Detection\nanxiety, guilt, stress, etc.]
        Triggers[Trigger Identification\nsocial_media, news, boredom, etc.]
        Patterns[Pattern Recognition\ntime, duration, platform]
        Insights[Key Insights]
        Recommendations[Recommendations\nwith priority levels]
        Summary[AI Summary]
    end

    subgraph Output["📊 Output"]
        EntryDetail[Entry Detail View]
        TrendChart[Trend Analysis]
        ActionPlan[Action Items]
    end

    Entry --> GeminiAnalysis
    Mood --> EntryDetail
    Sentiment & Emotions & Triggers & Patterns --> EntryDetail
    Insights & Recommendations --> ActionPlan
    Summary --> EntryDetail
    
    EntryDetail --> TrendChart
```

## Tech Stack Layers

```mermaid
flowchart TB
    subgraph Presentation["🎨 Presentation Layer"]
        React[React 18]
        TW[TailwindCSS]
        HUI[HeroUI]
        FM[Framer Motion]
    end

    subgraph Application["⚡ Application Layer"]
        Next[Next.js 15\nApp Router]
        TS[TypeScript]
        API[API Routes]
    end

    subgraph Data["💾 Data Layer"]
        LS[localStorage]
        Research[Research CSV\nn=401]
    end

    subgraph External["☁️ External"]
        Gemini[Google Gemini\ngemini-2.0-flash]
        Vercel[Vercel Hosting]
    end

    Presentation --> Application --> Data
    Application <--> External
```

## File Structure

```mermaid
flowchart TB
    subgraph Root["📁 Project Root"]
        App["app/"]
        Components["components/"]
        Lib["lib/"]
        Docs["docs/"]
    end

    subgraph AppDir["app/"]
        AppPages["page.tsx\nlayout.tsx"]
        AppAPI["api/"]
        AppRoutes["assessment/\nresults/\njournal/\ndashboard/"]
    end

    subgraph ComponentsDir["components/"]
        CompAssess["assessment/"]
        CompResults["results/"]
        CompJournal["journal/"]
        CompLayout["layout/"]
        CompUI["ui/"]
    end

    subgraph LibDir["lib/"]
        LibAssess["assessment/\nquestions.ts\nscoring.ts\npredictions.ts"]
        LibJournal["journal/\ntypes.ts"]
        LibServices["services/\ngemini.ts"]
    end

    Root --> App & Components & Lib & Docs
    App --> AppPages & AppAPI & AppRoutes
    Components --> CompAssess & CompResults & CompJournal & CompLayout & CompUI
    Lib --> LibAssess & LibJournal & LibServices
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **localStorage** | MVP simplicity, no backend needed, instant persistence |
| **Gemini 2.0 Flash** | Fast, cost-effective, structured JSON output |
| **Next.js App Router** | Modern React patterns, API routes, easy Vercel deploy |
| **HeroUI** | Beautiful components, TailwindCSS compatible |
| **Client-side scoring** | Immediate feedback, no server round-trip |
| **Research-based thresholds** | Authentic data from n=401 study |
