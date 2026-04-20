# JWT (JSON Web Token) Security

## What is a JWT?
A **JSON Web Token** is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

We do NOT use traditional server-side state "Sessions" storing gigabytes of memory just to track who is logged in. Instead, we use stateless JWTs. By giving the client a JWT, the backend trusts the JWT math signature instead of querying a massive session registry database natively.

## Implementation Details

Our JWT architecture is natively implemented in `backend/src/routes/auth.routes.js` and extracted dynamically in `backend/src/middleware/auth.middleware.js`.

### 1. The Signing Phase (Login)
Once the user completes Google OAuth or proves their Email OTP, the system creates a cryptographic lock around their unique Database ID natively using the `JWT_SECRET`.
```javascript
const jwt = require("jsonwebtoken");

// The backend creates an encrypted passport
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
```

### 2. The Verification Phase (Resource Request)
When the React frontend wants to fetch private tasks from `/api/tasks`, it is required to inject the JWT directly into the HTTP headers (`Authorization: Bearer <token>`).

The backend middleware intercepts this HTTP request natively:
```javascript
// Validates cryptographic integrity
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id);
```
If a malicious user attempts to manually tweak the JSON payloads to pretend natively to be a different Admin user, the signature algorithm natively catches the mismatch and violently rejects the payload as an invalid `401 Unauthorized`.
