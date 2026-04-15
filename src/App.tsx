import { useState, useEffect } from 'react'
import './App.css'

// Types
interface FastingStage {
  name: string
  minHours: number
  maxHours: number
  color: string
  healthEffects: string[]
}

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  time: string
}

interface CoachTip {
  id: string
  title: string
  content: string
  category: string
}

interface Recipe {
  id: string
  name: string
  calories: number
  protein: number
  ingredients: string[]
  instructions: string
  prepTime: number
}

// Constants
const FASTING_STAGES: FastingStage[] = [
  {
    name: 'Eating Window',
    minHours: 0,
    maxHours: 4,
    color: '#4ade80',
    healthEffects: ['Insulin elevated', 'Glucose absorption', 'Active digestion', 'Energy utilization'],
  },
  {
    name: 'Fat Burning',
    minHours: 4,
    maxHours: 12,
    color: '#60a5fa',
    healthEffects: ['Glycogen depleting', 'Insulin normalizing', 'Fat mobilization', 'Metabolic boost'],
  },
  {
    name: 'Ketosis',
    minHours: 12,
    maxHours: 24,
    color: '#a78bfa',
    healthEffects: ['Ketone production', 'Weight loss', 'Brain fuel', 'Inflammation reduction'],
  },
  {
    name: 'Deep Ketosis',
    minHours: 24,
    maxHours: Infinity,
    color: '#f87171',
    healthEffects: ['Cellular autophagy', 'Deep repair', 'Immune boost', 'Growth hormone elevation'],
  },
]

const COACH_TIPS: CoachTip[] = [
  {
    id: '1',
    title: 'Stay Hydrated',
    content: 'Drink plenty of water during fasting. Herbal tea and black coffee are fine - no calories!',
    category: 'Hydration',
  },
  {
    id: '2',
    title: 'Start Small',
    content: 'Begin with 16:8 fasts (16 hours fasting, 8 hours eating). Gradually increase duration.',
    category: 'Beginner',
  },
  {
    id: '3',
    title: 'Breaking Your Fast',
    content: 'Break your fast with light, nutrient-dense foods. Avoid heavy meals immediately after fasting.',
    category: 'Nutrition',
  },
  {
    id: '4',
    title: 'Electrolytes Matter',
    content: 'During extended fasts, consider electrolytes (sodium, potassium, magnesium).',
    category: 'Health',
  },
  {
    id: '5',
    title: 'Monitor Energy',
    content: 'If energy drops significantly, listen to your body. Fasting should enhance, not diminish performance.',
    category: 'Health',
  },
  {
    id: '6',
    title: 'Track Everything',
    content: 'Log meals and weight to identify patterns and optimize your fasting routine.',
    category: 'Tracking',
  },
]

const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Greek Salad',
    calories: 320,
    protein: 12,
    ingredients: ['cucumber', 'tomato', 'feta cheese', 'olives', 'olive oil'],
    instructions: 'Mix all vegetables, add feta and olives, drizzle with olive oil',
    prepTime: 10,
  },
  {
    id: '2',
    name: 'Grilled Chicken Breast',
    calories: 280,
    protein: 45,
    ingredients: ['chicken breast', 'lemon', 'garlic', 'olive oil'],
    instructions: 'Season chicken, grill for 7 minutes per side until cooked through',
    prepTime: 25,
  },
  {
    id: '3',
    name: 'Quinoa Buddha Bowl',
    calories: 420,
    protein: 15,
    ingredients: ['quinoa', 'roasted vegetables', 'chickpeas', 'tahini'],
    instructions: 'Cook quinoa, roast vegetables, mix together with tahini dressing',
    prepTime: 30,
  },
]

function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'coach' | 'meals' | 'stats'>('timer')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  // Timer states
  const [lastMealTime, setLastMealTime] = useState<string>(
    localStorage.getItem('lastMealTime') || ''
  )
  const [hoursElapsed, setHoursElapsed] = useState(0)
  const [currentStage, setCurrentStage] = useState<FastingStage | null>(null)

  // Meal states
  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('meals')
    return saved ? JSON.parse(saved) : []
  })

  // Timer effect
  useEffect(() => {
    const updateTimer = () => {
      if (!lastMealTime) return

      const lastMeal = new Date(lastMealTime)
      const now = new Date()
      const diffMs = now.getTime() - lastMeal.getTime()
      const elapsed = diffMs / (1000 * 60 * 60)

      setHoursElapsed(elapsed)

      const stage = FASTING_STAGES.find(
        (s) => elapsed >= s.minHours && elapsed < s.maxHours
      )
      setCurrentStage(stage || null)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [lastMealTime])

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

  // Helper functions
  const formatTime = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    if (time) {
      setLastMealTime(time)
      localStorage.setItem('lastMealTime', time)
    }
  }

  const addMeal = (recipe: Recipe) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      time: new Date().toLocaleTimeString(),
    }
    const updated = [...meals, newMeal]
    setMeals(updated)
    localStorage.setItem('meals', JSON.stringify(updated))
  }

  const getTotalCalories = () => meals.reduce((sum, meal) => sum + meal.calories, 0)
  const getTotalProtein = () => meals.reduce((sum, meal) => sum + meal.protein, 0)

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <h1>⏱️ FastingPro</h1>
        <button
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button
          className={`nav-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          ⏱️ Timer
        </button>
        <button
          className={`nav-btn ${activeTab === 'coach' ? 'active' : ''}`}
          onClick={() => setActiveTab('coach')}
        >
          🤖 Coach
        </button>
        <button
          className={`nav-btn ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          🍽️ Meals
        </button>
        <button
          className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
      </nav>

      {/* Content */}
      <main className="content">
        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <section className="tab-content">
            <div className="input-section">
              <label htmlFor="lastMeal">When did you last eat?</label>
              <input
                id="lastMeal"
                type="datetime-local"
                value={lastMealTime}
                onChange={handleTimeChange}
                className="time-input"
              />
            </div>

            {lastMealTime && currentStage && (
              <div className="stage-card" style={{ borderColor: currentStage.color }}>
                <h2 style={{ color: currentStage.color }}>{currentStage.name}</h2>
                <div className="timer-display">
                  <div className="elapsed-time">{formatTime(hoursElapsed)}</div>
                  <div className="elapsed-label">Elapsed</div>
                </div>
                <div className="health-effects">
                  <h3>Active Effects:</h3>
                  <ul>
                    {currentStage.healthEffects.map((effect, i) => (
                      <li key={i}>✓ {effect}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!lastMealTime && (
              <div className="welcome-section">
                <p>👋 Start fasting by entering when you last ate!</p>
              </div>
            )}
          </section>
        )}

        {/* Coach Tab */}
        {activeTab === 'coach' && (
          <section className="tab-content">
            <h2>💡 Fasting Coach Tips</h2>
            <div className="tips-grid">
              {COACH_TIPS.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <h3>{tip.title}</h3>
                  <p className="category">{tip.category}</p>
                  <p>{tip.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Meals Tab */}
        {activeTab === 'meals' && (
          <section className="tab-content">
            <h2>🍽️ Meal Planner</h2>

            <div className="meals-section">
              <div className="recipes-list">
                <h3>Popular Recipes</h3>
                {RECIPES.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <h4>{recipe.name}</h4>
                    <p>
                      {recipe.calories} cal | {recipe.protein}g protein | {recipe.prepTime} min
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => addMeal(recipe)}
                    >
                      + Add to Meal
                    </button>
                  </div>
                ))}
              </div>

              <div className="todays-meals">
                <h3>Today's Meals</h3>
                {meals.length > 0 ? (
                  <div className="meals-list">
                    {meals.map((meal) => (
                      <div key={meal.id} className="meal-item">
                        <div>
                          <p className="meal-name">{meal.name}</p>
                          <p className="meal-time">{meal.time}</p>
                        </div>
                        <div className="meal-stats">
                          <p>{meal.calories} cal</p>
                          <p>{meal.protein}g protein</p>
                        </div>
                      </div>
                    ))}
                    <div className="summary">
                      <p>Total: {getTotalCalories()} calories | {getTotalProtein()}g protein</p>
                    </div>
                  </div>
                ) : (
                  <p className="empty-state">No meals logged yet</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <section className="tab-content">
            <h2>📊 Your Progress</h2>
            <div className="stats-container">
              {lastMealTime && (
                <div className="stat-card">
                  <h3>Current Fasting</h3>
                  <p className="stat-value">{formatTime(hoursElapsed)}</p>
                  <p className="stat-label">{currentStage?.name || 'N/A'}</p>
                </div>
              )}

              <div className="stat-card">
                <h3>Today's Meals</h3>
                <p className="stat-value">{meals.length}</p>
                <p className="stat-label">Meals logged</p>
              </div>

              <div className="stat-card">
                <h3>Total Calories</h3>
                <p className="stat-value">{getTotalCalories()}</p>
                <p className="stat-label">Today</p>
              </div>

              <div className="stat-card">
                <h3>Protein</h3>
                <p className="stat-value">{getTotalProtein()}g</p>
                <p className="stat-label">Today</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
