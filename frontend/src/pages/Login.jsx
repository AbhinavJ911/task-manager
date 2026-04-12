import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-4">
              <LogIn size={20} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={login} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Abstract */}
      <div className="hidden w-1/2 bg-gray-50 lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10"></div>
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Office"
          className="h-full w-full object-cover mix-blend-multiply"
        />
        <div className="absolute bottom-0 left-0 p-12 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
          <h2 className="text-3xl font-bold">Manage tasks efficiently.</h2>
          <p className="mt-2 text-gray-200">Stay organized and focused with Task Manager.</p>
        </div>
      </div>
    </div>
  );
}
