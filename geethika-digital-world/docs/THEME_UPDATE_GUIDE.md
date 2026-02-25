# Theme Update Guide - Valentine to Orange/Brand

This guide helps you replace all Valentine theme colors with the new Orange/Brand theme.

## Color Mapping

Replace these Valentine colors with Orange/Brand colors:

```
valentine-red        → orange-primary
valentine-darkRed    → orange-dark
valentine-pink       → orange-hover
valentine-rose       → orange-primary
valentine-lightPink  → orange-light
```

## Find and Replace Instructions

Use your code editor's find and replace feature (Ctrl+H or Cmd+H) to replace these patterns across all `.jsx` files in the `client/src` directory:

### Text Colors
1. `text-valentine-red` → `text-orange-primary`
2. `text-valentine-pink` → `text-orange-hover`
3. `text-valentine-rose` → `text-orange-primary`
4. `text-valentine-darkRed` → `text-orange-dark`
5. `text-valentine-lightPink` → `text-orange-light`

### Background Colors
1. `bg-valentine-red` → `bg-orange-primary`
2. `bg-valentine-pink` → `bg-orange-hover`
3. `bg-valentine-rose` → `bg-orange-primary`
4. `bg-valentine-darkRed` → `bg-orange-dark`
5. `bg-valentine-lightPink` → `bg-orange-light`

### Border Colors
1. `border-valentine-red` → `border-orange-primary`
2. `border-valentine-pink` → `border-orange-hover`
3. `border-valentine-rose` → `border-orange-primary`

### Hover States
1. `hover:text-valentine-red` → `hover:text-orange-primary`
2. `hover:bg-valentine-red` → `hover:bg-orange-primary`
3. `hover:border-valentine-red` → `hover:border-orange-primary`

### Gradients
1. `from-valentine-red` → `from-orange-primary`
2. `to-valentine-red` → `to-orange-primary`
3. `from-valentine-pink` → `from-orange-hover`
4. `to-valentine-pink` → `to-orange-hover`

### Fill Colors (for icons)
1. `fill-valentine-red` → `fill-orange-primary`
2. `fill-valentine-pink` → `fill-orange-hover`

## Files to Update

Priority files (user-facing):
- `client/src/pages/AboutPage.jsx`
- `client/src/pages/CartPage.jsx`
- `client/src/pages/CheckoutPage.jsx`
- `client/src/pages/ForgotPasswordPage.jsx`
- `client/src/pages/MyOrdersPage.jsx`
- `client/src/pages/OrderDetailPage.jsx`
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/SignUpPage.jsx`
- `client/src/pages/ShopPage.jsx`
- `client/src/pages/ProductDetailPage.jsx`
- `client/src/pages/ServicesPage.jsx`
- `client/src/pages/GalleryPage.jsx`

## After Replacement

1. Search for any remaining "valentine" references: Search for `valentine` in all files
2. Update the `.valentine-gradient` class usage to use the new gradient
3. Test all pages to ensure text is visible and colors look correct
4. Check both light and dark backgrounds

## Quick VS Code Find & Replace

1. Open VS Code
2. Press `Ctrl+Shift+H` (Windows/Linux) or `Cmd+Shift+H` (Mac)
3. Click "Use Regular Expression" button (.*icon)
4. In "Find" field: `(text|bg|border|from|to|fill|hover:text|hover:bg|hover:border)-valentine-(red|pink|rose|darkRed|lightPink)`
5. In "Replace" field: Use the mapping above for each match
6. Click "Replace All" in files filter: `client/src/**/*.jsx`

## Manual Check Required

Some components may need manual review:
- Components with complex gradient combinations
- Components with opacity values (e.g., `/20`, `/30`)
- Components with special Valentine-themed text or labels
