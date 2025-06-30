# DonorConnect Application Documentation

Welcome to the DonorConnect developer documentation. This guide is designed to help developers of all skill levels understand the project structure, how to make changes, and where to find key pieces of functionality.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Technology Stack](#technology-stack)
3.  [Getting Started](#getting-started)
4.  [Folder Structure](#folder-structure)
5.  [Key Workflows](#key-workflows)
    -   [User Authentication](#user-authentication)
    -   [Admin Panel](#admin-panel)
    -   [Adding a New Page](#adding-a-new-page)
    -   [Creating a New Component](#creating-a-new-component)
    -   [Modifying the Form](#modifying-the-form)
    -   [Implementing an AI Flow](#implementing-an-ai-flow)
6.  [Session Management](#session-management)
7.  [Styling and UI](#styling-and-ui)
8.  [Data Validation](#data-validation)
9.  [Security Analysis](#security-analysis)

---

## 1. Project Overview

DonorConnect is a Next.js web application designed as a prototype for a secure and ethical platform for matching egg donors with recipients. It features a mock login system, a comprehensive health and profile form for donors, and an AI-powered tool to provide suggestions for improving a donor's matchability. It also includes a mock admin panel for managing donor submissions. **All data is currently mocked and is not persisted.**

---

## 2. Technology Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Session Management**: Client-side (mocked, not secure)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Email Provider**: [Resend](https://resend.com/) for mock verification emails.
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)

---

## 3. Getting Started

1.  **Environment Variables**:
    -   Copy the `.env.example` file to a new file named `.env`.
    -   Fill in the required `RESEND_API_KEY` to enable email sending.

2.  **Install Dependencies**: `npm install`
3.  **Start the Development Server**: `npm run dev`

The application will be accessible at `http://localhost:9002`.

---

## 4. Folder Structure

```
.
├── src
│   ├── ai                # Contains all AI-related code using Genkit.
│   ├── app               # Core of the Next.js application (pages and routes).
│   │   ├── admin         # Routes for the administrator panel.
│   │   ├── ...
│   │   └── actions.ts    # Server Actions for handling form submissions and server-side logic.
│   ├── components        # Reusable React components.
│   │   └── auth          # Authentication-related components.
│   │   └── dashboard     # Components specific to the user dashboard.
│   │   └── admin         # Components for the admin panel.
│   ├── hooks             # Custom React hooks.
│   └── lib               # Utility functions, schemas, and libraries.
│
└── ...
```

---

## 5. Key Workflows

### User Authentication

Authentication is currently mocked and insecure.
1.  **Initial Login**: The user enters their credentials on `/login`. The `loginAction` in `src/app/actions.ts` checks against a hardcoded user object.
2.  **Verification Email**: If the credentials are correct, a mock verification link is sent to the user's email via Resend.
3.  **Verification Page**: Clicking the link takes the user to `/auth/verify/[token]`. This page validates a static token.
4.  **Session Creation**: Upon "successful" verification, a flag (`isLoggedIn`) is set in the browser's `sessionStorage`. This is **not secure** and is for demonstration purposes only.
5.  **Redirection**: The user is redirected to the `/dashboard`.

### Admin Panel

The admin panel operates entirely on mocked, static data.
1.  **Admin Login**: The `adminLoginAction` validates against a hardcoded admin email and password.
2.  **Admin Dashboard**: The dashboard page (`src/app/admin/dashboard/page.tsx`) uses a static array of donor data. All filtering and interactions are performed on this client-side data.

---

## 6. Session Management

-   **Insecure Sessions**: The application uses `sessionStorage` to store a login flag. This is easily manipulated and **not suitable for production**.
-   **Session Timeout**: The `SessionTimeout` component uses the `react-idle-timer` library to detect user inactivity. After a set period, it redirects the user to `/session-expired`. This is a client-side-only feature.

---

## 7. Styling and UI

-   **Global Styles**: Modify `src/app/globals.css` to change the application-wide theme.
-   **Component Styles**: Use Tailwind CSS utility classes directly in your `.tsx` components.

---

## 8. Data Validation

All form data is validated using [Zod](https://zod.dev/).
-   **Form Schemas**: The validation rules for all forms are defined in `src/lib/schemas.ts`.
-   **Server-Side Validation**: Server Actions in `src/app/actions.ts` use the same schemas to re-validate data on the server before processing.

---

## 9. Security Analysis

A detailed security audit of this application has been conducted. The report identifies several critical vulnerabilities that **must be addressed** before this application is used in a production environment.

Please review the full report here: [**SECURITY.md**](./SECURITY.md)
