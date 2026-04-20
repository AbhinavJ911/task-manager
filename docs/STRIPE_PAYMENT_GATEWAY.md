# Stripe Payment Gateway

## What is Stripe?
Stripe is a payment processing platform that allows applications to safely execute monetary transactions, handle user subscriptions, and process credit cards over the internet without ever having to store sensitive credit card data on your own databases.

## How it is Implemented
In this Task Manager, Stripe is configured using two primary components:
1. **Frontend**: The `VITE_STRIPE_PUBLIC_KEY` is injected so that React components can securely tokenize credit card information via the Stripe Elements SDK.
2. **Backend**: The `STRIPE_SECRET_KEY` in `backend/.env` is used to communicate directly with Stripe's backend to create Customer profiles, verify checkout sessions, and process subscription upgrades.

## How to Run / Test

1. Create a free Stripe Developer Account on [stripe.com](https://stripe.com/).
2. Grab your "Test Mode" Public and Secret keys.
3. Add `VITE_STRIPE_PUBLIC_KEY=pk_test_...` to your `frontend/.env`.
4. Add `STRIPE_SECRET_KEY=sk_test_...` to your `backend/.env`.
5. Run the application (either via Docker or Minikube). When you upgrade to a premium account in the app, the test cards provided by Stripe (e.g., `4242 4242 4242 4242`) will allow simulate successful transactions.
