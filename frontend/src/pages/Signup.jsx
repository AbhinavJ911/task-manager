import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!name || !email || !password) return;
    await axios.post("/auth/signup", { name, email, password });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Create account 🚀
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Start organizing your work
        </p>

        <input
          placeholder="Name"
          className="w-full mb-4 rounded-lg border px-4 py-3"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          className="w-full mb-4 rounded-lg border px-4 py-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 rounded-lg border px-4 py-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signup}
          className="w-full rounded-lg bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition"
        >
          Sign up
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
