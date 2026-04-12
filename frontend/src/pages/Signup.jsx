import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setLoading(true);
      await axios.post("/auth/signup", { name, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
      const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Image/Abstract */}
      <div className="hidden w-1/2 bg-gray-50 lg:block relative overflow-hidden order-2">
        <div className="absolute inset-0 bg-emerald-600/10"></div>
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          alt="Team"
          className="h-full w-full object-cover mix-blend-multiply"
        />
        <div className="absolute bottom-0 left-0 p-12 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
          <h2 className="text-3xl font-bold">Join the community.</h2>
          <p className="mt-2 text-gray-200">Start organizing your work today.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 order-1">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white mb-4">
              <UserPlus size={20} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h1>
            <p className="mt-2 text-gray-500">Get started with your free account today.</p>
          </div>

          <form onSubmit={signup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
