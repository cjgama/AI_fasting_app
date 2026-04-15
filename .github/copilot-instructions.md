<!-- Custom instructions for the Fasting Tracker project -->

## Project Overview

This is a simple, mobile-friendly web app for tracking fasting cycles. Users can input the time they last ate and see which fasting stage they're currently in, with real-time updates.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with responsive design
- **Storage**: Browser localStorage for persisting last meal time

## Project Structure

```
src/
  ├── App.tsx           # Main app component with fasting logic
  ├── App.css           # Styling for the app
  ├── main.tsx          # React entry point
  └── index.css         # Global styles
```

## Key Features

1. **Datetime Input**: Users select when they last ate
2. **Stage Calculation**: Real-time calculation of current fasting stage:
   - Eating Window (0-4h)
   - Fat Burning (4-12h)
   - Ketosis (12-24h)
   - Deep Ketosis (24h+)
3. **Live Timer**: Updates every second showing elapsed time
4. **Stage Information**: Displays description and time until next stage
5. **Local Storage**: Persists last meal time across sessions

## Development Workflow

- **Dev Server**: `npm run dev` - Runs on http://localhost:5173
- **Build**: `npm run build` - Creates optimized production build
- **Preview**: `npm run preview` - Preview production build locally

## Code Guidelines

- Use TypeScript for type safety
- Keep components small and focused
- Use React hooks (useState, useEffect)
- Mobile-first responsive design
- CSS for styling (no CSS-in-JS libraries needed for this simple app)

## Future Enhancements

- Add statistics tracking
- Multiple simultaneous fasts
- Notifications at stage transitions
- Dark/light theme
- Custom stage definitions
- Data export functionality

## Important Notes

- The app uses browser localStorage, so data persists locally only
- Always test on mobile devices as this is a mobile-first app
- Time calculations use JavaScript Date objects
- No backend required - fully client-side app
