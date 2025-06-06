# Shop Schedule Status Checker

This Node.js + TypeScript project tells you whether a shop is currently **Open** or **Closed** based on a configurable weekly schedule. It also informs you when the shop will close next (if open) or when it will open next (if closed).

---

## Features

- Supports different open and close times for each day of the week.
- Displays real-time status: Open or Closed.
- If open, shows how many hours remain before closing.
- If closed, shows when the shop will open next:
  - In hours if the next opening is within 24 hours.
  - In days and hours if the next opening is more than 24 hours away.

---

## Project Structure

```
.
├── src
│   ├── index.ts           # Entry point — prints current shop status
│   ├── shopStatus.ts      # Contains main logic for status calculation
│   └── schedule.ts        # Shop schedule data in JSON format
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup & Usage

1. Clone the repo:

   ```bash
   git clone https://github.com/YenishRadadiya/NodeJS-shop-schedule.git
   cd NodeJS-shop-schedule
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile TypeScript:

   ```bash
   npx tsc
   ```

4. Run the program:

   ```bash
   node dist/index.js
   ```

   You should see the current status of the shop printed to the console.

---

## Configure Shop Schedule

Modify `src/schedule.ts` to change the shop's open and close times. Example format:

```ts
export const SHOP_SCHEDULE = [
  { day: 'Mon', open: '07:00 AM', close: '07:00 PM' },
  { day: 'Tue', open: '07:00 AM', close: '07:00 PM' },
  { day: 'Thu', open: '07:00 AM', close: '07:00 PM' },
  { day: 'Fri', open: '07:00 AM', close: '07:00 PM' }
];
```

---

## Notes

- Days not listed in the schedule are considered closed all day.
- Time format follows 12-hour clock with AM/PM.
- The program uses your system's local time to calculate status.

---
