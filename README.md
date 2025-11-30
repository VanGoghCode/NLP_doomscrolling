# Doomscroll Check

A full-stack web application that helps people understand and reduce their doomscrolling behavior, powered by research data from "The Dark at the End of the Tunnel" study (n=401 participants) and AI-powered insights using Google Gemini.

🔗 **Live Demo**: [Your Vercel URL]

## ✨ Features

### 📊 Comprehensive Assessment System
- **24-question scientifically-backed assessment** based on 8 research constructs
- **5 user dimensions** evaluated:
  - Behavioral Patterns (frequency, control issues)
  - Emotional Impact (anxiety, guilt, mood changes)
  - Time Awareness (time distortion, loss of time)
  - Daily Life Impact (interference with responsibilities)
  - Self-Awareness (recognition of problematic behavior)
- **Personalized results** with:
  - Overall severity score (1-7 scale)
  - Percentile ranking compared to 401 research participants
  - Visual radar chart of your pattern
  - Detailed dimension breakdowns
- **Predictive insights** including:
  - Risk level assessment
  - Estimated weekly scrolling time
  - Risk factors and protective factors
  - Probability-based predictions

### 🤖 AI Coach (Results Page)
- **Personalized AI-generated suggestions** based on your unique assessment results
- **Top 3 priority areas** with concrete action steps and timeframes
- **Daily habits** to build with timing recommendations
- **Mindset shifts** - "From/To" mental reframes
- **Weekly goals** with metrics and rewards
- **Encouraging messages** tailored to your situation
- Powered by Google Gemini AI

### 📝 Personal Scrolling Journal (NLP Feature)
- **AI-powered journal** to track daily scrolling experiences
- **Mood tracking** with 5-level emoji selector
- **Writing prompts** to guide reflection
- **Real-time AI analysis** of each entry including:
  - **Sentiment Analysis** (positive/negative/neutral/mixed with confidence score)
  - **Emotion Detection** with intensity levels (anxiety, guilt, stress, loneliness, boredom, shame, frustration, relief, awareness, hope)
  - **Trigger Identification** categorized by type (social media, news, boredom, stress, habit, FOMO, procrastination)
  - **Pattern Recognition** (time of day, duration, platforms)
  - **Key Insights** about your behavior
  - **Personalized Recommendations** with priority levels
  - **AI Summary** of each entry
- **Trend Analysis** across multiple entries:
  - Overall behavioral trend (improving/stable/declining)
  - Sentiment changes over time
  - Common triggers and whether they're being managed
  - Emotional patterns
  - Progress insights
  - Weekly focus area

### 📈 Dashboard & Analytics
- Session logging and tracking
- Progress visualization
- Historical data view

### 🎨 Modern UI/UX
- Clean, responsive design
- Saffron/amber color theme
- Smooth animations with Framer Motion
- Glass-morphism effects
- Mobile-friendly layout
- Dark header with floating navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/VanGoghCode/NLP_doomscrolling.git
cd NLP_doomscrolling
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

4. **Add your Gemini API key to `.env`:**
```
GEMINI_API_KEY=your_api_key_here
```
Get your free API key from: https://aistudio.google.com/apikey

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

### Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` in Environment Variables
4. Deploy!

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15.0.3 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS 3.4.1 |
| **UI Components** | HeroUI (formerly NextUI) |
| **Animations** | Framer Motion |
| **AI/NLP** | Google Gemini 2 Flash API |
| **Data Storage** | localStorage (client-side) |
| **Deployment** | Vercel |

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── assessment/          # Assessment submission
│   │   ├── journal/
│   │   │   ├── analyze/         # Single entry NLP analysis
│   │   │   └── trends/          # Multi-entry trend analysis
│   │   └── results/
│   │       └── suggestions/     # AI Coach suggestions
│   ├── assessment/              # 24-question assessment
│   ├── journal/                 # Personal scrolling journal
│   ├── results/                 # Results with AI Coach
│   └── dashboard/               # Analytics dashboard
├── components/
│   ├── assessment/              # Question cards, progress
│   ├── journal/
│   │   ├── JournalEntryForm     # Entry creation with mood
│   │   ├── JournalHistory       # List & detail views
│   │   └── JournalInsights      # Stats & trend analysis
│   ├── results/
│   │   ├── ScoreGauge           # Circular score display
│   │   ├── RadarChart           # Dimension visualization
│   │   └── DimensionBreakdown   # Detailed scores
│   └── layout/                  # Header, Footer
├── lib/
│   ├── assessment/
│   │   ├── questions.ts         # 24 questions with constructs
│   │   ├── scoring.ts           # Score calculation logic
│   │   └── predictions.ts       # Risk predictions
│   ├── journal/
│   │   └── types.ts             # Journal types & helpers
│   └── services/
│       └── gemini.ts            # Gemini AI service
└── docs/
    └── Doomscrolling_Study2_Dataset.csv
```

## 📊 Research Foundation

This application uses **authentic data** from "The Dark at the End of the Tunnel" doomscrolling study:

| Metric | Value |
|--------|-------|
| Sample Size | 401 participants |
| Mean Score | 3.55 (SD = 0.72) |
| Scale | 7-point Likert |

**Severity Distribution:**
- 🟢 Low (≤2.5): 5.5%
- 🟡 Moderate (2.5-4.0): 70.3%
- 🟠 High (4.0-5.5): 23.4%
- 🔴 Severe (>5.5): 0.7%

**8 Research Constructs Measured:**
1. Frequency of Use
2. Loss of Control
3. Negative Emotional Impact
4. Time Distortion
5. Compulsive Checking
6. Self-Awareness (inverted)
7. Daily Life Interference
8. Maladaptive Coping

## 🧠 AI/NLP Capabilities

### Journal Entry Analysis
Each journal entry is analyzed by Gemini AI to provide:

```
📊 Sentiment: Positive/Negative/Neutral/Mixed (with score -1 to +1)
😔 Emotions: Detected emotions with intensity (0-100%)
⚡ Triggers: Categorized triggers with severity
🕐 Patterns: Time of day, duration, platform
💡 Insights: Key observations about behavior
✅ Recommendations: Prioritized action items
📝 Summary: Empathetic AI-generated summary
```

### AI Coach Analysis
Assessment results are analyzed to generate:

```
💬 Personalized message addressing your specific situation
🎯 Top 3 priorities with action steps
📅 Daily habits with timing suggestions
🧠 Mindset shifts (from → to reframes)
🏆 Weekly goal with metrics and rewards
💪 Encouraging closing message
```

## 📱 Screenshots

| Home | Assessment | Results |
|------|------------|---------|
| Landing page with research stats | 24-question assessment | Detailed results with AI Coach |

| Journal | Insights | AI Analysis |
|---------|----------|-------------|
| Write entries with mood | Trend analysis | Emotion & trigger detection |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Research data from "The Dark at the End of the Tunnel" doomscrolling study
- Google Gemini API for AI-powered analysis
- HeroUI for beautiful components
- The open-source community

---

**Built with ❤️ to help people take control of their digital lives.**
