"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import useAuth from "@/hooks/useAuth";

export default function SeatsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  const [seats, setSeats] = useState([]);
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("");

  const fetchSeats = async () => {
    try {
      const res = await api.get("/seats");
      setSeats(res.data);
    } catch (err) {
      console.error("Failed to fetch seats", err);
    }
  };

  const handleBookSeats = async () => {
    try {
      const res = await api.post(`/seats/book-multiple`, { count });
      setMessage(res.data.message);
      fetchSeats();
    } catch (err) {
      setMessage("Booking failed. Please try again.");
    }
  };

  const handleCancelSeat = async (seatId) => {
    try {
      const res = await api.post(`/seats/cancel`, { seat_id: seatId });
      setMessage(res.data.message);
      fetchSeats();
    } catch (err) {
      setMessage("Cancellation failed. Please try again.");
    }
  };

  const handleCancelAllBookings = async () => {
    try {
      const res = await api.post(`/seats/cancel-all`);
      setMessage(res.data.message);
      fetchSeats();
    } catch (err) {
      setMessage("Failed to cancel all bookings.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    if (isAuthenticated) fetchSeats();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Train Seat Booking</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Booking Input */}
      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Number of Seats (max 7):</label>
        <input
          type="number"
          min="1"
          max="7"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="border rounded px-3 py-1 w-24"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleBookSeats}
        >
          Book Seats
        </button>

        {/* Cancel All My Bookings Button */}
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleCancelAllBookings}
        >
          Cancel All My Bookings
        </button>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* Seat Layout */}
      <div className="grid grid-cols-7 gap-4">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`p-4 rounded shadow text-center font-medium relative ${seat.is_booked ? "bg-gray-300 text-gray-700" : "bg-green-100"
              }`}
          >
            Seat {seat.seat_number}
            <br />
            <span className="text-sm">
              {seat.is_booked ? "Booked" : "Available"}
            </span>

            {/* Cancel Button - if user owns the seat */}
            {seat.is_booked && seat.user_id === user?.id && (
              <button
                onClick={() => handleCancelSeat(seat.id)}
                className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
