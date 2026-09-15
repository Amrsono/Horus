# CircleV Store UI & Customer Journey Reintegration Plan

This document preserves the comprehensive plan and architecture for transforming the Horus store into a sleek, modern, white-background e-commerce platform inspired by [CircleV Store](https://circlevstore.com/).

---

## 1. Core Architecture & Visual Identity

- **Color Palette & Theme**:
  - Primary Background: Pure White (`#ffffff`)
  - Typography: Dark Slate (`#0f172a`), muted gray (`#64748b`)
  - Accent / Primary Action Color: Signature CircleV Crimson Red (`#c91c1c` / `#b91c1c`)
  - Urgent Notice Color: Salmon / Coral (`#ef4444` / `#f87171`)
  - Subtle Borders & Dividers: Light Slate (`#e2e8f0` / `#f1f5f9`)
  - Card Hover Effects: Scale `1.03` with smooth ease transitions.

---

## 2. Customer Journey Breakdown

```
1. Homepage / Shop
   ├── Rotating Announcement Ticker (Top Bar)
   ├── Modern White Header with Search, Language, Profile & Cart Badge
   ├── Value Propositions (Fast 48h Delivery, Top Support, Authentic Products)
   └── Clean Product Cards with Sale/New Badges & Quick "Add to Cart"
           │
           ▼
2. Real-time Cart Drawer
   ├── Urgent Reservation Notice: "Checkout within 14:38 so we don't run out of stock"
   ├── Free Shipping Progress Bar (e.g., "Add 250 EGP for Free Delivery")
   ├── Quantity Stepper [- 1 +] and instant price update
   ├── Collapsible Special Instructions (Order Notes) & Discount Code
   └── Prominent Crimson "Check out" CTA
           │
           ▼
3. Streamlined Checkout
   ├── Contact & Shipping Form (Name, Email, WhatsApp Phone, City, Address)
   ├── Payment Selection (Cash on Delivery & Secure Card)
   └── Order Placement -> Instant Database Record & Unique Order Code (e.g. CV-XXXXXX)
           │
           ▼
4. Post-Purchase Confirmation & Follow-up
   ├── Automated Email Confirmation & Invoice Dispatch (/api/orders/confirm-email)
   ├── Direct WhatsApp Order Confirmation Link (Click to chat with prefilled details)
   └── Live Visual Order Tracker (/track and /order-confirmed/[id])
```

---

## 3. Cookie Consent & Granular Preferences

- **Persistent Bottom Privacy Banner**:
  - *"We value your privacy. We use cookies and other technologies to personalize your experience, perform marketing, and collect analytics. Learn more in our Privacy Policy."*
  - Links & Buttons: `Manage preferences`, `Accept`, `Decline`.
- **"Manage Preferences" Modal**:
  - Strictly Necessary (Locked ON)
  - Analytics & Performance (Toggleable)
  - Marketing & Targeting (Toggleable)
  - Functional Cookies (Toggleable)
  - Actions: `Accept All`, `Save Preferences`, `Decline All` (Stored in localStorage).

---

## 4. Urgent Cart Reservation Timer

- Cart items are accompanied by an eye-catching coral badge:
  ```
  Checkout within 14:38 so we don't run out of stock
  ```
- Starts at 15:00 upon adding an item and ticks down live in `MM:SS`.
- Synchronized across the drawer and saved in session/store state.

---

## 5. Automated Communications & Live Tracking

- **Email Confirmation API (`/api/orders/confirm-email`)**:
  - Sends a clean HTML invoice and confirmation with order breakdown, items, totals, and tracking link.
- **WhatsApp Integration (`lib/whatsapp.ts`)**:
  - Direct WhatsApp URL generation sending order summary, customer info, and quick tracking URL to customer / store support.
- **Live Order Tracking (`/track` & `/order-confirmed/[id]`)**:
  - Customer can enter their Order Number or Phone Number.
  - Displays a 4-step live visual timeline:
    1. Order Confirmed
    2. Processing & Packaging
    3. Out for Delivery
    4. Delivered
