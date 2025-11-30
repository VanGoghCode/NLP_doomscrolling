# Doomscroll Check

A full-stack web application that helps people understand and reduce their doomscrolling behavior, powered by research data from "The Dark at the End of the Tunnel" study (n=401 participants).

## Features

### 📊 Assessment System
- **24-question assessment** based on 8 research constructs
- **5 user dimensions**: Behavioral, Emotional, Time Awareness, Daily Impact, Self-Awareness
- **Personalized results** with severity levels, percentile rankings, and predictions
- **Research-backed scoring** with inverted awareness (higher = better)

### 📝 Personal Scrolling Journal (NEW - NLP Feature)
- **AI-powered journal** to track and analyze scrolling experiences
- **Sentiment Analysis** using Google Gemini 2 Flash API
- **Emotion Detection** with intensity tracking (anxiety, guilt, stress, etc.)
- **Trigger Identification** categorized by type (social media, news, boredom, etc.)
- **Pattern Recognition** for time of day, duration, and platforms
- **Trend Analysis** across multiple entries
- **Personalized Recommendations** based on journal content

### 📈 Dashboard & Analytics
- View your assessment history
- Track progress over time
- Session logging and analytics

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NLP_doomscrolling
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/apikey

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS 3.4.1
- **UI Components**: HeroUI (formerly NextUI)
- **Animations**: Framer Motion
- **AI/NLP**: Google Gemini 2 Flash API (@google/genai)
- **Data Storage**: localStorage (client-side)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── assessment/       # Assessment endpoints
│   │   ├── journal/          # Journal NLP endpoints
│   │   │   ├── analyze/      # Sentiment & emotion analysis
│   │   │   └── trends/       # Trend analysis across entries
│   │   └── ...
│   ├── assessment/           # Assessment page
│   ├── journal/              # Personal scrolling journal
│   ├── results/              # Assessment results
│   └── dashboard/            # User dashboard
├── components/
│   ├── assessment/           # Assessment components
│   ├── journal/              # Journal components
│   │   ├── JournalEntryForm  # Entry writing form
│   │   ├── JournalHistory    # Entry list & detail view
│   │   └── JournalInsights   # Analytics & trends
│   ├── results/              # Results components
│   └── layout/               # Shared layout components
├── lib/
│   ├── assessment/           # Assessment logic & scoring
│   ├── journal/              # Journal types & helpers
│   └── services/
│       └── gemini.ts         # Gemini AI service
└── docs/
    └── Doomscrolling_Study2_Dataset.csv  # Research data
```

## Research Data

This application uses authentic data from "The Dark at the End of the Tunnel" study:
- **Sample size**: 401 participants
- **Mean doomscrolling score**: 3.55 (SD = 0.72)
- **Severity distribution**:
  - Low (≤2.5): 5.5%
  - Moderate (2.5-4.0): 70.3%
  - High (4.0-5.5): 23.4%
  - Severe (>5.5): 0.7%

## NLP Analysis Features

The journal uses Gemini 2 Flash to analyze entries and provide:

1. **Sentiment Analysis**
   - Overall sentiment (positive/negative/neutral/mixed)
   - Sentiment score (-1 to 1)
   - Confidence level

2. **Emotion Detection**
   - Common emotions: anxiety, guilt, stress, loneliness, boredom, shame, frustration, relief, awareness, hope
   - Intensity tracking (0-1)

3. **Trigger Identification**
   - Categories: social media, news, boredom, stress, habit, FOMO, procrastination
   - Severity levels: low, medium, high

4. **Pattern Recognition**
   - Time of day patterns
   - Scrolling duration estimates
   - Platform identification

5. **Personalized Insights**
   - Key observations
   - Actionable recommendations with priority levels

## License

MIT License

## Acknowledgments

- Research data from "The Dark at the End of the Tunnel" doomscrolling study
- Google Gemini API for NLP analysis
