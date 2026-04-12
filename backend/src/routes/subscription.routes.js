const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User.model");
const authMiddleware = require("../middleware/auth.middleware");

// Price IDs will be created dynamically using Stripe's API
// For test mode, we create prices on-the-fly
const PLANS = {
  basic: {
    name: "Basic Plan",
    price: 499, // $4.99 in cents
    features: ["25 tasks", "Charts & Analytics", "Upcoming Deadlines"],
  },
  advanced: {
    name: "Advanced Plan",
    price: 999, // $9.99 in cents
    features: [
      "Unlimited tasks",
      "Charts & Analytics",
      "Upcoming Deadlines",
      "Task Tags",
      "CSV Export",
      "Priority Badge",
    ],
  },
};

/**
 * GET /subscription/status — Get subscription status
 */
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "plan stripeCustomerId subscriptionId planExpiresAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      plan: user.plan || "free",
      subscriptionId: user.subscriptionId,
      planExpiresAt: user.planExpiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /subscription/create-checkout-session — Create Stripe Checkout Session
 */
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const { planType } = req.body; // 'basic' or 'advanced'

    if (!PLANS[planType]) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const plan = PLANS[planType];

    // Create a checkout session with a one-time payment (simulated subscription)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.features.join(", "),
            },
            unit_amount: plan.price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/pricing`,
      metadata: {
        userId: user._id.toString(),
        planType,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout session error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /subscription/verify — Verify session and activate plan
 */
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const planType = session.metadata.planType;
      const userId = session.metadata.userId;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.plan = planType;
      user.subscriptionId = session.subscription;
      user.planExpiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ); // 30 days
      await user.save();

      return res.json({
        success: true,
        plan: user.plan,
        message: `Successfully upgraded to ${planType} plan!`,
      });
    }

    res.status(400).json({ success: false, message: "Payment not completed" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /subscription/cancel — Cancel subscription
 */
router.post("/cancel", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.subscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.subscriptionId);
      } catch (stripeErr) {
        console.error("Stripe cancel error:", stripeErr.message);
      }
    }

    user.plan = "free";
    user.subscriptionId = null;
    user.planExpiresAt = null;
    await user.save();

    res.json({ success: true, message: "Subscription cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /subscription/webhook — Stripe Webhook handler
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || "whsec_test"
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const planType = session.metadata.planType;

        if (userId && planType) {
          await User.findByIdAndUpdate(userId, {
            plan: planType,
            subscriptionId: session.subscription,
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await User.findOneAndUpdate(
          { subscriptionId: subscription.id },
          {
            plan: "free",
            subscriptionId: null,
            planExpiresAt: null,
          }
        );
        break;
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
