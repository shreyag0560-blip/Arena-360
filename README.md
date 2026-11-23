# Arena 360 - Sports Management System (frontend)

React + Vite single-page app. Data is stored in the browser (localStorage), so no backend is needed.

## Run locally
```
npm install
npm run dev
```
Open the link shown in the terminal (usually http://localhost:5173).

## Build
```
npm run build
```

## Test hints (for your test-case table)
- Password rule: min 8 chars, 1 uppercase, 2 numbers, 1 special character
- Failed payment: card number ending in 0000, or UPI ID starting with "fail"
- Trainer booking: Trainers page, filter by sport/experience/rating/price/day, then book a session and pay
- 5 wrong logins locks the account for 30 seconds
