# Payment Ledger

A lightweight, bilingual (Greek/English) recurring payments tracker. Add your bills and subscriptions with their own frequency (daily, weekly, or every X months), see monthly/6-month/yearly totals at a glance, and export everything to Excel.

No backend, no database — everything runs client-side in the browser, and nothing is stored anywhere. Refreshing the page clears the list by design.

## Features

- Add payments with a name, amount, and frequency (day / week / every X months)
- Automatic monthly, 6-month, and yearly total calculations, normalized across frequencies
- Per-payment annualized cost shown inline
- Greek / English language toggle — switches all labels, dates, and currency formatting
- One-click export to a real `.xlsx` file (via [SheetJS](https://sheetjs.com/))
- No data persistence — nothing is written to disk, a database, or the cloud

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [lucide-react](https://lucide.dev/) for icons
- [xlsx (SheetJS)](https://www.npmjs.com/package/xlsx) for Excel export

## Project structure

```
src/
  App.jsx           React component: state, handlers, and markup
  App.css           All styling
  constants.js      Static option lists (frequencies, month range)
  translations.js   Greek/English text dictionary
  calculations.js   Pure helper functions (totals, formatting, labels)
  utils.js          Small utilities (id generation)
  main.jsx          Vite/React entry point
index.html
package.json
vite.config.js
```

## Getting started

Requires [Node.js](https://nodejs.org/) installed locally.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).
