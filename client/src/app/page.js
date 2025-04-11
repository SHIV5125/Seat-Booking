"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Train Seat Booking</h1>

      {/* Navigate to Login Page */}
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={() => router.push("/login")}
      >
        Go to Login
      </button>

      <br />

      {/* Navigate to Signup Page */}
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={() => router.push("/signup")}
      >
        Go to Signup
      </button>
    </div>
  );
}
