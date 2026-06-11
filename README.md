# SeeWe Work — EOR Client Portal (React + Vite)

Migration of the legacy single-file HTML mock (`SeeWeWork_EOR_ClientPortal.html`)
into a maintainable React 19 + Vite + React Router 7 application.

---

## Quick start

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:5173`. Demo credentials
`demo@brightentechnology.com` / `demo1234` (or click **Launch Demo Portal**).

---

## A. Folder structure

```
src/
├── main.jsx                  # React 19 entry, BrowserRouter
├── App.jsx                   # Wraps app in Auth + Sidebar providers, mounts <AppRoutes/>
├── routes/
│   ├── AppRoutes.jsx         # All <Route> definitions
│   └── RequireAuth.jsx       # Route guard
├── layouts/
│   ├── ClientLayout.jsx/.css # Sidebar + main shell for the authenticated app
│   └── AuthLayout.jsx/.css   # Centered card for login + activation
├── pages/                    # One folder per screen, no page > ~150 lines
│   ├── Login/
│   ├── PasswordSetup/
│   ├── Onboarding/{steps}    # 5-step wizard split into step components
│   ├── Dashboard/
│   ├── Employees/
│   ├── EmployeeProfile/{tabs} # 8 tabs, each its own file
│   ├── Leave/
│   ├── Visit/
│   ├── Claims/
│   ├── Company/{tabs}
│   ├── SeeweContact/
│   └── NotFound/
├── components/               # Reusable, presentation-only UI primitives
│   ├── Sidebar/              # Includes sidebarItems.js (config-driven nav)
│   ├── MobileTopbar/
│   ├── PageHeader/
│   ├── Card/
│   ├── StatCard/             # + <StatGrid/> wrapper
│   ├── Alert/
│   ├── Badge/
│   ├── Button/
│   ├── DataTable/            # Mobile-collapsing responsive table
│   ├── SearchFilterBar/
│   ├── Avatar/
│   ├── Timeline/
│   ├── HolidayCard/
│   ├── EmployeeCard/
│   ├── LeaveRequestItem/
│   ├── LeaveBalanceCard/
│   ├── SalaryBreakdown/
│   ├── InfoGrid/
│   ├── FormField/            # Single component covers input/select/textarea
│   ├── ProgressSteps/
│   ├── PageTabs/
│   ├── Modal/
│   └── UploadBox/            # Drag-and-drop file picker
├── hooks/
│   ├── useDocumentTitle.js
│   └── useFilteredList.js    # Generic search + filter for list pages
├── context/
│   ├── AuthContext.jsx       # login/logout/user state
│   └── SidebarContext.jsx    # Mobile sidebar open state
├── services/                 # Promise-based data layer (swap for fetch)
│   ├── employeeService.js
│   ├── leaveService.js
│   └── claimsService.js
├── data/                     # Mock JSON-like records
│   ├── employees.js
│   ├── leaveApplications.js
│   ├── claims.js
│   ├── visits.js
│   └── holidays.js
├── utils/
│   ├── constants.js          # ROUTES, ONBOARDING_STEPS, EMP_PROFILE_TABS
│   └── format.js             # formatHKD, formatBytes, initialsOf
└── styles/
    ├── index.css             # Aggregator
    ├── variables.css         # CSS custom properties (colors, sizes, radii)
    ├── reset.css
    ├── global.css            # .page-hd, .info-grid, .form-row, .section-hd
    ├── utilities.css         # .alert, .ba, .btn variants
    └── responsive.css        # Cross-cutting breakpoints
```

## B. New components created (and the legacy code they replace)

| Legacy concept                    | New component                                      |
|-----------------------------------|----------------------------------------------------|
| `#app-wrap` + `.sidebar` + `.main`| `layouts/ClientLayout`, `components/Sidebar`       |
| `#lg-wrap`, `#pw-setup-wrap`      | `layouts/AuthLayout`                               |
| `pgDash()` + alert div            | `pages/Dashboard/DashboardPage` + `Alert`          |
| `.stat-grid` `.stat-card`         | `<StatGrid>` `<StatCard>`                          |
| `.card`, `.card-hd`               | `<Card title actions>` (children = body)           |
| `.tb` + responsive `td[data-label]`| `<DataTable columns rows>` (handles mobile cards)  |
| `.sf-bar`, `.sf-search`, `.sf-sel`| `<SearchFilterBar>` with controlled state          |
| `.hol-grid` + `.hol-card`         | `<HolidayGrid>` + `<HolidayCard>`                  |
| `.tl-item`                        | `<Timeline items={[…]} />`                         |
| `.leave-req-item`                 | `<LeaveRequestItem>` with approve/reject callbacks |
| `.leave-grid` + `.leave-card`     | `<LeaveBalanceGrid>` + `<LeaveBalanceCard>`        |
| `.salary-breakdown`               | `<SalaryBreakdown items={[…]} />`                  |
| `.info-grid` + `.info-item`       | `<InfoGrid items={[{label,value}]} />`             |
| `.page-tab-row`                   | `<PageTabs tabs active onChange>`                  |
| `.ob-steps` + progress bar        | `<ProgressSteps steps current>`                    |
| `.sig-overlay` modal              | `<Modal open onClose>`                             |
| `.upload-box`                     | `<UploadBox onFile maxMB>`                         |
| `.btn .bdk/.bol/.bred/.bgrn`      | `<Button variant="primary|outline|danger|success">`|
| `.ba .grn/.red/.amb/...`          | `<Badge tone="grn">`                               |
| `.av` initials avatar             | `<Avatar initials color size>`                     |
| `.emp-mob-card`                   | `<EmployeeCard employee>`                          |
| Sidebar nav `<a onclick=...>`     | `<NavLink>` driven by `sidebarItems.js` config     |

## C. React Router map

| Path                  | Component                       |
|-----------------------|---------------------------------|
| `/login`              | `LoginPage` (AuthLayout)        |
| `/activate`           | `PasswordSetupPage` (AuthLayout)|
| `/onboarding`         | `OnboardingPage` (no layout)    |
| `/dashboard`          | `DashboardPage` (ClientLayout)  |
| `/employees`          | `EmployeesPage`                 |
| `/employees/new`      | `AddEmployeePage`               |
| `/employees/:id`      | `EmployeeProfilePage` (8 tabs)  |
| `/leave`              | `LeaveReportPage`               |
| `/visits`             | `VisitApplicationPage`          |
| `/claims`             | `ClaimsPage`                    |
| `/company`            | `CompanySettingsPage` (3 tabs)  |
| `/contact`            | `SeeweContactPage`              |
| `/`                   | redirects to `/dashboard`       |
| anything else         | `NotFoundPage`                  |

All non-auth routes are wrapped in `<RequireAuth>` which redirects to `/login`.

## D. CSS strategy

- **Design tokens** live in `styles/variables.css`. Every legacy hex colour
  was extracted into a named variable so themes can be tuned in one place.
- **Three shared stylesheets** under `styles/`:
  - `global.css` — chrome reused on every page (page-header, info-grid,
    form-row, section-hd)
  - `utilities.css` — `.alert`, `.ba`, `.btn` variants (still as utilities
    because they're tiny and the Badge/Button components re-use them)
  - `responsive.css` — cross-cutting breakpoint overrides
- **Component-scoped CSS**: every component owns its own `Component.css`
  and imports it. Names are kept (`.stat-card`, `.tb`, `.leave-card`, etc.)
  so the original design is preserved 1:1.
- **No duplicated CSS** — the legacy file had ~20 ad-hoc inline `style=""`
  blobs reduced to a handful of utility classes.

## E. Dependencies

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^7.1.0"
}
```

Dev: `vite`, `@vitejs/plugin-react`. No Tailwind, no UI kit — kept light to
match the original visual exactly.

## F. Refactoring notes

1. **Single-file → modular.** The legacy 4055-line HTML contained markup,
   ~600 lines of CSS, 12+ render functions and 8 in-memory data arrays.
   Split as above (≈ 70 files, no page > 150 lines, no component > 120).

2. **State.** The legacy `S` global was split into:
   - **Routing state** → React Router (`/employees/:id`, active sidebar
     link via `<NavLink>`)
   - **Tab state** → local `useState` inside each container page
   - **Auth/sidebar** → React Context (`AuthContext`, `SidebarContext`)

3. **No `onclick=""` / inline JS.** Every legacy handler became a method
   on a component, called via React props. The legacy `closeSidebar()`,
   `goTab()`, `viewEmp()`, etc. are now `<NavLink onClick>` plus
   `<SidebarContext>`.

4. **Service layer.** `services/*.js` exposes Promise-returning functions
   sourced from `data/*.js`. Swapping to a REST/GraphQL backend means
   replacing only the service file — pages don't touch the data files.

5. **Mobile/responsive.** Behaviour preserved. The biggest helper is
   `<DataTable>` which collapses each row into a card with
   `data-label` prefixes on ≤ 768px exactly like the original.

6. **Accessibility quick wins.** Real `<button>`/`<form>`/`<label htmlFor>`
   instead of `<div onclick>`. Modals trap escape, sidebar overlay is
   keyboard-dismissible.

7. **What's intentionally simplified.**
   - Sample data was trimmed to representative rows (the legacy file had
     ~40 hard-coded employees / appraisals / attendance rows). The data
     layer is shaped identically; add records to `data/*.js` to scale up.
   - The signature canvas in the appraisal flow and per-day attendance
     calendar pickers were left as TODOs — both can plug into the existing
     `<Modal>` + `<Card>` shells without further architectural work.

8. **Where to look next.**
   - Add a real `/api` client and replace the `data/*.js` imports inside
     `services/*.js`.
   - Promote sidebar badges to a query-cache (e.g. React Query) — they
     currently re-fetch on every mount.
   - Lift the 8 profile tabs into nested routes (`/employees/:id/salary`,
     `/employees/:id/leave`, …) — the `<PageTabs>` component already
     supports either pattern.
