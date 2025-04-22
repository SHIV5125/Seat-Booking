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
            const res = await api.post("/seats/book", { count });
            setMessage(`Booked seats: ${res.data.seats.join(', ')}`);
            fetchSeats();
        } catch (err) {
            setMessage(err.response?.data?.error || "Booking failed");
        }
    };

    const handleCancelAllBookings = async () => {
        try {
            const res = await api.delete("/seats/cancel-all");
            setMessage(`Cancelled all bookings: ${res.data.cancelledSeats.join(', ')}`);
            fetchSeats();
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to cancel all bookings");
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchSeats();
    }, [isAuthenticated]);

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Train Seat Booking</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="1"
                        max="7"
                        value={count}
                        onChange={(e) => setCount(Math.max(1, Math.min(7, Number(e.target.value))))}
                        className="border rounded px-3 py-1 w-24"
                    />
                    <button
                        onClick={handleBookSeats}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Book {count} Seat{count > 1 ? 's' : ''}
                    </button>
                </div>
                
                <button
                    onClick={handleCancelAllBookings}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Cancel All My Bookings
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded ${
                    message.includes("Success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {message}
                </div>
            )}

            <div className="space-y-4">
                {Array.from({ length: 12 }, (_, rowIdx) => {
                    const row = rowIdx + 1;
                    return (
                        <div key={row} className="flex gap-2 items-center">
                            <div className="w-20 font-bold">Row {row}</div>
                            {seats
                                .filter(s => s.row_number === row)
                                .sort((a, b) => a.seat_number - b.seat_number)
                                .map(seat => (
                                    <div
                                        key={seat.seat_number}
                                        className={`p-2 w-12 text-center rounded transition-colors duration-200 ${
                                            seat.is_booked 
                                                ? 'bg-red-400 cursor-not-allowed' 
                                                : 'bg-green-400 hover:bg-green-500'
                                        }`}
                                    >
                                        {seat.seat_number}
                                    </div>
                                ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}