import { useEffect, useState } from 'react'
import './App.css'

interface FastingStage {
  name: string
  minHours: number
  maxHours: number
  color: string
  healthEffects: string[]
}

interface Meal {
  id: string
  foodItemId: string
  name: string
  serving: string
  quantity: number
  calories: number
  protein: number
  time: string
  loggedAt: string
  eatingWindowId: string
}

interface FoodItem {
  id: string
  name: string
  category: string
  serving: string
  calories: number
  protein: number
}

interface CoachTip {
  id: string
  title: string
  content: string
  category: string
}

interface FeelingEntry {
  id: string
  timestamp: string
  energy: number
  mood: string
  notes: string
  stage: string
}

interface User {
  id: string
  username: string
}

interface StoredPassword {
  type: 'sha256'
  value: string
}

interface FastingWindow {
  id: string
  startTime: string
  endTime: string
  durationHours: number
  stage: string
  source: 'manual' | 'auto'
}

interface EatingWindow {
  id: string
  startTime: string
  endTime: string | null
  durationHours: number | null
  linkedFastingWindowId?: string
}

interface TimeSegment {
  start: Date
  end: Date
  durationHours: number
}

const FASTING_STAGES: FastingStage[] = [
  {
    name: 'Eating Window',
    minHours: 0,
    maxHours: 4,
    color: '#4ade80',
    healthEffects: ['Digestion active', 'Energy replenishment', 'Protein synthesis', 'Hydration and recovery'],
  },
  {
    name: 'Fat Burning',
    minHours: 4,
    maxHours: 12,
    color: '#60a5fa',
    healthEffects: ['Insulin dropping', 'Stored glycogen in use', 'Fat mobilization starting', 'Appetite stabilizing'],
  },
  {
    name: 'Ketosis',
    minHours: 12,
    maxHours: 24,
    color: '#a78bfa',
    healthEffects: ['Ketone production', 'Steadier focus', 'Improved metabolic flexibility', 'Lower snacking pressure'],
  },
  {
    name: 'Deep Ketosis',
    minHours: 24,
    maxHours: Number.POSITIVE_INFINITY,
    color: '#f87171',
    healthEffects: ['Long fasting adaptation', 'Autophagy support', 'Deep fat oxidation', 'Extra recovery focus needed'],
  },
]

const COACH_TIPS: CoachTip[] = [
  {
    id: '1',
    title: 'Hydrate First',
    content: 'Water, sparkling water, herbal tea, and electrolytes make fasting windows much more manageable.',
    category: 'Hydration',
  },
  {
    id: '2',
    title: 'Break Fasts Gently',
    content: 'Start eating windows with protein, fruit, yogurt, or eggs before jumping into very heavy meals.',
    category: 'Nutrition',
  },
  {
    id: '3',
    title: 'Use Consistent Windows',
    content: 'Keeping roughly similar eating and fasting times helps the body adapt and makes weekly reviews more meaningful.',
    category: 'Routine',
  },
  {
    id: '4',
    title: 'Review Your Week',
    content: 'Look for which fasting lengths felt good and which eating windows drifted longer than planned.',
    category: 'Analytics',
  },
]

const FOOD_ITEMS: FoodItem[] = [
  { id: 'egg', name: 'Egg', category: 'Protein', serving: '1 large egg', calories: 72, protein: 6 },
  { id: 'tomato', name: 'Tomato', category: 'Produce', serving: '1 medium tomato', calories: 22, protein: 1 },
  { id: 'banana', name: 'Banana', category: 'Fruit', serving: '1 medium banana', calories: 105, protein: 1.3 },
  { id: 'blueberry-cup', name: 'Blueberries', category: 'Fruit', serving: '1 cup blueberries', calories: 84, protein: 1.1 },
  { id: 'apple', name: 'Apple', category: 'Fruit', serving: '1 medium apple', calories: 95, protein: 0.5 },
  { id: 'avocado-half', name: 'Avocado', category: 'Healthy Fat', serving: '1/2 avocado', calories: 120, protein: 2 },
  { id: 'oats-portion', name: 'Oats', category: 'Carbohydrate', serving: '1 portion (50 g dry)', calories: 190, protein: 7 },
  { id: 'rice-cup', name: 'Cooked Rice', category: 'Carbohydrate', serving: '1 cup cooked rice', calories: 205, protein: 4.3 },
  { id: 'quinoa-cup', name: 'Quinoa', category: 'Carbohydrate', serving: '1 cup cooked quinoa', calories: 222, protein: 8.1 },
  { id: 'sweet-potato', name: 'Sweet Potato', category: 'Carbohydrate', serving: '1 medium sweet potato', calories: 112, protein: 2 },
  { id: 'chicken-100g', name: 'Chicken Breast', category: 'Protein', serving: '100 g cooked chicken breast', calories: 165, protein: 31 },
  { id: 'salmon-fillet', name: 'Salmon', category: 'Protein', serving: '1 salmon fillet (120 g)', calories: 233, protein: 25 },
  { id: 'tuna-can', name: 'Tuna', category: 'Protein', serving: '1 can tuna in water', calories: 132, protein: 28 },
  { id: 'lean-beef-100g', name: 'Lean Beef', category: 'Protein', serving: '100 g cooked lean beef', calories: 191, protein: 26 },
  { id: 'tofu-block', name: 'Tofu', category: 'Protein', serving: '100 g firm tofu', calories: 96, protein: 11 },
  { id: 'greek-yogurt-cup', name: 'Greek Yogurt', category: 'Dairy', serving: '1 cup Greek yogurt', calories: 100, protein: 17 },
  { id: 'cottage-cheese-cup', name: 'Cottage Cheese', category: 'Dairy', serving: '1 cup cottage cheese', calories: 206, protein: 28 },
  { id: 'feta-portion', name: 'Feta Cheese', category: 'Dairy', serving: '1 portion feta (50 g)', calories: 132, protein: 7 },
  { id: 'almond-handful', name: 'Almonds', category: 'Healthy Fat', serving: '1 handful almonds (28 g)', calories: 164, protein: 6 },
  { id: 'walnut-handful', name: 'Walnuts', category: 'Healthy Fat', serving: '1 handful walnuts (28 g)', calories: 185, protein: 4.3 },
  { id: 'peanut-butter-spoon', name: 'Peanut Butter', category: 'Healthy Fat', serving: '1 serving peanut butter (2 tbsp)', calories: 188, protein: 8 },
  { id: 'broccoli-cup', name: 'Broccoli', category: 'Produce', serving: '1 cup cooked broccoli', calories: 55, protein: 4 },
  { id: 'spinach-cup', name: 'Spinach', category: 'Produce', serving: '1 cup raw spinach', calories: 7, protein: 1 },
  { id: 'cucumber', name: 'Cucumber', category: 'Produce', serving: '1 medium cucumber', calories: 30, protein: 1.3 },
  { id: 'chickpea-cup', name: 'Chickpeas', category: 'Legume', serving: '1 cup cooked chickpeas', calories: 269, protein: 14.5 },
  { id: 'lentil-cup', name: 'Lentils', category: 'Legume', serving: '1 cup cooked lentils', calories: 230, protein: 18 },
  { id: 'bread-slice', name: 'Wholegrain Bread', category: 'Carbohydrate', serving: '1 slice wholegrain bread', calories: 80, protein: 4 },
  { id: 'olive-oil-spoon', name: 'Olive Oil', category: 'Healthy Fat', serving: '1 tbsp olive oil', calories: 119, protein: 0 },
]

const parseStoredJson = <T,>(key: string, fallback: T) => {
  const rawValue = localStorage.getItem(key)

  if (!rawValue) {
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

const isStoredPassword = (value: unknown): value is StoredPassword => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>
  return candidate.type === 'sha256' && typeof candidate.value === 'string'
}

const createId = () => crypto.randomUUID()

const hashPassword = async (password: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const formatDuration = (hours: number) => {
  const wholeHours = Math.floor(hours)
  const minutes = Math.floor((hours - wholeHours) * 60)
  return `${wholeHours}h ${minutes}m`
}

const getStageForHours = (hours: number) => {
  const stage = FASTING_STAGES.find((item) => hours >= item.minHours && hours < item.maxHours)
  return stage || FASTING_STAGES[FASTING_STAGES.length - 1]
}

const isSameDay = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  return date.toDateString() === now.toDateString()
}

const getStartOfWeek = (date: Date) => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

const getEndOfWeek = (date: Date) => {
  const result = getStartOfWeek(date)
  result.setDate(result.getDate() + 7)
  return result
}

const formatWeekInput = (date: Date) => {
  const start = getStartOfWeek(date)
  const year = start.getFullYear()
  const firstThursday = new Date(year, 0, 4)
  const weekStart = getStartOfWeek(firstThursday)
  const weekNumber =
    1 + Math.round((start.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`
}

const parseWeekInput = (value: string) => {
  const match = /^(\d{4})-W(\d{2})$/.exec(value)
  if (!match) {
    const today = new Date()
    return { start: getStartOfWeek(today), end: getEndOfWeek(today) }
  }

  const year = Number(match[1])
  const week = Number(match[2])
  const januaryFourth = new Date(year, 0, 4)
  const firstWeekStart = getStartOfWeek(januaryFourth)
  const start = new Date(firstWeekStart)
  start.setDate(firstWeekStart.getDate() + (week - 1) * 7)
  const end = new Date(start)
  end.setDate(start.getDate() + 7)
  return { start, end }
}

const getResetFastingWindows = (userId: string) => {
  const resetKey = `user_${userId}_fastingWindows_reset_v1`
  if (!localStorage.getItem(resetKey)) {
    localStorage.setItem(`user_${userId}_fastingWindows`, JSON.stringify([]))
    localStorage.setItem(resetKey, 'true')
    return [] as FastingWindow[]
  }

  return parseStoredJson<FastingWindow[]>(`user_${userId}_fastingWindows`, [])
}

const buildMergedWeeklyFastingSegments = (
  fastingWindows: FastingWindow[],
  weekStart: Date,
  weekEnd: Date
) => {
  const clippedSegments: TimeSegment[] = fastingWindows
    .map((window) => {
      const start = new Date(window.startTime)
      const end = new Date(window.endTime)

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= weekStart || start >= weekEnd) {
        return null
      }

      const clippedStart = start > weekStart ? start : weekStart
      const clippedEnd = end < weekEnd ? end : weekEnd

      if (clippedEnd <= clippedStart) {
        return null
      }

      return {
        start: clippedStart,
        end: clippedEnd,
        durationHours: (clippedEnd.getTime() - clippedStart.getTime()) / (1000 * 60 * 60),
      }
    })
    .filter((segment): segment is TimeSegment => segment !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  if (clippedSegments.length === 0) {
    return []
  }

  const mergedSegments: TimeSegment[] = []

  clippedSegments.forEach((segment) => {
    const lastSegment = mergedSegments[mergedSegments.length - 1]

    if (!lastSegment || segment.start > lastSegment.end) {
      mergedSegments.push({ ...segment })
      return
    }

    if (segment.end > lastSegment.end) {
      lastSegment.end = segment.end
      lastSegment.durationHours =
        (lastSegment.end.getTime() - lastSegment.start.getTime()) / (1000 * 60 * 60)
    }
  })

  return mergedSegments
}

function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'coach' | 'meals' | 'stats' | 'feelings'>('timer')
  const [isDarkMode, setIsDarkMode] = useState(() => parseStoredJson<boolean>('darkMode', false))
  const [currentUser, setCurrentUser] = useState<User | null>(() => parseStoredJson<User | null>('currentUser', null))
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const [lastMealTime, setLastMealTime] = useState<string>(
    currentUser ? localStorage.getItem(`user_${currentUser.id}_lastMealTime`) || '' : ''
  )
  const [hoursElapsed, setHoursElapsed] = useState(0)
  const [currentStage, setCurrentStage] = useState<FastingStage | null>(null)

  const [meals, setMeals] = useState<Meal[]>(() => {
    if (!currentUser) return []
    return parseStoredJson<Meal[]>(`user_${currentUser.id}_meals`, [])
  })
  const [eatingWindows, setEatingWindows] = useState<EatingWindow[]>(() => {
    if (!currentUser) return []
    return parseStoredJson<EatingWindow[]>(`user_${currentUser.id}_eatingWindows`, [])
  })
  const [fastingWindows, setFastingWindows] = useState<FastingWindow[]>(() => {
    if (!currentUser) return []
    return getResetFastingWindows(currentUser.id)
  })
  const [selectedFoodItemId, setSelectedFoodItemId] = useState(FOOD_ITEMS[0].id)
  const [foodQuantity, setFoodQuantity] = useState('1')
  const [foodSearch, setFoodSearch] = useState('')
  const [foodLogError, setFoodLogError] = useState('')
  const [selectedWeek, setSelectedWeek] = useState(() => formatWeekInput(new Date()))
  const [fastingStartTime, setFastingStartTime] = useState('')
  const [fastingEndTime, setFastingEndTime] = useState('')
  const [fastingWindowError, setFastingWindowError] = useState('')
  const [manualEatingWindowStart, setManualEatingWindowStart] = useState('')
  const [eatingWindowFormStart, setEatingWindowFormStart] = useState('')
  const [eatingWindowFormEnd, setEatingWindowFormEnd] = useState('')
  const [eatingWindowFormError, setEatingWindowFormError] = useState('')
  const [editingEatingWindowId, setEditingEatingWindowId] = useState<string | null>(null)
  const [editingFastingWindowId, setEditingFastingWindowId] = useState<string | null>(null)
  const [editingMealId, setEditingMealId] = useState<string | null>(null)
  const [editingMealFoodItemId, setEditingMealFoodItemId] = useState(FOOD_ITEMS[0].id)
  const [editingMealQuantity, setEditingMealQuantity] = useState('1')
  const [editingMealLoggedAt, setEditingMealLoggedAt] = useState('')
  const [editingMealError, setEditingMealError] = useState('')

  const [feelings, setFeelings] = useState<FeelingEntry[]>(() => {
    if (!currentUser) return []
    return parseStoredJson<FeelingEntry[]>(`user_${currentUser.id}_feelings`, [])
  })
  const [feedbackEnergy, setFeedbackEnergy] = useState(5)
  const [feedbackMood, setFeedbackMood] = useState('😐')
  const [feedbackNotes, setFeedbackNotes] = useState('')

  const persistMeals = (updated: Meal[]) => {
    setMeals(updated)
    if (currentUser) {
      localStorage.setItem(`user_${currentUser.id}_meals`, JSON.stringify(updated))
    }
  }

  const persistEatingWindows = (updated: EatingWindow[]) => {
    setEatingWindows(updated)
    if (currentUser) {
      localStorage.setItem(`user_${currentUser.id}_eatingWindows`, JSON.stringify(updated))
    }
  }

  const persistFastingWindows = (updated: FastingWindow[]) => {
    setFastingWindows(updated)
    if (currentUser) {
      localStorage.setItem(`user_${currentUser.id}_fastingWindows`, JSON.stringify(updated))
    }
  }

  const loadUserData = (user: User) => {
    setMeals(parseStoredJson<Meal[]>(`user_${user.id}_meals`, []))
    setEatingWindows(parseStoredJson<EatingWindow[]>(`user_${user.id}_eatingWindows`, []))
    setFastingWindows(getResetFastingWindows(user.id))
    setFeelings(parseStoredJson<FeelingEntry[]>(`user_${user.id}_feelings`, []))
    setLastMealTime(localStorage.getItem(`user_${user.id}_lastMealTime`) || '')
  }

  const handleRegister = async () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Username and password required')
      return
    }

    const existingUsers = parseStoredJson<User[]>('users', [])
    const userExists = existingUsers.some((user) => user.username === loginUsername)

    if (userExists) {
      setLoginError('Username already exists')
      return
    }

    const newUser: User = {
      id: createId(),
      username: loginUsername.trim(),
    }

    const hashedPassword = await hashPassword(loginPassword)
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]))
    localStorage.setItem(
      `user_${newUser.id}_password`,
      JSON.stringify({ type: 'sha256', value: hashedPassword } satisfies StoredPassword)
    )
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    setCurrentUser(newUser)
    loadUserData(newUser)
    setLoginUsername('')
    setLoginPassword('')
    setLoginError('')
    setIsRegistering(false)
  }

  const handleLogin = async () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Username and password required')
      return
    }

    const existingUsers = parseStoredJson<User[]>('users', [])
    const user = existingUsers.find((item) => item.username === loginUsername.trim())

    if (!user) {
      setLoginError('User not found')
      return
    }

    const storedPasswordRaw = localStorage.getItem(`user_${user.id}_password`)
    const storedPassword = parseStoredJson<StoredPassword | null>(`user_${user.id}_password`, null)
    const hashedPassword = await hashPassword(loginPassword)
    const passwordMatches =
      (isStoredPassword(storedPassword) && storedPassword.value === hashedPassword) ||
      storedPasswordRaw === loginPassword

    if (!passwordMatches) {
      setLoginError('Incorrect password')
      return
    }

    if (storedPasswordRaw === loginPassword) {
      localStorage.setItem(
        `user_${user.id}_password`,
        JSON.stringify({ type: 'sha256', value: hashedPassword } satisfies StoredPassword)
      )
    }

    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser(user)
    loadUserData(user)
    setLoginUsername('')
    setLoginPassword('')
    setLoginError('')
    setIsRegistering(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    setLoginUsername('')
    setLoginPassword('')
    setLoginError('')
    setLastMealTime('')
    setMeals([])
    setEatingWindows([])
    setFastingWindows([])
    setFeelings([])
    setFoodLogError('')
    setFastingWindowError('')
    setFastingStartTime('')
    setFastingEndTime('')
    setManualEatingWindowStart('')
    setEatingWindowFormStart('')
    setEatingWindowFormEnd('')
    setEatingWindowFormError('')
    setEditingEatingWindowId(null)
    setEditingFastingWindowId(null)
    setEditingMealId(null)
    setEditingMealError('')
  }

  const currentEatingWindow = [...eatingWindows].reverse().find((window) => window.endTime === null) || null
  const selectedFoodItem = FOOD_ITEMS.find((item) => item.id === selectedFoodItemId) || FOOD_ITEMS[0]
  const todaysMeals = meals.filter((meal) => isSameDay(meal.loggedAt))

  const currentEatingWindowMeals = currentEatingWindow
    ? meals.filter((meal) => meal.eatingWindowId === currentEatingWindow.id)
    : []

  const currentEatingWindowCalories = currentEatingWindowMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const currentEatingWindowProtein = currentEatingWindowMeals.reduce((sum, meal) => sum + meal.protein, 0)

  const filteredFoodItems = FOOD_ITEMS.filter((item) =>
    `${item.name} ${item.category} ${item.serving}`.toLowerCase().includes(foodSearch.toLowerCase())
  )

  const { start: selectedWeekStart, end: selectedWeekEnd } = parseWeekInput(selectedWeek)
  const weeklyFastingSegments = buildMergedWeeklyFastingSegments(
    fastingWindows,
    selectedWeekStart,
    selectedWeekEnd
  )
  const weeklyEatingWindows = eatingWindows.filter((window) => {
    const startTime = new Date(window.startTime)
    return startTime >= selectedWeekStart && startTime < selectedWeekEnd
  })

  const totalWeeklyFastingHours = weeklyFastingSegments.reduce((sum, segment) => sum + segment.durationHours, 0)
  const longestWeeklyFast = weeklyFastingSegments.reduce(
    (max, segment) => Math.max(max, segment.durationHours),
    0
  )
  const averageWeeklyFast =
    weeklyFastingSegments.length > 0
      ? totalWeeklyFastingHours / weeklyFastingSegments.length
      : 0

  useEffect(() => {
    const updateTimer = () => {
      if (currentEatingWindow) {
        const windowStart = new Date(currentEatingWindow.startTime)
        const elapsed = (Date.now() - windowStart.getTime()) / (1000 * 60 * 60)
        setHoursElapsed(elapsed)
        setCurrentStage(FASTING_STAGES[0])
        return
      }

      if (!lastMealTime) {
        setHoursElapsed(0)
        setCurrentStage(null)
        return
      }

      const fastStart = new Date(lastMealTime)
      const elapsed = (Date.now() - fastStart.getTime()) / (1000 * 60 * 60)
      setHoursElapsed(elapsed)
      setCurrentStage(getStageForHours(elapsed))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [currentEatingWindow, lastMealTime])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

  const startEatingWindow = () => {
    if (!currentUser || currentEatingWindow) {
      return
    }

    const now = new Date()
    const nowIso = now.toISOString()
    let linkedFastingWindowId: string | undefined
    let updatedFastingWindows = fastingWindows

    if (lastMealTime) {
      const fastStart = new Date(lastMealTime)

      if (now > fastStart) {
        const durationHours = (now.getTime() - fastStart.getTime()) / (1000 * 60 * 60)
        const newFastingWindow: FastingWindow = {
          id: createId(),
          startTime: lastMealTime,
          endTime: nowIso,
          durationHours,
          stage: getStageForHours(durationHours).name,
          source: 'auto',
        }
        linkedFastingWindowId = newFastingWindow.id
        updatedFastingWindows = [...fastingWindows, newFastingWindow]
        persistFastingWindows(updatedFastingWindows)
      }
    }

    const updatedEatingWindows = [
      ...eatingWindows,
      {
        id: createId(),
        startTime: nowIso,
        endTime: null,
        durationHours: null,
        linkedFastingWindowId,
      },
    ]

    persistEatingWindows(updatedEatingWindows)
    setFoodLogError('')
  }

  const addCurrentActiveEatingWindow = () => {
    if (!currentUser) {
      return
    }

    if (currentEatingWindow) {
      setFoodLogError('Finish the current eating window before adding another one')
      return
    }

    if (!manualEatingWindowStart) {
      setFoodLogError('Choose when the current eating window started')
      return
    }

    const start = new Date(manualEatingWindowStart)
    const now = new Date()

    if (Number.isNaN(start.getTime()) || start > now) {
      setFoodLogError('Active eating window start must be in the past')
      return
    }

    const updatedEatingWindows = [
      ...eatingWindows,
      {
        id: createId(),
        startTime: manualEatingWindowStart,
        endTime: null,
        durationHours: null,
      },
    ]

    persistEatingWindows(updatedEatingWindows)
    setFoodLogError('')
    setManualEatingWindowStart('')
  }

  const resetEatingWindowForm = () => {
    setEatingWindowFormStart('')
    setEatingWindowFormEnd('')
    setEatingWindowFormError('')
    setEditingEatingWindowId(null)
  }

  const saveEatingWindowDefinition = () => {
    if (!currentUser) {
      return
    }

    if (!eatingWindowFormStart) {
      setEatingWindowFormError('Eating window start is required')
      return
    }

    const start = new Date(eatingWindowFormStart)
    const hasEnd = Boolean(eatingWindowFormEnd)
    const end = hasEnd ? new Date(eatingWindowFormEnd) : null

    if (Number.isNaN(start.getTime()) || (end && Number.isNaN(end.getTime()))) {
      setEatingWindowFormError('Please enter valid dates')
      return
    }

    if (end && end <= start) {
      setEatingWindowFormError('Eating window end must be later than start')
      return
    }

    const activeWindowConflict = eatingWindows.some(
      (window) => window.endTime === null && window.id !== editingEatingWindowId
    )
    if (!hasEnd && activeWindowConflict) {
      setEatingWindowFormError('Finish or edit the existing active eating window first')
      return
    }

    const updatedWindow: EatingWindow = {
      id: editingEatingWindowId || createId(),
      startTime: eatingWindowFormStart,
      endTime: hasEnd ? eatingWindowFormEnd : null,
      durationHours: hasEnd ? (end!.getTime() - start.getTime()) / (1000 * 60 * 60) : null,
    }

    const updatedEatingWindows = editingEatingWindowId
      ? eatingWindows.map((window) => (window.id === editingEatingWindowId ? updatedWindow : window))
      : [...eatingWindows, updatedWindow]

    persistEatingWindows(updatedEatingWindows)
    resetEatingWindowForm()
  }

  const startEditingEatingWindow = (window: EatingWindow) => {
    setEditingEatingWindowId(window.id)
    setEatingWindowFormStart(window.startTime.slice(0, 16))
    setEatingWindowFormEnd(window.endTime ? window.endTime.slice(0, 16) : '')
    setEatingWindowFormError('')
  }

  const deleteEatingWindow = (windowId: string) => {
    const updatedEatingWindows = eatingWindows.filter((window) => window.id !== windowId)
    const updatedMeals = meals.filter((meal) => meal.eatingWindowId !== windowId)
    persistEatingWindows(updatedEatingWindows)
    persistMeals(updatedMeals)

    if (editingEatingWindowId === windowId) {
      resetEatingWindowForm()
    }
  }

  const endEatingWindow = () => {
    if (!currentUser || !currentEatingWindow) {
      return
    }

    const now = new Date()
    const nowIso = now.toISOString()
    const updatedEatingWindows = eatingWindows.map((window) => {
      if (window.id !== currentEatingWindow.id) {
        return window
      }

      return {
        ...window,
        endTime: nowIso,
        durationHours: (now.getTime() - new Date(window.startTime).getTime()) / (1000 * 60 * 60),
      }
    })

    persistEatingWindows(updatedEatingWindows)
    setLastMealTime(nowIso)
    localStorage.setItem(`user_${currentUser.id}_lastMealTime`, nowIso)
  }

  const addFoodToCurrentWindow = (foodItem: FoodItem) => {
    if (!currentUser || !currentEatingWindow) {
      setFoodLogError('Start an eating window before logging food')
      return
    }

    const quantity = Number(foodQuantity)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setFoodLogError('Quantity must be greater than zero')
      return
    }

    const loggedAt = new Date().toISOString()
    const newMeal: Meal = {
      id: createId(),
      foodItemId: foodItem.id,
      name: foodItem.name,
      serving: foodItem.serving,
      quantity,
      calories: Math.round(foodItem.calories * quantity),
      protein: Math.round(foodItem.protein * quantity * 10) / 10,
      time: new Date(loggedAt).toLocaleTimeString(),
      loggedAt,
      eatingWindowId: currentEatingWindow.id,
    }

    persistMeals([...meals, newMeal])
    setFoodLogError('')
  }

  const startEditingMeal = (meal: Meal) => {
    setEditingMealId(meal.id)
    setEditingMealFoodItemId(meal.foodItemId)
    setEditingMealQuantity(String(meal.quantity))
    setEditingMealLoggedAt(meal.loggedAt.slice(0, 16))
    setEditingMealError('')
  }

  const cancelEditingMeal = () => {
    setEditingMealId(null)
    setEditingMealError('')
  }

  const saveMealEdit = (mealId: string) => {
    const meal = meals.find((item) => item.id === mealId)
    const foodItem = FOOD_ITEMS.find((item) => item.id === editingMealFoodItemId)
    const quantity = Number(editingMealQuantity)
    const loggedAt = new Date(editingMealLoggedAt)

    if (!meal || !foodItem) {
      setEditingMealError('Meal could not be updated')
      return
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setEditingMealError('Quantity must be greater than zero')
      return
    }

    if (Number.isNaN(loggedAt.getTime())) {
      setEditingMealError('Choose a valid logged time')
      return
    }

    const updatedMeals = meals.map((item) =>
      item.id === mealId
        ? {
            ...item,
            foodItemId: foodItem.id,
            name: foodItem.name,
            serving: foodItem.serving,
            quantity,
            calories: Math.round(foodItem.calories * quantity),
            protein: Math.round(foodItem.protein * quantity * 10) / 10,
            loggedAt: loggedAt.toISOString(),
            time: loggedAt.toLocaleTimeString(),
          }
        : item
    )

    persistMeals(updatedMeals)
    setEditingMealId(null)
    setEditingMealError('')
  }

  const deleteMeal = (mealId: string) => {
    persistMeals(meals.filter((meal) => meal.id !== mealId))
    if (editingMealId === mealId) {
      cancelEditingMeal()
    }
  }

  const addPastFastingWindow = () => {
    if (!currentUser) {
      return
    }

    if (!fastingStartTime || !fastingEndTime) {
      setFastingWindowError('Start and end times are required')
      return
    }

    const start = new Date(fastingStartTime)
    const end = new Date(fastingEndTime)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      setFastingWindowError('End time must be later than start time')
      return
    }

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    const newWindow: FastingWindow = {
      id: editingFastingWindowId || createId(),
      startTime: fastingStartTime,
      endTime: fastingEndTime,
      durationHours,
      stage: getStageForHours(durationHours).name,
      source: 'manual',
    }

    const updatedFastingWindows = editingFastingWindowId
      ? fastingWindows.map((window) => (window.id === editingFastingWindowId ? newWindow : window))
      : [...fastingWindows, newWindow]

    persistFastingWindows(updatedFastingWindows)
    setFastingStartTime('')
    setFastingEndTime('')
    setFastingWindowError('')
    setEditingFastingWindowId(null)
  }

  const startEditingFastingWindow = (window: FastingWindow) => {
    setEditingFastingWindowId(window.id)
    setFastingStartTime(window.startTime.slice(0, 16))
    setFastingEndTime(window.endTime.slice(0, 16))
    setFastingWindowError('')
  }

  const cancelEditingFastingWindow = () => {
    setEditingFastingWindowId(null)
    setFastingStartTime('')
    setFastingEndTime('')
    setFastingWindowError('')
  }

  const deleteFastingWindow = (windowId: string) => {
    persistFastingWindows(fastingWindows.filter((window) => window.id !== windowId))
    if (editingFastingWindowId === windowId) {
      cancelEditingFastingWindow()
    }
  }

  const resetAllFastingWindows = () => {
    persistFastingWindows([])
    cancelEditingFastingWindow()
  }

  const addFeeling = () => {
    if (!feedbackNotes.trim()) {
      return
    }

    const entry: FeelingEntry = {
      id: createId(),
      timestamp: new Date().toLocaleString(),
      energy: feedbackEnergy,
      mood: feedbackMood,
      notes: feedbackNotes,
      stage: currentEatingWindow ? 'Eating Window Active' : currentStage?.name || 'No active fast',
    }

    const updated = [...feelings, entry]
    setFeelings(updated)
    if (currentUser) {
      localStorage.setItem(`user_${currentUser.id}_feelings`, JSON.stringify(updated))
    }
    setFeedbackNotes('')
    setFeedbackEnergy(5)
    setFeedbackMood('😐')
  }

  const editableEatingWindows = eatingWindows
    .slice()
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  const editableFastingWindows = fastingWindows
    .slice()
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())

  const editingMealFoodItem = FOOD_ITEMS.find((item) => item.id === editingMealFoodItemId) || FOOD_ITEMS[0]

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {!currentUser ? (
        <main className="login-screen">
          <div className="login-container">
            <h1>⏱️ FastingPro</h1>
            <p>Track fasting windows, eating windows, and the foods inside them.</p>

            <div className="login-form">
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                className="login-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className="login-input"
              />
              {loginError && <p className="login-error">{loginError}</p>}

              {!isRegistering ? (
                <div className="login-buttons">
                  <button onClick={handleLogin} className="btn-primary">
                    Login
                  </button>
                  <button onClick={() => setIsRegistering(true)} className="btn-secondary">
                    Create Account
                  </button>
                </div>
              ) : (
                <div className="login-buttons">
                  <button onClick={handleRegister} className="btn-primary">
                    Register
                  </button>
                  <button onClick={() => setIsRegistering(false)} className="btn-secondary">
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        <>
          <header className="header">
            <div className="header-left">
              <h1>⏱️ FastingPro</h1>
              <span className="user-badge">👤 {currentUser.username}</span>
            </div>
            <div className="header-right">
              <button
                className="theme-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="Toggle theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </header>

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
              🍽️ Foods
            </button>
            <button
              className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Weekly View
            </button>
            <button
              className={`nav-btn ${activeTab === 'feelings' ? 'active' : ''}`}
              onClick={() => setActiveTab('feelings')}
            >
              💭 How I Feel
            </button>
          </nav>

          <main className="content">
            {activeTab === 'timer' && (
              <section className="tab-content">
                <div className="window-control-panel">
                  <div>
                    <h2>{currentEatingWindow ? 'Current Eating Window' : 'Current Fast'}</h2>
                    <p className="helper-text">
                      Start an eating window when you break your fast. End it when you are done eating to begin the next fast automatically.
                    </p>
                  </div>

                  {!currentEatingWindow ? (
                    <button className="btn-primary control-action" onClick={startEatingWindow}>
                      Start Eating Window Now
                    </button>
                  ) : (
                    <button className="btn-primary control-action" onClick={endEatingWindow}>
                      End Eating Window
                    </button>
                  )}
                </div>

                {currentStage && (
                  <div className="stage-card" style={{ borderColor: currentStage.color }}>
                    <h2 style={{ color: currentStage.color }}>
                      {currentEatingWindow ? 'Eating Window Active' : currentStage.name}
                    </h2>
                    <div className="timer-display">
                      <div className="elapsed-time">{formatDuration(hoursElapsed)}</div>
                      <div className="elapsed-label">
                        {currentEatingWindow ? 'Eating window duration' : 'Time since eating window closed'}
                      </div>
                    </div>
                    <div className="health-effects">
                      <h3>{currentEatingWindow ? 'What To Focus On' : 'Active Effects'}</h3>
                      <ul>
                        {currentStage.healthEffects.map((effect) => (
                          <li key={effect}>✓ {effect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {!currentStage && (
                  <div className="welcome-section">
                    <p>Open an eating window when you start eating, or log past fasting windows below.</p>
                  </div>
                )}

                <div className="fasting-history-panel">
                  <h3>{editingFastingWindowId ? 'Edit Fasting Window' : 'Log a Former Fasting Window'}</h3>
                  <p className="helper-text">
                    Add earlier fasting records manually so your weekly view includes past breaks and durations.
                  </p>
                  <div className="fasting-history-form">
                    <div className="input-group">
                      <label htmlFor="fastingStart">Fast started</label>
                      <input
                        id="fastingStart"
                        type="datetime-local"
                        value={fastingStartTime}
                        onChange={(event) => setFastingStartTime(event.target.value)}
                        className="time-input"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="fastingEnd">Fast ended</label>
                      <input
                        id="fastingEnd"
                        type="datetime-local"
                        value={fastingEndTime}
                        onChange={(event) => setFastingEndTime(event.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>
                  {fastingWindowError && <p className="login-error">{fastingWindowError}</p>}
                  <div className="action-row">
                    <button className="btn-primary inline-action" onClick={addPastFastingWindow}>
                      {editingFastingWindowId ? 'Save Fasting Window' : 'Save Former Fast'}
                    </button>
                    {editingFastingWindowId && (
                      <button className="btn-secondary inline-action secondary-action" onClick={cancelEditingFastingWindow}>
                        Cancel
                      </button>
                    )}
                    <button className="btn-secondary inline-action danger-action" onClick={resetAllFastingWindows}>
                      Reset All Fasting Windows
                    </button>
                  </div>
                </div>

                <div className="fasting-history-panel">
                  <h3>Logged Fasting Windows</h3>
                  {editableFastingWindows.length > 0 ? (
                    <div className="entries-list">
                      {editableFastingWindows.map((window) => (
                        <div key={window.id} className="fasting-window-card">
                          <div>
                            <p className="meal-name">
                              {new Date(window.startTime).toLocaleString()} to {new Date(window.endTime).toLocaleString()}
                            </p>
                            <p className="meal-time">
                              {formatDuration(window.durationHours)} · {window.stage} · {window.source}
                            </p>
                          </div>
                          <div className="entry-actions">
                            <button className="btn-secondary small-action" onClick={() => startEditingFastingWindow(window)}>
                              Edit
                            </button>
                            <button className="btn-secondary small-action danger-action" onClick={() => deleteFastingWindow(window.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No fasting windows logged yet</p>
                  )}
                </div>

                <div className="fasting-history-panel">
                  <h3>{editingEatingWindowId ? 'Edit Eating Window' : 'Define Eating Window'}</h3>
                  <p className="helper-text">
                    Create a completed or active eating window manually, or edit a logged one if the timing needs correction.
                  </p>
                  <div className="fasting-history-form">
                    <div className="input-group">
                      <label htmlFor="eatingWindowStart">Eating window start</label>
                      <input
                        id="eatingWindowStart"
                        type="datetime-local"
                        value={eatingWindowFormStart}
                        onChange={(event) => setEatingWindowFormStart(event.target.value)}
                        className="time-input"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="eatingWindowEnd">Eating window end (optional)</label>
                      <input
                        id="eatingWindowEnd"
                        type="datetime-local"
                        value={eatingWindowFormEnd}
                        onChange={(event) => setEatingWindowFormEnd(event.target.value)}
                        className="time-input"
                      />
                    </div>
                  </div>
                  {eatingWindowFormError && <p className="login-error">{eatingWindowFormError}</p>}
                  <div className="action-row">
                    <button className="btn-primary inline-action" onClick={saveEatingWindowDefinition}>
                      {editingEatingWindowId ? 'Save Eating Window' : 'Add Eating Window'}
                    </button>
                    {editingEatingWindowId && (
                      <button className="btn-secondary inline-action secondary-action" onClick={resetEatingWindowForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="fasting-history-panel">
                  <h3>Logged Eating Windows</h3>
                  {editableEatingWindows.length > 0 ? (
                    <div className="entries-list">
                      {editableEatingWindows.map((window) => (
                        <div key={window.id} className="fasting-window-card">
                          <div>
                            <p className="meal-name">
                              {new Date(window.startTime).toLocaleString()}
                              {window.endTime ? ` to ${new Date(window.endTime).toLocaleString()}` : ' to active'}
                            </p>
                            <p className="meal-time">
                              {window.endTime
                                ? `Duration ${formatDuration(window.durationHours || 0)}`
                                : 'Currently active eating window'}
                            </p>
                          </div>
                          <div className="entry-actions">
                            <button className="btn-secondary small-action" onClick={() => startEditingEatingWindow(window)}>
                              Edit
                            </button>
                            <button className="btn-secondary small-action danger-action" onClick={() => deleteEatingWindow(window.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No eating windows logged yet</p>
                  )}
                </div>
              </section>
            )}

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

            {activeTab === 'meals' && (
              <section className="tab-content">
                <h2>🍽️ Food Logging</h2>

                <div className="window-summary-card">
                  <div>
                    <h3>{currentEatingWindow ? 'Logging Against Current Eating Window' : 'No Active Eating Window'}</h3>
                    <p className="helper-text">
                      {currentEatingWindow
                        ? `Started ${new Date(currentEatingWindow.startTime).toLocaleString()}`
                        : 'Start an eating window first so every food item is attached to the correct period.'}
                    </p>
                  </div>
                  <div className="selected-plan-stats">
                    <span>{currentEatingWindowMeals.length} food entries</span>
                    <span>{currentEatingWindowCalories} cal</span>
                    <span>{currentEatingWindowProtein}g protein</span>
                  </div>
                </div>

                {!currentEatingWindow && (
                  <div className="fasting-history-panel">
                    <h3>Add Current Active Eating Window</h3>
                    <p className="helper-text">
                      If you already started eating earlier, add the active eating window with its real start time.
                    </p>
                    <div className="fasting-history-form">
                      <div className="input-group">
                        <label htmlFor="manualEatingWindowStart">Eating window started</label>
                        <input
                          id="manualEatingWindowStart"
                          type="datetime-local"
                          value={manualEatingWindowStart}
                          onChange={(event) => setManualEatingWindowStart(event.target.value)}
                          className="time-input"
                        />
                      </div>
                    </div>
                    <button className="btn-primary history-action" onClick={addCurrentActiveEatingWindow}>
                      Add Active Eating Window
                    </button>
                  </div>
                )}

                <div className="foods-layout">
                  <div className="food-picker-panel">
                    <h3>Individual Food Items</h3>
                    <div className="input-section compact-inputs">
                      <label htmlFor="foodSearch">Search foods</label>
                      <input
                        id="foodSearch"
                        type="text"
                        value={foodSearch}
                        onChange={(event) => setFoodSearch(event.target.value)}
                        placeholder="Search eggs, tomatoes, bananas..."
                        className="time-input"
                      />
                    </div>

                    <div className="input-section compact-inputs">
                      <label htmlFor="foodItem">Choose an item</label>
                      <select
                        id="foodItem"
                        className="time-input"
                        value={selectedFoodItemId}
                        onChange={(event) => setSelectedFoodItemId(event.target.value)}
                      >
                        {filteredFoodItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} · {item.category} · {item.serving}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-section compact-inputs">
                      <label htmlFor="foodQuantity">Quantity</label>
                      <input
                        id="foodQuantity"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={foodQuantity}
                        onChange={(event) => setFoodQuantity(event.target.value)}
                        className="time-input"
                      />
                    </div>

                    <div className="selected-food-card">
                      <h4>{selectedFoodItem.name}</h4>
                      <p>
                        {selectedFoodItem.category} | {selectedFoodItem.serving}
                      </p>
                      <p>
                        {selectedFoodItem.calories} cal | {selectedFoodItem.protein}g protein per serving
                      </p>
                    </div>

                    {foodLogError && <p className="login-error">{foodLogError}</p>}
                    <button className="btn-primary" onClick={() => addFoodToCurrentWindow(selectedFoodItem)}>
                      Add To Current Eating Window
                    </button>
                  </div>
                </div>

                <div className="meals-log-panel">
                  <h3>Today&apos;s Logged Foods</h3>
                  {todaysMeals.length > 0 ? (
                    <div className="meals-list">
                      {todaysMeals.map((meal) => (
                        <div key={meal.id} className="meal-item">
                          {editingMealId === meal.id ? (
                            <div className="edit-panel">
                              <div className="edit-grid">
                                <select
                                  className="time-input"
                                  value={editingMealFoodItemId}
                                  onChange={(event) => setEditingMealFoodItemId(event.target.value)}
                                >
                                  {FOOD_ITEMS.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name} · {item.serving}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  min="0.25"
                                  step="0.25"
                                  value={editingMealQuantity}
                                  onChange={(event) => setEditingMealQuantity(event.target.value)}
                                  className="time-input"
                                />
                                <input
                                  type="datetime-local"
                                  value={editingMealLoggedAt}
                                  onChange={(event) => setEditingMealLoggedAt(event.target.value)}
                                  className="time-input"
                                />
                              </div>
                              <p className="meal-time">
                                {editingMealFoodItem.calories} cal | {editingMealFoodItem.protein}g protein per serving
                              </p>
                              {editingMealError && <p className="login-error">{editingMealError}</p>}
                              <div className="action-row">
                                <button className="btn-primary inline-action" onClick={() => saveMealEdit(meal.id)}>
                                  Save
                                </button>
                                <button className="btn-secondary inline-action secondary-action" onClick={cancelEditingMeal}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <p className="meal-name">{meal.name}</p>
                                <p className="meal-time">
                                  Qty {meal.quantity} · {meal.serving} · {meal.time}
                                </p>
                              </div>
                              <div className="meal-item-side">
                                <div className="meal-stats">
                                  <p>{meal.calories} cal</p>
                                  <p>{meal.protein}g protein</p>
                                </div>
                                <div className="entry-actions">
                                  <button className="btn-secondary small-action" onClick={() => startEditingMeal(meal)}>
                                    Edit
                                  </button>
                                  <button className="btn-secondary small-action danger-action" onClick={() => deleteMeal(meal.id)}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No foods logged today yet</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'stats' && (
              <section className="tab-content">
                <div className="weekly-header">
                  <div>
                    <h2>📊 Advanced Weekly View</h2>
                    <p className="helper-text">
                      Review fasting time, when each fast was broken, how long the fast lasted, and every food logged during each eating period.
                    </p>
                  </div>

                  <div className="week-selector">
                    <label htmlFor="weekPicker">Week</label>
                    <input
                      id="weekPicker"
                      type="week"
                      value={selectedWeek}
                      onChange={(event) => setSelectedWeek(event.target.value)}
                      className="time-input"
                    />
                  </div>
                </div>

                <div className="stats-container">
                  <div className="stat-card">
                    <h3>Total Fasting</h3>
                    <p className="stat-value">{formatDuration(totalWeeklyFastingHours)}</p>
                    <p className="stat-label">For selected week</p>
                  </div>

                  <div className="stat-card">
                    <h3>Longest Fast</h3>
                    <p className="stat-value">{formatDuration(longestWeeklyFast)}</p>
                    <p className="stat-label">Best fasting stretch</p>
                  </div>

                  <div className="stat-card">
                    <h3>Average Fast</h3>
                    <p className="stat-value">{formatDuration(averageWeeklyFast)}</p>
                    <p className="stat-label">Merged weekly fasting blocks</p>
                  </div>

                  <div className="stat-card">
                    <h3>Eating Windows</h3>
                    <p className="stat-value">{weeklyEatingWindows.length}</p>
                    <p className="stat-label">Broken fasts this week</p>
                  </div>
                </div>

                <div className="weekly-breakdown">
                  <h3>Weekly Breakdown</h3>
                  {weeklyEatingWindows.length > 0 ? (
                    <div className="entries-list">
                      {weeklyEatingWindows
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
                        )
                        .map((window) => {
                          const linkedFast = window.linkedFastingWindowId
                            ? fastingWindows.find((item) => item.id === window.linkedFastingWindowId)
                            : undefined
                          const foods = meals.filter((meal) => meal.eatingWindowId === window.id)
                          const eatingDuration = window.durationHours ?? 0

                          return (
                            <div key={window.id} className="weekly-window-card">
                              <div className="weekly-window-header">
                                <div>
                                  <p className="meal-name">
                                    Fast broken at {new Date(window.startTime).toLocaleString()}
                                  </p>
                                  <p className="meal-time">
                                    {linkedFast
                                      ? `Fast lasted ${formatDuration(linkedFast.durationHours)} · ${linkedFast.stage}`
                                      : 'Started manually without linked fasting record'}
                                  </p>
                                </div>
                                <div className="meal-item-side">
                                  <div className="meal-stats">
                                    <p>
                                      {window.endTime
                                        ? `Eating window ${formatDuration(eatingDuration)}`
                                        : 'Eating window still open'}
                                    </p>
                                    <p>{foods.length} foods logged</p>
                                  </div>
                                  <div className="entry-actions">
                                    <button className="btn-secondary small-action" onClick={() => startEditingEatingWindow(window)}>
                                      Edit
                                    </button>
                                    <button className="btn-secondary small-action danger-action" onClick={() => deleteEatingWindow(window.id)}>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="weekly-food-list">
                                {foods.length > 0 ? (
                                  foods.map((meal) => (
                                    <div key={meal.id} className="weekly-food-item">
                                      <div>
                                        <p className="meal-name">{meal.name}</p>
                                        <p className="meal-time">
                                          Qty {meal.quantity} · {meal.serving} · {new Date(meal.loggedAt).toLocaleTimeString()}
                                        </p>
                                      </div>
                                      <div className="meal-item-side">
                                        <div className="meal-stats">
                                          <p>{meal.calories} cal</p>
                                          <p>{meal.protein}g protein</p>
                                        </div>
                                        <div className="entry-actions">
                                          <button className="btn-secondary small-action" onClick={() => startEditingMeal(meal)}>
                                            Edit
                                          </button>
                                          <button className="btn-secondary small-action danger-action" onClick={() => deleteMeal(meal.id)}>
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="empty-state">No foods logged inside this eating window</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <p className="empty-state">No eating windows found for the selected week</p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'feelings' && (
              <section className="tab-content">
                <h2>💭 How I Feel</h2>

                <div className="feeling-input">
                  <div className="input-group">
                    <label>Energy Level: {feedbackEnergy}/10</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={feedbackEnergy}
                      onChange={(event) => setFeedbackEnergy(Number(event.target.value))}
                      className="slider"
                    />
                  </div>

                  <div className="mood-selector">
                    <label>Mood:</label>
                    <div className="mood-buttons">
                      {['😊', '😐', '😤', '😫', '🤩'].map((emoji) => (
                        <button
                          key={emoji}
                          className={`mood-btn ${feedbackMood === emoji ? 'active' : ''}`}
                          onClick={() => setFeedbackMood(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      value={feedbackNotes}
                      onChange={(event) => setFeedbackNotes(event.target.value)}
                      placeholder="Feeling energized, hungry, focused, or struggling?"
                      className="textarea"
                    />
                  </div>

                  <button className="btn-primary" onClick={addFeeling}>
                    Log How I Feel
                  </button>
                </div>

                <div className="feelings-history">
                  <h3>Your Entries</h3>
                  {feelings.length > 0 ? (
                    <div className="entries-list">
                      {[...feelings].reverse().map((entry) => (
                        <div key={entry.id} className="feeling-card">
                          <div className="entry-header">
                            <span className="mood-emoji">{entry.mood}</span>
                            <span className="energy">Energy: {entry.energy}/10</span>
                            <span className="stage-badge">{entry.stage}</span>
                          </div>
                          <p className="timestamp">{entry.timestamp}</p>
                          <p className="notes">{entry.notes}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No entries yet. Start logging how you feel.</p>
                  )}
                </div>
              </section>
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default App
