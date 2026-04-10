# Development Conventions

## Architecture — Atomic Design

Organize components in a hierarchy from simple to complex:

```
components/
├── atoms/          # Smallest building blocks, single responsibility
│   ├── Icon.tsx           # Wrapper for lucide-react-native icons
│   ├── Badge.tsx          # Small status/category badge
│   ├── AmountText.tsx     # Formatted money display (Manrope font)
│   └── Divider.tsx        # Horizontal line separator
│
├── molecules/      # Combinations of atoms, still reusable
│   ├── CategoryIcon.tsx       # Icon square with background color
│   ├── DetailCard.tsx         # Account/Date card (icon + label + value)
│   ├── NoteCard.tsx           # Note input card
│   ├── TransactionItem.tsx    # Single transaction row
│   └── ToggleBar.tsx          # Expense/Income toggle
│
├── organisms/      # Complex sections composed of molecules
│   ├── SummaryCard.tsx        # Green amount card with pill + amount
│   ├── CategoryGrid.tsx       # 5-column category selector grid
│   ├── TransactionList.tsx    # Grouped transaction list with swipe
│   ├── CalendarView.tsx       # Monthly calendar with amounts
│   └── DetailsSection.tsx     # Account + Date + Note cards
│
├── templates/      # Page-level layouts (optional, use if needed)
│   └── TabPageLayout.tsx      # Header + content + tab bar wrapper
│
└── screens/        # Full screens (map to Expo Router pages)
    # These live in app/ directory via Expo Router
```

### Rules
- **Atoms**: No internal state, pure presentational, receive all data via props
- **Molecules**: Minimal state, compose 2-3 atoms
- **Organisms**: Can have state, compose multiple molecules
- **Screens**: Connect to stores, handle navigation, compose organisms

## File & Component Naming

### Files
- Components: **PascalCase** — `CategoryIcon.tsx`, `SummaryCard.tsx`
- Hooks: **camelCase** with `use` prefix — `useTransactions.ts`, `useCategories.ts`
- Stores: **camelCase** — `transactionStore.ts`, `categoryStore.ts`
- Utils/helpers: **camelCase** — `formatCurrency.ts`, `dateUtils.ts`
- Constants: **camelCase** — `colors.ts`, `categories.ts`, `fonts.ts`
- Types: **camelCase** — `transaction.ts`, `category.ts`

### Components
- Always use **PascalCase** for component names
- One component per file
- File name must match component name
- Default export for components

```tsx
// ✅ Good
// file: CategoryIcon.tsx
export default function CategoryIcon({ ... }) { ... }

// ❌ Bad
// file: categoryIcon.tsx
export function category_icon({ ... }) { ... }
```

### Props
- Use TypeScript interfaces, named `{ComponentName}Props`
- Destructure props in function signature

```tsx
interface CategoryIconProps {
  name: string;
  backgroundColor: string;
  iconColor: string;
  size?: number;
}

export default function CategoryIcon({
  name,
  backgroundColor,
  iconColor,
  size = 44,
}: CategoryIconProps) { ... }
```

## Import Order

Imports must follow this order, separated by blank lines:

```tsx
// 1. React / React Native
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// 2. Third-party libraries
import { useRouter } from 'expo-router';
import { Coffee, Home } from 'lucide-react-native';

// 3. Internal — stores, hooks, utils
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/utils/formatCurrency';

// 4. Internal — components (atoms → molecules → organisms)
import AmountText from '@/components/atoms/AmountText';
import CategoryIcon from '@/components/molecules/CategoryIcon';
import CategoryGrid from '@/components/organisms/CategoryGrid';

// 5. Internal — constants, types
import { COLORS, FONTS } from '@/constants';
import type { Transaction } from '@/types/transaction';
```

### Import Rules
- Use `@/` path alias (configure in tsconfig.json) — never relative `../../`
- Use named imports for hooks, utils, constants
- Use default imports for components
- Use `import type` for type-only imports
- Never use `import *`

## Constants Structure

```
constants/
├── colors.ts       # All color hex values from Design System
├── fonts.ts        # Font families and size scale
├── categories.ts   # Expense & Income category definitions
├── spacing.ts      # Spacing values (4, 8, 12, 16, 24, 32, 48)
└── index.ts        # Re-export everything
```

### Example — colors.ts
```tsx
export const COLORS = {
  // Brand
  forestGreen: '#1A2E28',
  warmCream: '#F0EFE9',
  nearBlack: '#1A1A1A',
  warmWhite: '#F5F0E8',

  // Semantic
  income: '#27AE72',
  expense: '#E04F3E',
  warning: '#F0A500',

  // UI
  toggleBg: '#E6E3DC',
} as const;
```

### Example — categories.ts
```tsx
import { Coffee, Bus, Home, ShoppingBag } from 'lucide-react-native';

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food', icon: Coffee, bg: '#FFF0E8', color: '#E8784A' },
  { id: 'transport', label: 'Transport', icon: Bus, bg: '#DDEEFF', color: '#4A90E8' },
  // ...
] as const;

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', icon: DollarSign, bg: '#EAFFF3', color: '#27AE72' },
  // ...
] as const;
```

## Styling Conventions (NativeWind + StyleSheet)

### Use NativeWind `className` for layout
```tsx
// ✅ Good — layout, spacing, flex
<View className="flex-row items-center justify-between px-6 mt-4 gap-3">
  <Text className="mt-4 mb-2 px-6">Section Title</Text>
</View>
```

### Use StyleSheet for font styles and fixed sizes
```tsx
// ✅ Good — font styles, fixed sizes, border-radius
const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 13,
  },
});
```

### Use inline style only for dynamic values
```tsx
// ✅ Good — value depends on props or state
<Text style={[styles.amount, { color: amountColor }]}>...</Text>
<View style={{ width: size, height: size, borderRadius, backgroundColor: category.bg }} />
```

### Rules
- `className` — layout only: flex, padding, margin, gap, rounded, bg (static)
- `StyleSheet` — font styles (`fontFamily`, `fontSize`, `color`, `letterSpacing`) and fixed sizes/border-radius
- Inline `style` — dynamic values computed from props or state
- Use `COLORS` constants in StyleSheet; use Tailwind arbitrary values `[#hex]` in className only when no constant exists
- Never hardcode colors directly — always reference `COLORS` constants or Design System
- `textShadow` and custom `fontFamily` cannot be expressed in NativeWind — always use StyleSheet

## State Management (Zustand)

### Store naming and structure
```tsx
// stores/transactionStore.ts
import { create } from 'zustand';
import type { Transaction } from '@/types/transaction';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  addTransaction: (tx) => set((state) => ({
    transactions: [...state.transactions, { ...tx, id: Date.now().toString() }],
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id),
  })),
}));
```

### Rules
- One store per domain (transactions, categories, accounts, settings)
- Store file names: `{domain}Store.ts`
- Export hook: `use{Domain}Store`
- Keep stores thin — business logic in hooks or utils

## TypeScript Rules

- Strict mode enabled
- Use `interface` for component props, `type` for unions and utility types
- No `any` — use `unknown` if truly unknown
- Export types from `types/` folder

```tsx
// types/transaction.ts
export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  accountId: string;
  date: string; // ISO 8601
  note?: string;
  createdAt: string;
}
```

## Project Directory Structure

```
Wise-Man/
├── CLAUDE.md
├── app/                    # Expo Router pages
│   ├── _layout.tsx         # Root layout
│   ├── (tabs)/             # Tab navigator
│   │   ├── _layout.tsx     # Tab bar configuration
│   │   ├── index.tsx       # Home screen
│   │   ├── portfolio.tsx   # Portfolio screen
│   │   ├── events.tsx      # Events screen
│   │   └── analysis.tsx    # Analysis screen
│   └── track.tsx           # Track screen (Stack, not tab)
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── constants/
│   ├── colors.ts
│   ├── fonts.ts
│   ├── categories.ts
│   ├── spacing.ts
│   └── index.ts
├── db/
│   ├── schema.ts           # Drizzle table definitions
│   ├── client.ts           # SQLite connection
│   └── migrations/
├── hooks/
│   ├── useTransactions.ts
│   └── useCategories.ts
├── stores/
│   ├── transactionStore.ts
│   └── settingsStore.ts
├── types/
│   ├── transaction.ts
│   └── category.ts
├── utils/
│   ├── formatCurrency.ts
│   └── dateUtils.ts
├── assets/
│   ├── fonts/
│   └── images/
└── docs/
    ├── design-system.md
    ├── pages.md
    ├── git-conventions.md
    └── dev-conventions.md
```

## Other Best Practices

### Error Handling
- Wrap async operations in try/catch
- Show user-friendly error messages
- Log errors for debugging

### Performance
- Use `React.memo()` for expensive pure components
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive computations
- Use FlatList (not ScrollView + map) for long lists

### Accessibility
- Add `accessibilityLabel` to interactive elements
- Use `accessibilityRole` for buttons and links
- Test with screen reader
