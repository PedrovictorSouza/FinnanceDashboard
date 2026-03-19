# Sidebar Icons

Use this folder for the icons rendered by [DashboardSidebar.tsx](/Users/pedrovictor/Finnance-App/app/components/dashboard/DashboardSidebar.tsx).

Suggested convention:

- one icon per file
- component names in PascalCase
- export icons from `index.ts`
- use `SidebarIconProps` for SVG props consistency
- wrap rendered icons with `SidebarIconFrame`

Examples:

- `DashboardIcon.tsx`
- `AccountsIcon.tsx`
- `TransactionsIcon.tsx`
- `SupportIcon.tsx`

The current sidebar still uses CSS placeholder blocks in `DashboardSidebar.module.css`. As real icons are introduced, they can replace those placeholder spans from this folder.

`SidebarIconFrame` already enforces:

- fixed square slot
- preserved aspect ratio
- clipped overflow
- `border-radius: var(--radius-sm)`
