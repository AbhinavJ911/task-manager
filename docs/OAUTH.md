# Google OAuth Authentication

## What is OAuth?
OAuth (Open Authorization) is an open standard for access delegation. It lets users grant websites or applications access to their information on other websites but without giving them their actual passwords. 

In our Task Manager, we use **Google OAuth 2.0**. This allows users to simply click "Log in with Google" instead of manually creating an account with an email, OTP, and password.

## How it Works
1. The user clicks "Login with Google" on our React frontend.
2. The user is redirected to a Google-hosted consent screen securely.
3. Upon approval, Google sends a callback request to our Backend API (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` verify this exchange).
4. The backend evaluates the Google token, extracts the user profile info, creates an account in MongoDB (or syncs with an existing one), and issues our proprietary system JWT (JSON Web Token) to log the user into the task manager.

## How to Configure

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and configure the "OAuth consent screen".
3. Under "Credentials", create an **OAuth Client ID** for a Web application.
4. Set your Authorized redirect URIs (e.g., `http://localhost:5000/api/auth/google/callback`).
5. Copy your Client ID and Client Secret and place them inside `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_google_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_secret
   ```
