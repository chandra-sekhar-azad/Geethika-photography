# Responsive Design Guide

## 📱 Breakpoints

The website uses Tailwind CSS breakpoints:

- **Mobile**: < 640px (default)
- **Tablet**: 640px - 1023px (sm: and md:)
- **Desktop**: ≥ 1024px (lg: and xl:)

## 🎨 Responsive Utilities Added

### 1. **Container Classes**
```html
<div class="container-responsive">
  <!-- Auto-adjusts padding and max-width -->
</div>
```

### 2. **Responsive Text Sizes**
```html
<h1 class="text-responsive-4xl">Title</h1>
<p class="text-responsive-base">Body text</p>
```

Automatically scales:
- Mobile: Smaller sizes
- Tablet: Medium sizes
- Desktop: Larger sizes

### 3. **Responsive Spacing**
```html
<div class="spacing-responsive-lg">
  <!-- Padding adjusts by screen size -->
</div>
```

### 4. **Responsive Grid**
```html
<div class="grid-responsive">
  <!-- 1 col mobile, 2 cols tablet, 3-4 cols desktop -->
</div>
```

### 5. **Show/Hide by Device**
```html
<div class="mobile-only">Mobile content</div>
<div class="tablet-up">Tablet & Desktop</div>
<div class="desktop-only">Desktop only</div>
```

### 6. **Responsive Buttons**
```html
<button class="btn-responsive">
  <!-- Size adjusts automatically -->
</button>
```

## 📐 Tailwind Responsive Classes

### Standard Tailwind Breakpoints
```html
<!-- Mobile first approach -->
<div class="text-sm md:text-base lg:text-lg">
  <!-- Small on mobile, base on tablet, large on desktop -->
</div>

<!-- Grid columns -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <!-- Responsive grid -->
</div>

<!-- Padding -->
<div class="p-4 md:p-6 lg:p-8">
  <!-- Increases padding on larger screens -->
</div>

<!-- Flex direction -->
<div class="flex flex-col md:flex-row">
  <!-- Stack on mobile, row on tablet+ -->
</div>

<!-- Width -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Full width mobile, half tablet, third desktop -->
</div>
```

## 🎯 Component-Specific Responsive Patterns

### Navbar
```jsx
// Mobile: Hamburger menu
// Tablet+: Full navigation
<nav class="flex items-center justify-between p-4 md:p-6">
  <div class="mobile-only">
    <button>☰</button>
  </div>
  <div class="tablet-up flex space-x-6">
    <a href="/">Home</a>
    <a href="/shop">Shop</a>
  </div>
</nav>
```

### Product Grid
```jsx
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### Hero Section
```jsx
<div class="py-12 md:py-16 lg:py-24">
  <h1 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
    Welcome
  </h1>
  <p class="text-base md:text-lg lg:text-xl mt-4">
    Description
  </p>
</div>
```

### Cards
```jsx
<div class="card p-4 md:p-6 lg:p-8">
  <img class="w-full h-48 md:h-64 lg:h-80 object-cover" />
  <h3 class="text-lg md:text-xl lg:text-2xl mt-4">Title</h3>
</div>
```

### Forms
```jsx
<form class="space-y-4 md:space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input class="w-full px-3 py-2 md:px-4 md:py-3" />
    <input class="w-full px-3 py-2 md:px-4 md:py-3" />
  </div>
</form>
```

### Checkout Page
```jsx
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
  <div class="lg:col-span-2">
    {/* Form */}
  </div>
  <div class="lg:col-span-1">
    {/* Summary - sticky on desktop */}
    <div class="sticky top-4">
      {/* Order summary */}
    </div>
  </div>
</div>
```

## 📱 Mobile Optimization Tips

### 1. **Touch Targets**
Minimum 44x44px for buttons:
```jsx
<button class="min-h-[44px] min-w-[44px] p-3">
  Click me
</button>
```

### 2. **Readable Text**
Minimum 16px font size:
```jsx
<p class="text-base">
  <!-- 16px on mobile -->
</p>
```

### 3. **Spacing**
More padding on mobile for easier tapping:
```jsx
<div class="p-4 md:p-6">
  <!-- More space on mobile -->
</div>
```

### 4. **Images**
Responsive images:
```jsx
<img 
  src="image.jpg"
  class="w-full h-auto"
  loading="lazy"
/>
```

### 5. **Modals**
Full screen on mobile:
```jsx
<div class="fixed inset-0 md:inset-auto md:max-w-2xl md:mx-auto md:my-8">
  <!-- Full screen mobile, centered modal desktop -->
</div>
```

## 🖥️ Desktop Optimization

### 1. **Max Width**
Prevent content from being too wide:
```jsx
<div class="max-w-7xl mx-auto">
  <!-- Content -->
</div>
```

### 2. **Multi-Column Layouts**
```jsx
<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
  <!-- More columns on larger screens -->
</div>
```

### 3. **Sticky Elements**
```jsx
<div class="lg:sticky lg:top-4">
  <!-- Sticky on desktop only -->
</div>
```

### 4. **Hover Effects**
```jsx
<button class="hover:scale-105 transition-transform">
  <!-- Hover effects for desktop -->
</button>
```

## 📊 Testing Responsive Design

### Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test different devices:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

### Responsive Breakpoints to Test
- **320px** - Small mobile
- **375px** - iPhone
- **768px** - Tablet
- **1024px** - Small desktop
- **1440px** - Large desktop
- **1920px** - Full HD

## 🎨 Common Responsive Patterns

### Stack to Row
```jsx
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">Left</div>
  <div class="w-full md:w-1/2">Right</div>
</div>
```

### Hide on Mobile
```jsx
<div class="hidden md:block">
  Desktop only content
</div>
```

### Show on Mobile Only
```jsx
<div class="block md:hidden">
  Mobile only content
</div>
```

### Responsive Padding
```jsx
<div class="px-4 sm:px-6 lg:px-8">
  <!-- Increases padding on larger screens -->
</div>
```

### Responsive Text Alignment
```jsx
<h1 class="text-center md:text-left">
  <!-- Centered on mobile, left on desktop -->
</h1>
```

## ✅ Checklist for Responsive Pages

- [ ] Text is readable (min 16px)
- [ ] Buttons are tappable (min 44x44px)
- [ ] Images scale properly
- [ ] Navigation works on mobile
- [ ] Forms are easy to fill
- [ ] Content doesn't overflow
- [ ] Spacing is appropriate
- [ ] Grid layouts adapt
- [ ] Modals work on mobile
- [ ] No horizontal scrolling

## 🚀 Quick Fixes

### Text Too Small
```jsx
// Before
<p class="text-sm">Text</p>

// After
<p class="text-base md:text-sm">Text</p>
```

### Content Too Wide
```jsx
// Before
<div class="w-full">Content</div>

// After
<div class="max-w-7xl mx-auto px-4">Content</div>
```

### Grid Not Responsive
```jsx
// Before
<div class="grid grid-cols-4">

// After
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

### Button Too Small
```jsx
// Before
<button class="px-2 py-1">Click</button>

// After
<button class="px-4 py-3 md:px-6 md:py-3">Click</button>
```

## 📱 Mobile-First Approach

Always start with mobile styles, then add larger screen styles:

```jsx
// ✅ Good - Mobile first
<div class="text-sm md:text-base lg:text-lg">

// ❌ Bad - Desktop first
<div class="text-lg md:text-base sm:text-sm">
```

## 🎯 Performance Tips

1. **Lazy load images** on mobile
2. **Reduce animations** on mobile
3. **Simplify layouts** on mobile
4. **Load less data** initially
5. **Use responsive images** (srcset)

---

**All pages are now optimized for mobile, tablet, and desktop!**
