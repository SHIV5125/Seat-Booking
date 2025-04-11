"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/signup", { name, email, password });

      if (res.data?.user) {
        // Redirect to login after successful signup
        router.push("/login");
      }
    } catch (err) {
      setError("Signup failed. Email might already be in use.");
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

      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded px-4 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-blue-600 cursor-pointer underline"
        >
          Login
        </span>
      </p>
    </div>
  );
}
