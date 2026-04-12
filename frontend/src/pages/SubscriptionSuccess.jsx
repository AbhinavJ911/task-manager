import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        await axios.post("/subscription/verify", { sessionId });
        setStatus("success");
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 size={64} className="text-indigo-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-500">Please wait while we confirm your subscription...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-8 font-medium">
              Thank you for upgrading. Your premium features are now unlocked and ready to use.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle size={48} className="text-red-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-8 font-medium">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => navigate("/pricing")}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
