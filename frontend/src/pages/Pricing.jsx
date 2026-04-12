import { useState, useEffect } from "react";
import axios from "../api/axios";
import Layout from "../components/Layout";
import { CheckCircle2, Star, Zap } from "lucide-react";
import clsx from "clsx";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free");

  useEffect(() => {
    // Fetch current user plan
    const fetchStatus = async () => {
      try {
        const res = await axios.get("/subscription/status");
        setCurrentPlan(res.data.plan || "free");
      } catch (err) {
        console.error("Failed to fetch subscription status:", err);
      }
    };
    fetchStatus();
  }, []);

  const handleSubscribe = async (planType) => {
    try {
      setLoading(true);
      const res = await axios.post("/subscription/create-checkout-session", {
        planType,
      });
      // Redirect to Stripe Checkout
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment initiation failed");
      setLoading(false);
    }
  };

  const plans = [
    {
      type: "basic",
      name: "Basic Plan",
      price: "$4.99",
      icon: Star,
      color: "text-blue-600",
      bgContent: "bg-blue-600 hover:bg-blue-700",
      badge: "Popular",
      features: ["Up to 25 tasks", "Charts & Analytics", "Upcoming Deadlines"],
    },
    {
      type: "advanced",
      name: "Advanced Plan",
      price: "$9.99",
      icon: Zap,
      color: "text-purple-600",
      bgContent: "bg-purple-600 hover:bg-purple-700",
      badge: "Premium",
      features: [
        "Unlimited tasks",
        "Charts & Analytics",
        "Upcoming Deadlines",
        "Task Tags",
        "CSV Export",
        "Priority Badge",
      ],
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            Upgrade your Workflow
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Choose the perfect plan to boost your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.type;

            return (
              <div
                key={plan.type}
                className={clsx(
                  "relative p-8 rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white flex flex-col",
                  isCurrent ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-200"
                )}
              >
                {plan.badge && (
                  <span className={clsx(
                    "absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-white shadow-sm",
                    plan.color === "text-blue-600" ? "bg-blue-500" : "bg-purple-500"
                  )}>
                    {plan.badge}
                  </span>
                )}

                <div className="mb-6 flex items-center gap-3">
                  <div className={clsx("p-3 rounded-xl bg-gray-50", plan.color)}>
                    <Icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                    <p className="text-sm text-gray-500">Billed monthly</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 font-medium">/month</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 size={20} className={plan.color} />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.type)}
                  disabled={loading || isCurrent}
                  className={clsx(
                    "w-full py-4 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",
                    isCurrent
                      ? "bg-gray-100 text-gray-400"
                      : clsx("text-white", plan.bgContent)
                  )}
                >
                  {isCurrent
                    ? "Current Plan"
                    : loading
                    ? "Processing..."
                    : `Upgrade to ${plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
