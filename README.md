# Fasting Tracker 🏋️

A simple, mobile-friendly web app to track your fasting cycles and monitor which fasting stage you're currently in.

## Features

✨ **Easy Time Input** - Simply enter when you last ate using a datetime picker
⏱️ **Real-time Timer** - Watch the elapsed time since your last meal update in real-time
📊 **Stage Display** - See your current fasting stage with descriptive information
🎯 **Stage Progression** - Get notified about when you'll reach the next fasting stage
📱 **Mobile Optimized** - Beautiful, responsive design that works great on phones
💾 **Local Storage** - Your last meal time is saved locally in your browser

## Fasting Stages

The app tracks 4 common fasting stages:

1. **Eating Window** (0-4 hours)
   - Your digestive system is actively working
   - Higher insulin levels

2. **Fat Burning** (4-12 hours)
   - Body transitions from burning glucose to burning fat
   - Insulin levels are dropping

3. **Ketosis** (12-24 hours)
   - Body is in ketosis state
   - Enhanced fat burning and mental clarity

4. **Deep Ketosis** (24+ hours)
   - Extended fasting benefits
   - Cellular repair and autophagy processes

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Usage

1. Open the app in your browser
2. Click on the "When did you last eat?" input field
3. Select the date and time of your last meal
4. The app will automatically calculate your current fasting stage and display:
   - Your current stage name
   - Time elapsed since your last meal
   - Description of your current stage
   - Time until the next stage

The app saves your last meal time to your browser's local storage, so it will remember your fasting session even if you close and reopen the app.

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling and responsive design

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Browser Compatibility

Works on all modern browsers including:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Tips for Fasting

- Start with shorter fasts (16-18 hours) and gradually increase
- Stay hydrated during fasting periods
- Black tea and coffee are typically fine during fasting
- Consult with a healthcare provider before starting extended fasts

## Future Features

- [ ] Historical tracking and statistics
- [ ] Custom fasting stage definitions
- [ ] Notifications when stages change
- [ ] Dark/Light theme toggle
- [ ] Multiple fast tracking
- [ ] Data export

---

Happy fasting! 🙌
