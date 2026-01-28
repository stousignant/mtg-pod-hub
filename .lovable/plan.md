

# MTG Pod Tracker Dashboard

A read-only Magic: The Gathering league dashboard with a dark, mystical aesthetic featuring purple and blue accents. Built with React, Tailwind CSS, Shadcn UI, and ready to connect to your Supabase backend.

---

## 🎨 Theme & Styling

**Dark MTG-Inspired Design**
- Deep dark background with purple/blue gradient accents
- Gold highlights for 1st place rankings
- Glowing card borders with subtle purple/blue hues
- Custom planeswalker silhouette avatar for players without photos

---

## 📊 Page 1: Dashboard (Home View)

**Top Navigation Bar**
- "MTG Pod Tracker" title with mystical styling
- Clean, minimal header with dark theme

**Pod Filter Section**
- Dropdown selector to choose from available pods
- Defaults to the first pod in the list
- Filters the leaderboard data accordingly

**Leaderboard Card**
- Responsive table showing pod standings:
  - **Rank** — Calculated position (1st, 2nd, 3rd, etc.)
  - **Player** — Avatar + Name (planeswalker fallback)
  - **Points** — Total accumulated points
  - **Record** — W-D-L format (Wins-Draws-Losses)
  - **Win Rate** — Percentage display
- 🏆 Gold trophy icon and gold accent for 1st place player
- Smooth hover states and responsive mobile layout

---

## 📈 Page 2: Statistics View

**Tab Navigation**
Switch between two views using Shadcn Tabs:

### Tab 1: Pod Stats
- **Bar Chart** showing "Win Rate by Player" for the selected pod
- Built with Recharts
- Purple/blue color scheme matching the theme
- Responsive sizing for mobile

### Tab 2: Deck Stats
- **Table view** of all decks from `deck_stats` view
- Sorted by win rate (descending)
- Columns: Deck Name, Commander (subtle subtitle), Owner, Games Played, Wins, Win Rate %
- Clean typography hierarchy

---

## 🔌 Data Integration

**Mock Data First Approach**
- Create `mockData.ts` with sample data matching exact schema
- Allows immediate UI rendering and testing

**Supabase Client Ready**
- `supabaseClient.ts` configured for:
  - `import.meta.env.VITE_SUPABASE_URL`
  - `import.meta.env.VITE_SUPABASE_KEY`
- Easy swap from mock data to live queries

**React Query Integration**
- Custom hooks for fetching `pod_leaderboard` and `deck_stats`
- Loading states with skeleton loaders
- Error handling with user-friendly messages

---

## 📱 Mobile Responsiveness

- Collapsible table columns on small screens
- Stacked card layouts where appropriate
- Touch-friendly tab navigation
- Readable typography at all breakpoints

---

## 🚫 Constraints Honored

- No authentication or login forms
- Public, view-only dashboard
- All data fetched from read-only views

