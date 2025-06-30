# DonorConnect Security Analysis

This document provides a security analysis of the DonorConnect application. The following vulnerabilities were identified and should be addressed before the application is deployed to a production environment.

**NOTE**: This analysis applies to the initial, mock-data version of the application.

---

## Table of Contents

1.  [**Vulnerability 1: Hardcoded Credentials & Static Verification Token (CRITICAL)**](#vulnerability-1-hardcoded-credentials--static-verification-token-critical)
2.  [**Vulnerability 2: Missing Server-Side Session Management (CRITICAL)**](#vulnerability-2-missing-server-side-session-management-critical)
3.  [**Vulnerability 3: Lack of Rate Limiting on Server Actions (HIGH)**](#vulnerability-3-lack-of-rate-limiting-on-server-actions-high)
4.  [**Vulnerability 4: Insecure Direct Object Reference (IDOR) Potential (HIGH)**](#vulnerability-4-insecure-direct-object-reference-idor-potential-high)
5.  [**Vulnerability 5: Suppressed Build Errors (Informational)**](#vulnerability-5-suppressed-build-errors-informational)
6.  [**Vulnerability 6: Row Level Security (RLS) Not Enabled (Informational / False Positive)**](#vulnerability-6-row-level-security-rls-not-enabled-informational--false-positive)

---

### Vulnerability 1: Hardcoded Credentials & Static Verification Token (CRITICAL)

-   **Finding**: All user and admin credentials, including passwords and codes, were hardcoded directly into the `src/app/actions.ts` file. The verification token sent via email was also a static, unchanging value.
-   **Risk**:
    1.  **Authentication Bypass**: Anyone with access to the source code can log in as any user or admin.
    2.  **No Real Verification**: The verification token is always the same, meaning anyone can craft a URL to bypass the email verification step entirely.
-   **Solution (FIXED)**:
    -   All user data has been moved to a secure database (PostgreSQL) using Prisma.
    -   Passwords are now hashed using `bcryptjs` before being stored.
    -   Verification is handled via a secure two-factor authentication flow with unique, expiring, HMAC-hashed tokens.

### Vulnerability 2: Missing Server-Side Session Management (CRITICAL)

-   **Finding**: The application relied entirely on the browser's `sessionStorage` to track if a user is logged in.
-   **Risk**:
    1.  **Session Hijacking**: An attacker can easily bypass the login process by simply opening the browser's developer tools and setting the `isLoggedIn` flag in `sessionStorage` to `true`.
    2.  **Cross-Site Scripting (XSS)**: If the site has any XSS vulnerabilities, an attacker's script could directly access and manipulate `sessionStorage`, gaining unauthorized access.
-   **Solution (FIXED)**:
    -   A robust, server-side session management system has been implemented using `iron-session`.
    -   Upon successful login, a secure, encrypted, HttpOnly session cookie is created on the server.
    -   All protected server actions and pages now validate this session cookie on the server to confirm the user's identity and permissions.

### Vulnerability 3: Lack of Rate Limiting on Server Actions (HIGH)

-   **Finding**: There were no rate limits on the `loginAction`, `adminLoginAction`, or any other server action.
-   **Risk**:
    1.  **Brute-Force Attacks**: An attacker can make unlimited, repeated attempts to guess credentials on the login endpoints.
    2.  **Denial-of-Service (DoS)**: An attacker could rapidly call actions that trigger expensive operations (like sending emails), potentially exhausting API quotas (e.g., Resend), incurring costs, and preventing legitimate users from receiving emails.
-   **Solution (FIXED)**:
    -   Rate limiting has been implemented on the `loginAction` and `adminLoginAction` server actions using the `rate-limiter-flexible` library.
    -   The system now tracks requests by IP address and will temporarily block an IP after too many attempts within a short period, mitigating the risk of brute-force and denial-of-service attacks.

### Vulnerability 4: Insecure Direct Object Reference (IDOR) Potential (HIGH)

-   **Finding**: Administrative server actions (e.g., approve, delete) in `actions.ts` operated on data based on an `email` or `id` passed from the client, without verifying if the caller is an authorized administrator.
-   **Risk**: If an attacker discovers the format of these server actions, they could potentially call them directly (e.g., using a tool like `cURL` or Postman) to delete or modify any donor's data, even without being logged in as an admin.
-   **Solution (FIXED)**: This vulnerability was resolved as part of fixing Vulnerability #2. All administrative server actions now begin by validating the server-side session to ensure the user making the request is authenticated *and* has the required 'ADMIN' or 'SUPER_ADMIN' role.

### Vulnerability 5: Suppressed Build Errors (Informational)

-   **Finding**: The `next.config.ts` file was configured to ignore TypeScript and ESLint errors during the build process (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`).
-   **Risk**: While not a direct vulnerability, this is a significant code health and security risk. Type and lint errors can often highlight subtle bugs, logical flaws, or insecure coding patterns that could lead to vulnerabilities. Suppressing these errors means potential issues are being hidden.
-   **Solution (FIXED)**: These flags have been set to `false` in `next.config.ts`. The build process will now fail if any TypeScript or ESLint errors are present, enforcing a higher standard of code quality and security.

### Vulnerability 6: Row Level Security (RLS) Not Enabled (Informational / False Positive)

-   **Finding**: An external security scanner (e.g., Supabase Database Linter) reported that Row Level Security (RLS) is not enabled on the public tables (`User`, `Admin`, `DonorProfile`, etc.).
-   **Risk/Analysis**:
    1.  **Context**: This warning is critical for applications where clients (like a user's browser) connect *directly* to the database. Without RLS in that scenario, a logged-in user could potentially query data belonging to other users.
    2.  **Our Architecture**: This application uses a standard `Browser -> Next.js Server -> Database` architecture. The client **never** connects directly to the database. All database access is funneled through our Next.js server actions in `src/app/actions.ts`.
    3.  **Conclusion**: Because our server actions act as a strict gatekeeper—validating user sessions, checking roles, and crafting specific database queries—RLS is not required. Our authorization logic is handled at the application layer, which is a secure and standard practice for this type of architecture. The scanner's finding is therefore a **false positive** for this project.
-   **Solution**: No code change is necessary. The application's design correctly implements security at the server layer, making database-level RLS redundant and unnecessarily complex for this architecture.
