"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });

      // Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Navigate to seats page
      router.push("/seats");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
      
      {/* 🏠 Home Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-blue-600 hover:underline"
      >
        ← Home
      </button>

      <h1 className="text-2xl font-bold mb-6">Login to Book Your Seat</h1>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-4 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm">
        create an account?{" "}
        <span
          onClick={() => router.push("/signup")}
          className="text-blue-600 cursor-pointer underline"
        >
          Signup
        </span>
      </p>
    </div>
  );
}
