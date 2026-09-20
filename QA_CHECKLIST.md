# SkillBridge — Comprehensive QA & Verification Checklist

This checklist is designed for end-to-end manual QA, UI/UX validation, cross-browser compatibility testing, and responsive design verification across all roles and user flows on **SkillBridge**.

---

## 1. Authentication & Role-Based Access Control (RBAC)

### 1.1 Student Authentication Flow
- [ ] **Registration:**
  - [ ] Navigate to `/register`
  - [ ] Verify validation on empty fields (Name, Email, Password, Role)
  - [ ] Register as a **Student** (`STUDENT` role)
  - [ ] Verify redirect to login or dashboard with success toast
- [ ] **Login:**
  - [ ] Navigate to `/login`
  - [ ] Enter valid Student credentials
  - [ ] Verify JWT token stored securely in `localStorage`
  - [ ] Verify successful redirection to `/dashboard`
- [ ] **Logout:**
  - [ ] Click user profile dropdown in navbar/header -> Click **Logout**
  - [ ] Verify session cleared and redirected to `/login`
  - [ ] Verify protected routes (`/dashboard/*`) cannot be accessed via direct URL

---

### 1.2 Tutor Authentication Flow
- [ ] **Registration:**
  - [ ] Navigate to `/register` and register with role **Tutor** (`TUTOR` role)
- [ ] **Login & Redirection:**
  - [ ] Login with Tutor credentials
  - [ ] Verify redirected to `/tutor` dashboard overview
- [ ] **Role Protection:**
  - [ ] Attempt navigating to `/admin` -> Verify access denied / redirect
  - [ ] Logout and verify clean state

---

### 1.3 Admin Authentication Flow
- [ ] Login with Admin credentials
- [ ] Verify redirected to `/admin` dashboard overview
- [ ] Verify Admin navigation sidebar contains Users, Tutors, Bookings, Categories, Settings

---

## 2. Public Exploration & Tutor Discovery Flow

### 2.1 Tutor Search & Filtering
- [ ] Navigate to `/tutors`
- [ ] **Debounced Subject/Name Search:**
  - [ ] Type a search query (e.g. "Math" or "Physics")
  - [ ] Verify search triggers after 400ms debounce without typing lag
- [ ] **Category Filter:**
  - [ ] Select a category from the dropdown/pills
  - [ ] Verify results update dynamically
- [ ] **Price Range & Rating Filters:**
  - [ ] Adjust min/max hourly rate sliders and rating filters
  - [ ] Verify matching tutors update
- [ ] **Reset Filters:**
  - [ ] Click "Reset Filters" -> Verify all criteria clear and full listing reloads
- [ ] **Mobile Drawer:**
  - [ ] Resize viewport to mobile (< 768px)
  - [ ] Click "Filters" button -> Verify filter drawer slides in smoothly
  - [ ] Apply filters -> Verify drawer closes and updates list

---

### 2.2 Reusable `<TutorCard />` Verification
- [ ] Check card display on **Home (`/`)**, **Tutors (`/tutors`)**, and **Wishlist (`/dashboard/wishlist`)**
- [ ] Verify tutor photo, name, subjects, hourly rate, rating badge, and review count
- [ ] Verify micro-interactions: card hover shadow (`hover:shadow-[0_12px_30px_-8px_rgba(16,185,129,0.22)]`), button active scale
- [ ] Verify Wishlist Heart icon toggle works and updates global count in Navbar badge

---

### 2.3 Tutor Details & Booking Flow
- [ ] Navigate to `/tutors/[id]`
- [ ] Verify tutor bio, qualifications, subjects, hourly rate, and student review list
- [ ] **Booking Modal:**
  - [ ] Click "Book a Session"
  - [ ] Verify dynamic availability slots are populated for the tutor
  - [ ] Select a date and time slot
  - [ ] Verify **Live Price Calculator** updates total price based on duration and hourly rate
  - [ ] Enter study notes and click "Confirm Booking"
  - [ ] Verify success notification and redirect/refresh

---

## 3. Student Dashboard (`/dashboard/*`)

- [ ] **Overview (`/dashboard`):**
  - [ ] Verify `<StatCard />` components (Total Sessions, Upcoming, Completed, Cancelled) reflect real backend counts
  - [ ] Verify upcoming sessions list displays date, time, and tutor info
  - [ ] Verify quick action buttons (Find a Tutor, View All Bookings, Edit Profile) navigate correctly
- [ ] **My Bookings (`/dashboard/bookings`):**
  - [ ] Tabs: "All", "Upcoming", "Past", "Cancelled" filter accurately
  - [ ] If meeting link exists, verify "Join Meeting" button opens Google Meet / Zoom / Teams in a new tab
  - [ ] Test booking cancellation with confirmation modal
  - [ ] Test leaving a review (Rate 1-5 stars + text comment) on completed sessions
- [ ] **Wishlist (`/dashboard/wishlist`):**
  - [ ] Verify all saved tutors appear
  - [ ] Verify remove from wishlist button works with instant UI update
  - [ ] Verify `<EmptyState />` appears when wishlist is empty
- [ ] **Profile Settings (`/dashboard/profile`):**
  - [ ] Update profile photo with instant preview and Cloudinary upload
  - [ ] Edit full name and phone number -> Click "Save Changes" -> Verify toast

---

## 4. Tutor Dashboard (`/tutor/*`)

- [ ] **Overview (`/tutor`):**
  - [ ] Verification Banner: shows "Pending Review", "Profile Verified", or "Rejected" with reason
  - [ ] Upload document cards (Degree, NID, Teaching Certificate) with file validation (JPEG/PNG/WebP, max 5MB)
  - [ ] `<StatCard />` metrics (Total Sessions, Upcoming, Completed, Rating)
- [ ] **Availability Management (`/tutor/availability`):**
  - [ ] Add new weekly time slot (Select day of week + start/end time)
  - [ ] Verify slot badge appears under corresponding weekday
  - [ ] Delete a time slot with confirmation dialog
  - [ ] Verify `<EmptyState />` appears when no slots exist
- [ ] **Sessions Management (`/tutor/sessions`):**
  - [ ] Tabs: "Upcoming", "Completed", "Cancelled"
  - [ ] Set or edit meeting link & platform (Google Meet / Zoom / MS Teams)
  - [ ] Mark session as "Completed"
- [ ] **Tutor Profile (`/tutor/profile`):**
  - [ ] Update Bio, Subjects, Hourly Rate, Teaching Experience, Education
  - [ ] Verify inline skeleton loader displays during initial load

---

## 5. Admin Panel (`/admin/*`)

- [ ] **Overview (`/admin`):**
  - [ ] `<StatCard />` metrics (Total Users, Total Bookings, Total Reviews, Active Categories)
  - [ ] Booking status breakdown cards and Recent Bookings table
- [ ] **Users Management (`/admin/users`):**
  - [ ] Search by name/email, filter by role (`STUDENT`, `TUTOR`, `ADMIN`), filter by status (`ACTIVE`, `BANNED`)
  - [ ] Ban/Unban user with confirmation modal
  - [ ] Verify `<EmptyState />` when no users match filters
- [ ] **Tutor Verification (`/admin/tutors`):**
  - [ ] View pending verification applications
  - [ ] Click "Degree", "NID", or "Certificate" to open interactive document zoom/preview modal
  - [ ] Test "Approve" tutor verification
  - [ ] Test "Reject" with mandatory feedback reason
- [ ] **Bookings Management (`/admin/bookings`):**
  - [ ] Filter bookings by status (Confirmed, Completed, Cancelled)
  - [ ] Verify colored `<Tag>` status badges and `<StatCard />` summary
- [ ] **Categories Management (`/admin/categories`):**
  - [ ] Create a new category with name and description
  - [ ] Edit an existing category
  - [ ] Delete a category with Ant Design `Modal.confirm` danger dialog
- [ ] **Platform Settings (`/admin/settings`):**
  - [ ] Upload new site logo -> Click "Save & Apply Logo" -> Verify live sync in Navbar
  - [ ] Edit hero title & subtitle copy -> Click "Save Text Settings" -> Verify update on Home page
  - [ ] Upload hero banner image -> Click "Save & Apply Hero Banner" -> Verify update on Home page

---

## 6. Global Features, Dark Mode & UI/UX

### 6.1 Dark Mode Verification
- [ ] Toggle Dark Mode via Navbar / Dashboard header toggle
- [ ] Verify dark background (`dark:bg-slate-900`, `dark:bg-slate-950`) and white text across:
  - [ ] Home Page (`/`)
  - [ ] Tutor Discovery (`/tutors`, `/tutors/[id]`)
  - [ ] Student Dashboard (`/dashboard`, `/dashboard/bookings`, `/dashboard/wishlist`, `/dashboard/profile`)
  - [ ] Tutor Dashboard (`/tutor`, `/tutor/availability`, `/tutor/sessions`, `/tutor/profile`)
  - [ ] Admin Dashboard (`/admin`, `/admin/users`, `/admin/tutors`, `/admin/bookings`, `/admin/categories`, `/admin/settings`)
  - [ ] Static pages: About, Help, Contact, Privacy Policy, Blog

### 6.2 Responsive Design & Breakpoints
- [ ] **Desktop (>= 1280px):** Full layout, sticky sidebar, 3-column tutor grid
- [ ] **Tablet (768px - 1024px):** 2-column grid, responsive tables with horizontal scroll
- [ ] **Mobile (< 768px):** Hamburger menu, mobile filter drawer, 1-column cards, full-width buttons

### 6.3 Micro-Interactions & Keyboard Navigation
- [ ] All primary buttons feature `hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`
- [ ] `focus-visible:ring-2 focus-visible:ring-emerald-500` ring visible on Tab keypress across all inputs and buttons
- [ ] Forms submittable via `Enter` key inside input fields
- [ ] Modals and dropdowns dismissible via `Escape` key

### 6.4 Empty States & Edge Cases
- [ ] No bookings: `<EmptyState />` with "Find a Tutor" action
- [ ] No saved wishlist tutors: `<EmptyState />` with "Browse Tutors" action
- [ ] No notifications: `<EmptyState />` with caught-up message
- [ ] No categories: `<EmptyState />` with "Add Category" action
