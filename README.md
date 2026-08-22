# Business Portfolio — Node.js backend

Standalone Express server. Data is added from the **backend only** — via a script,
not a frontend form. The frontend just fetches and displays.

## Stack (free tier)
- **Server:** Node.js + Express
- **Database:** MongoDB Atlas (free forever, 512MB)
- **Image storage:** Cloudinary (free tier, 25GB)

## Data model
One **Person** can have **multiple companies**, each with its own logo, name, and
keywords:
```
Person {
  name, phone (optional), email (optional),
  companies: [
    { companyName, keywords: [...], logoUrl, logoPublicId }
  ]
}
```

## Routes
| Method | Route         | Purpose                                    |
|--------|---------------|----------------------------------------------|
| POST   | `/api/person` | Create a person + companies (used by the add script, not the frontend) |
| GET    | `/api/person` | Get all people — this is the only route the frontend calls |

---

## 1. Setup

```bash
cd node-backend
npm install
cp .env.example .env
```

Fill in `.env`:
1. **MongoDB Atlas** — free cluster, connection string → `MONGODB_URI`
   (include your database name in the path, e.g. `.../setuconnect?...`).
2. **Cloudinary** — free account, `cloud_name` / `api_key` / `api_secret`.
3. **ASSETS_PATH** — only needed for the add-people script below; point it at
   the folder containing your logo image files.

Run the server:
```bash
npm run dev
```
You should see `MongoDB connected: ...` and `Server running on port 5000`.

---

## 2. Adding people — backend only, no UI form

1. Open `scripts/peopleData.js`. It's pre-filled with your existing 48 business
   members (one company each, pulled from the old hardcoded `App.jsx`).
2. To add someone new, append an entry:
   ```js
   {
     name: 'Jane Doe',
     phone: '9876543210',      // optional
     email: 'jane@example.com', // optional
     companies: [
       {
         companyName: 'Jane's Bakery',
         keywords: ['Custom Cakes', 'Wedding Desserts'],
         logoPath: 'JaneDoeBakery.png', // filename inside ASSETS_PATH
       },
       // add a second object here if she has a second company — same person,
       // just another entry in this array, with its own logoPath
     ],
   },
   ```
3. Put `JaneDoeBakery.png` (or whatever you named it) inside the folder
   `ASSETS_PATH` points to.
4. Run:
   ```bash
   node scripts/addPeople.js
   ```
   It uploads each logo to Cloudinary and inserts the record into MongoDB directly
   — no HTTP request, no frontend involved.

This is safe to re-run any time: people already in the database (matched by
`name`) are skipped, so you can keep appending new entries to the bottom of
`peopleData.js` and just re-run the script whenever you have new members to add.

---

## 3. Frontend — display only

Copy into your React project:
- `src/Api/index.js` — `getAllPersons()` calls `GET /api/person`. (`createPerson`
  is still exported for later if you ever want a frontend form again, but nothing
  currently calls it.)
- `src/App.jsx` — fetches on load, flattens each person's `companies` into the
  flat `{ src, name, company, Keywords }` shape your existing
  `BusinessMembers.jsx` / `OtherBusinessImage.jsx` / `BusinessDetails.jsx` already
  render (your pagination logic there is untouched, and there's no Add Member
  button in this version).

Add to your frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

## Deploying
See the earlier deploy walkthrough for Render (free tier) — same steps apply
here unchanged. Just remember to also set `ASSETS_PATH` won't exist on the
deployed server (it's a local-only script), so run `addPeople.js` from your own
machine against the deployed `MONGODB_URI`, not on Render itself.
# docker build -t business-portfolio-backend .
# docker run --env-file .env -p 5000:5000 business-portfolio-backend