# Design System

## App Icon
- Format: PNG 1024×1024
- Background: `#1A2E28`
- Letter color: `#F5F0E8`
- Layout: W top-left, M bottom-right

## Fonts

### UI Text — DM Sans
- Usage: All UI text (labels, categories, descriptions, buttons)
- Weights: Regular (400) / Medium (500) / Bold (700)

### Financial Numbers — Manrope
- Usage: All money amounts ($3,240.50, $5,200.00, etc.)
- Weights: Bold (700) / ExtraBold (800)

### Font Size Scale

| Name     | Size | Weight | Usage                    |
|----------|------|--------|--------------------------|
| Display  | 38px | 800    | Summary Card big amount  |
| Heading1 | 20px | 700    | Page titles              |
| Heading2 | 17px | 600    | Section titles           |
| Body     | 15px | 500    | Transaction names, body  |
| Caption  | 13px | 400    | Dates, category labels   |
| Micro    | 11px | 400    | Helper text, low opacity |

## Colors

### Brand Colors

| Name         | Hex       | Usage                        |
|--------------|-----------|------------------------------|
| Forest Green | `#1A2E28` | Primary, buttons, emphasis   |
| Warm White   | `#F5F0E8` | Icon letter color            |

### Background Colors

| Name        | Hex       | Usage                        |
|-------------|-----------|------------------------------|
| BG Primary  | `#F0EFE9` | Light mode background        |

### Text Colors

| Name           | Hex       | Usage          |
|----------------|-----------|----------------|
| Text Primary   | `#1A1A1A` | Primary text   |
| Text Secondary | `#999999` | Secondary text |

### Semantic Colors

| Name    | Hex       | Usage                    |
|---------|-----------|--------------------------|
| Income  | `#27AE72` | Income, positive, success|
| Expense | `#E04F3E` | Expense, negative, error |
| Warning | `#F0A500` | Budget warning           |

### UI Component Colors

| Name              | Hex       | Usage                    |
|-------------------|-----------|--------------------------|
| Toggle Background | `#E6E3DC` | Toggle bar groove bg     |

### Theme
- Default: Light mode
- Dark mode: planned for later

## Icons
- All UI icons: SVG format
- Library: `lucide-react-native`
- Never use emoji or image assets as UI icons

## Spacing
- Base unit: 4px
- Common: 4 / 8 / 12 / 16 / 24 / 32 / 48px

## Transaction Categories (Expense)

Unified colors and icons across all pages.
- Home page: square icons 44×44px, border-radius 13px
- Track page: square icons 56×56px, border-radius 16px, outline 2px white semi-transparent, selected state: bg becomes `#1A2E28`, icon becomes white

| Category      | Background | Icon Color | Lucide Icon      |
|---------------|-----------|------------|------------------|
| Food & Drink  | `#FFF0E8` | `#E8784A`  | `Coffee`         |
| Transport     | `#DDEEFF` | `#4A90E8`  | `Bus`            |
| Housing       | `#FFE8E8` | `#D04040`  | `Home`           |
| Shopping      | `#FFF3DC` | `#C8922A`  | `ShoppingBag`    |
| Entertainment | `#F0E0FF` | `#9B59B6`  | `tv-minimal`     |
| Health        | `#D8FFE8` | `#3EAA6E`  | `Heart`          |
| Education     | `#FFF8E0` | `#D4A017`  | `GraduationCap`  |
| Social        | `#DFFAF8` | `#18B5A0`  | `Users`          |
| Other         | `#EDEDED` | `#888888`  | `AlertCircle`    |

## Transaction Categories (Income)

Track page Income mode, 5-column layout, Add button at the end.

| Category   | Background | Icon Color | Lucide Icon        |
|------------|-----------|------------|--------------------|
| Salary     | `#EAFFF3` | `#27AE72`  | `DollarSign`       |
| Freelance  | `#EDE8FF` | `#6C5CE7`  | `BookOpen`         |
| Investment | `#FFF8E8` | `#E8A84A`  | `Activity`         |
| Transfer   | `#E0EEFF` | `#3B7DD8`  | `ArrowLeftRight`   |
| Gift       | `#FFE8F0` | `#D44A7A`  | `Gift`             |
| Refund     | `#FFF0E0` | `#E08A30`  | `RotateCcw`        |
| Interest   | `#E0F5E8` | `#2D8A56`  | `Percent`          |
| Allowance  | `#FFF0F5` | `#C75090`  | `Wallet`           |
| Other      | `#F0F0F0` | `#888888`  | `MoreHorizontal`   |
