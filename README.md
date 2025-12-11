# Plumberg Console

Yearly stock dashboard One-Stop-Shop with Bloomberg Terminal-style interface.

## Overview

A React TypeScript frontend application featuring a retro Bloomberg Terminal aesthetic for managing stock portfolios across a yearly calendar view.

## Features

- **Bloomberg Terminal Retro Style**: Black background with iconic orange (#ff8c00) and green accents
- **Portfolio Calendar Matrix**: 12-column monthly view for the entire year
- **Stock Position Management**: Add/remove stock tickers with portfolio percentage allocation
- **Interactive UI**: Real-time updates with clean, monospace typography

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Technology Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom Bloomberg Terminal-inspired styling

## Usage

1. Enter a stock ticker symbol (e.g., AAPL, GOOGL, MSFT) in the input field
2. Enter the portfolio percentage allocation (0-100)
3. Click "ADD" or press Enter to add the position
4. Each position displays across all 12 months
5. Click "REMOVE" to delete a position
6. Portfolio percentages can be edited inline
