# Context Brief

## Task Summary

Creating the initial "Priority Terminal" UI prototype for user review. Incorporates Firebase Auth and Vercel DB sync states.

## Current Implementation

- **Login Gate**: Displays Firebase Auth overlay on launch. Clicking "[ BYPASS FOR REVIEW ]" or inputting an email hides it and unlocks the app.
- **Header**: Contains live Vercel DB latency indicator and current active user email.
- **Main Terminal**: Houses Eisenhower quadrants for sorting task positions.
- **Stats & Advisory**: Evaluates active quadrants and provides trading-style advisory logs.

## What Changed Recently

- Updated `index.html` and `src/js/app.js` with Firebase and Vercel mock designs.
- Configured local Git to track all new protocol changes.
- Pushed clean codebase to GitHub.

## Need To Remember

- Keep layouts ultra-clean and high-contrast (trader theme).
- Keep code fully operational via static local opening so the user can easily review the UI.

## Do Not Touch

- Do not initialize real SDK credentials until the user reviews and provides their live Firebase config.

## Next Action

- Await user approval on the design layout.
