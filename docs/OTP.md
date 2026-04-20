# OTP (One-Time Password) Authentication

## What is OTP?
An OTP is a securely generated, temporary passcode valid for only one login session or transaction. In this Task Manager architecture, we integrate an OTP email flow to verify standard email-registered users natively.

## How OTP Works Here

1. The user requests to log in using their registered email.
2. The Backend Node API relies on `auth.routes.js` to execute `Math.random()` to generate a secure 6-digit numeric token.
3. This OTP is instantly cached in the user's MongoDB metadata (`user.loginOtp`) natively alongside a strict 5-minute expiration timestamp (`user.otpExpiresAt`).
4. We utilize an SMTP service (such as NodeMailer hooked up to a Google SMTP relay) to send this code directly to the user's inbox in HTML format.
5. The frontend prompts the user to enter this code. When it receives the user's input natively, it strikes through our `/auth/verify-otp` API endpoint.
6. If the code resolves identically and the clock has not surpassed the 5-minute threshold, the Backend drops the OTP and authenticates the user.

## Configuration Prerequisites
The OTP system requires SMTP email variables natively available in `backend/.env`.
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```
*(To use Gmail, you must navigate to your Google Account Security Dashboard and originate an "App Password" to bypass 2-Factor Authentication headless blocks).*
