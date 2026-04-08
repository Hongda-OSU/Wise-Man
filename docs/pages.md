# Page Specifications

> App language: English only. All icons use SVG via `lucide-react-native`, no emoji.

## Global Layout

### Top Header (all tab pages)
- Left: App icon + "Wise Man" name
- Right: Search icon + Profile icon

### Bottom Tab Bar (Fidelity style)

| Position       | Tab Name    | Lucide Icon        | Route       |
|---------------|-------------|-------------------|-------------|
| 1st (left)    | Home        | `House`           | `/`         |
| 2nd           | Portfolio   | `BriefcaseBusiness`| `/portfolio`|
| 3rd (center)  | **Track** (big button) | `DollarSign` | `/track` |
| 4th           | Events      | `CalendarClock`   | `/events`   |
| 5th (right)   | Analysis    | `ChartNoAxesColumn`| `/analysis` |

---

## 🏠 Home

Transaction feed page. First page user sees when opening the app.

**Contents:**
- Top: Summary Card (monthly net balance + progress bar + Income / Expenses)
- List / Calendar view toggle
- Transaction list grouped by date
- Tap a record → navigate to Transaction Detail
- **Swipe right**: item shifts right, green bg + Edit icon + "Edit" text (icon above text)
- **Swipe left**: item shifts left, red bg + Delete icon + "Delete" text (icon above text)
- **Empty State** (no transactions): Summary Card shows $0.00, transaction area shows unDraw illustration (finance-guy-avatar, branded `#1A2E28`) + "No transactions yet" + "Track your income and expenses to start managing your finances" + "Get Started" button (navigates to Track page). Button only visible when transaction list is empty.

---

## ⊕ Track (Stack Page)

Add a new income or expense. Triggered by Tab Bar center big button.
Page type: Stack (not a tab page), no Header, no Tab Bar.

### Top Navigation Bar
- Left: ← back arrow
- Center title: follows toggle state — "Add Expense" or "Add Income"

### Toggle Bar
- Expense / Income switch
- Background: `#E6E3DC`
- Expense active: `#1A2E28`
- Income active: `#27AE72`

### Amount Card (dark green card)
- Background: `#1A2E28`, border-radius 20px
- Bottom-right decorative semi-transparent circle (white 3-4% opacity, clip content)
- **Top pill**: unselected shows "Select a category" (semi-transparent), selected shows category name + icon (white)
- **Amount**: Manrope 48px ExtraBold, `$` same size as digits, centered
- **Hint text**: when empty shows "TAP TO ENTER AMOUNT" (white 30% opacity)
- **Amount input**: tap amount area triggers hidden `TextInput`, opens iOS system `decimal-pad` keyboard, amount updates in real-time in card

### Category Selection
- Section title "CATEGORY"
- 5-column grid, square icons 56×56px, border-radius 16px
- 9 Expense categories + 1 "Add" dashed button (custom category entry)
- Income mode: 9 categories (Salary / Freelance / Investment / Transfer / Gift / Refund / Interest / Allowance / Other) + Add button, 5-column layout
- Selected state: bg becomes `#1A2E28`, icon becomes white
- Amount and category selection order is free, not forced
- Colors and icons: see Design System doc

### Details (horizontal cards)
- Account and Date side-by-side white cards
- Each card: square rounded colored icon (9px radius) + label + value + chevron
- Account icon: blue (`#E8F0FF` / `#4A6AE8`)
- Date icon: gold (`#FFF3DC` / `#C8922A`)
- Date default: Today

### Note Card
- Standalone white card
- Purple square rounded icon (`#F0E8FF` / `#7A4AE8`)
- Light gray input area, placeholder "What's this transaction for?"

### Confirm Button
- Expense: `#1A2E28`, text "Add Expense"
- Income: `#27AE72`, text "Add Income"
- Border-radius 16px, full width

---

## 🔍 Transaction Detail (Stack Page)

View or edit a transaction's details.

**Contents:**
- Full transaction info display
- Edit mode
- Delete button

---

## 💼 Portfolio

Account & asset overview page.

**Contents:**
- Account list (cash, bank cards, credit cards, etc.)
- Each account's current balance
- Total net assets across all accounts
- Add new account entry
- Tap account → view transactions for that account

---

## 📅 Events

Manage recurring/planned financial events (subscriptions, rent, salary, bills, etc.)

**Contents:**
- All Events list
- Frequency: daily / weekly / monthly / yearly
- Next trigger date
- Add / Edit / Delete Event
- Each record can toggle enabled / paused

---

## 📊 Analysis

Spending stats & analysis page.

**Contents:**
- Monthly income/expense bar chart
- Expense category pie chart
- Category detail list (sorted by amount)
- Month switcher

---

## 👤 Profile / Me (top-right entry)

User preferences & app settings.

**Contents:**
- Dark / Light theme toggle
- Currency unit setting
- Category label management (custom)
- Data export (CSV)
- About page