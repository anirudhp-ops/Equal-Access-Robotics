# Equal Access Robotics

An independent web application for Equal Access Robotics, a nonprofit founded in 2020 that teaches coding and robotics to underserved students.

## What is included

- Public nonprofit landing page and impact story
- Operations dashboard
- Class schedule and tutor assignments
- Student attendance view
- Program and curriculum overview
- Responsive desktop and mobile layouts
- Drizzle database schema and migration starter for sessions and students

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

This is a standard Next.js repository and can be pushed to GitHub and deployed on Vercel, Netlify, Render, Railway, AWS, or another Node.js host.

## Important production note

The current interface uses representative demo records. The schema in `db/schema.ts` is the starting point for persistent students and sessions. Before collecting real student data, add your chosen database, secure authentication, role-based permissions, parental consent handling, and a privacy policy appropriate for minors.

## Main files

- `app/page.tsx` — application interface and interactions
- `app/globals.css` — complete visual system and responsive styling
- `app/layout.tsx` — page metadata
- `db/schema.ts` — student and scheduling data model
- `drizzle/` — generated SQL migration

## License

Copyright © 2026 Equal Access Robotics. All rights reserved.
