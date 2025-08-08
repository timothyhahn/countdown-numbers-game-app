# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Countdown Numbers game is a number-based puzzle game where players use six given numbers and basic arithmetic operations (addition, subtraction, multiplication, division) to reach a target three-digit number.
Game Rules

* Six numbers are provided: n "large" numbers and (6-n) "small" numbers
* Large numbers are drawn from {25, 50, 75, 100}
* Small numbers are drawn from 1-10, inclusive
* Target number is any three-digit number from 101-999
* Negative numbers may not be in the running total
* Numbers can only be integers.

Implementation Goals

* Create a UI that displays the six numbers as well as the target.
* Create a place to drop in numbers, as well as the four main arithmetic operations.
* As you drop in the numbers, automatically calculate from left to right and display the current running total.
* Randomly generate a puzzle each time you load the page.
* [Stretch] Create a solver.


## Development Commands

- `npm run dev` - Start development server with Vite and hot module replacement
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview the production build locally

## Architecture Overview

This is a React + TypeScript + Vite application with TailwindCSS for styling:

- **Build Tool**: Vite with React plugin and TailwindCSS Vite plugin
- **Framework**: React 19 with TypeScript
- **Styling**: TailwindCSS v4
- **Entry Point**: `src/main.tsx` renders the root `App` component
- **Main Component**: `src/App.tsx` contains the primary application logic

## TypeScript Configuration

- Uses project references with separate configs for app (`tsconfig.app.json`) and Node tooling
- Strict TypeScript settings enabled including `noUnusedLocals` and `noUnusedParameters`
- Configured for modern ES2022 target with bundler module resolution

## ESLint Configuration

- Uses flat config format (`eslint.config.js`)
- Includes TypeScript ESLint, React Hooks, and React Refresh plugins
- Configured specifically for React development with Vite

## Project Structure

- `src/` - All application source code
- `public/` - Static assets served by Vite
- `dist/` - Build output (ignored by ESLint)