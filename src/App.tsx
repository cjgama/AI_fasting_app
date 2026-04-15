import { useState, useEffect } from 'react'
import './App.css'

interface FastingStage {
  name: string
  minHours: number
  maxHours: number
  description: string
  color: string
  healthEffects: string[]
}

const FASTING_STAGES: FastingStage[] = [
  {
    name: 'Eating Window',
    minHours: 0,
    maxHours: 4,
    description: 'Your digestive system is working',
    color: '#4ade80',
    healthEffects: [
      'Insulin levels elevated',
      'Glucose absorption in progress',
      'Digestion and nutrient absorption',
      'Energy from food being used',
    ],
  },
  {
    name: 'Fat Burning',
    minHours: 4,
    maxHours: 12,
    description: 'Your body is burning stored fat',
    color: '#60a5fa',
    healthEffects: [
      'Glycogen stores depleting',
      'Insulin levels normalizing',
      'Fat mobilization beginning',
      'Increased metabolic rate',
      'Enhanced mental clarity',
    ],
  },
  {
    name: 'Ketosis',
    minHours: 12,
    maxHours: 24,
    description: 'Your body is in ketosis state',
    color: '#a78bfa',
    healthEffects: [
      'Ketone bodies being produced',
      'Significant weight loss potential',
      'Brain using ketones for fuel',
      'Reduced inflammation',
      'Improved cognitive function',
      'Appetite suppression',
      'Early autophagy activation',
    ],
  },
  {
    name: 'Deep Ketosis',
    minHours: 24,
    maxHours: Infinity,
    description: 'Extended fasting benefits',
    color: '#f87171',
    healthEffects: [
      'Maximum cellular autophagy',
      'Deep cellular repair and renewal',
      'Enhanced immune function',
      'Significant fat loss',
      'Mitochondrial optimization',
      'Growth hormone elevation',
      'Anti-aging processes active',
      'Potential disease prevention benefits',
    ],
  },
]

interface FastingState {
  lastMealTime: string
  currentStage: FastingStage | null
  hoursElapsed: number
}

function App() {
  const [fastingState, setFastingState] = useState<FastingState>({
    lastMealTime: localStorage.getItem('lastMealTime') || '',
    currentStage: null,
    hoursElapsed: 0,
  })

  // Calculate current stage and elapsed time
  useEffect(() => {
    const updateFastingState = () => {
      if (!fastingState.lastMealTime) return

      const lastMeal = new Date(fastingState.lastMealTime)
      const now = new Date()
      const diffMs = now.getTime() - lastMeal.getTime()
      const hoursElapsed = diffMs / (1000 * 60 * 60)

      const stage = FASTING_STAGES.find(
        (s) => hoursElapsed >= s.minHours && hoursElapsed < s.maxHours
      )

      setFastingState((prev) => ({
        ...prev,
        hoursElapsed,
        currentStage: stage || null,
      }))
    }

    updateFastingState()
    const interval = setInterval(updateFastingState, 1000)
    return () => clearInterval(interval)
  }, [fastingState.lastMealTime])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTime = e.target.value
    if (dateTime) {
      localStorage.setItem('lastMealTime', dateTime)
      setFastingState((prev) => ({
        ...prev,
        lastMealTime: dateTime,
      }))
    }
  }

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.floor((hours - wholeHours) * 60)
    return `${wholeHours}h ${minutes}m`
  }

  const getNextStage = () => {
    if (!fastingState.currentStage) return null
    const currentIndex = FASTING_STAGES.indexOf(fastingState.currentStage)
    if (currentIndex < FASTING_STAGES.length - 1) {
      return FASTING_STAGES[currentIndex + 1]
    }
    return null
  }

  const getHoursUntilNextStage = () => {
    const nextStage = getNextStage()
    if (!nextStage) return null
    return Math.max(0, nextStage.minHours - fastingState.hoursElapsed)
  }

  return (
    <>
      <section id="center" className="app-container">
        <div>
          <h1>⏱ Fasting Tracker</h1>
          <p className="subtitle">Track your fasting progress</p>
        </div>

        <div className="input-section">
          <label htmlFor="lastMeal">When did you last eat?</label>
          <input
            id="lastMeal"
            type="datetime-local"
            value={fastingState.lastMealTime}
            onChange={handleTimeChange}
            className="time-input"
          />
        </div>
        {fastingState.lastMealTime && fastingState.currentStage && (
          <div className="stage-display">
            <div className="stage-card" style={{ borderColor: fastingState.currentStage.color }}>
              <h2 className="stage-name" style={{ color: fastingState.currentStage.color }}>
                {fastingState.currentStage.name}
              </h2>
              <p className="stage-description">{fastingState.currentStage.description}</p>

              <div className="timer">
                <p className="elapsed-time">{formatTime(fastingState.hoursElapsed)}</p>
                <p className="elapsed-label">Elapsed</p>
              </div>

              <div className="health-effects">
                <h3 className="health-title">Health Effects Active:</h3>
                <ul className="effects-list">
                  {fastingState.currentStage.healthEffects.map((effect, idx) => (
                    <li key={idx} className="effect-item">{effect}</li>
                  ))}
                </ul>
              </div>

              {getNextStage() && (
                <div className="next-stage-info">
                  <p>Next stage: <strong>{getNextStage()!.name}</strong></p>
                  <p className="time-until">In {formatTime(getHoursUntilNextStage()!)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!fastingState.lastMealTime && (
          <div className="welcome-message">
            <p>👋 Enter your last meal time to get started!</p>
          </div>
        )}

        <div className="stages-info">
          <h3>Fasting Stages</h3>
          <div className="stages-grid">
            {FASTING_STAGES.map((stage) => (
              <div 
                key={stage.name} 
                className="stage-info-card"
                style={{ borderLeftColor: stage.color }}
              >
                <p className="stage-hours">{stage.minHours}h - {stage.maxHours === Infinity ? '∞' : stage.maxHours + 'h'}</p>
                <p className="stage-title">{stage.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default App
