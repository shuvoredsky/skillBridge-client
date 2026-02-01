"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking.service";
import { CheckCircle, XCircle, Clock, Calendar, User } from "lucide-react";

interface Booking {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  student: {
    name: string;
    email: string;
  };
}

export default function TutorSessionsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingService.getTutorBookings();
      if (response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (bookingId: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, "COMPLETED");
      await loadBookings();
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const statusCounts = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Teaching Sessions</h1>
        <p className="text-slate-600 mt-1">Manage your upcoming and past sessions</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-3 rounded-xl font-medium transition-all ${
              filter === status
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "bg-white text-slate-700 border border-slate-200 hover:border-blue-500"
            }`}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <p className="text-slate-500">No sessions found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {booking.student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {booking.subject}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-600 text-sm mt-1">
                        <User size={16} />
                        <span>{booking.student.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      booking.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <p className="text-xl font-bold text-slate-900">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                  {booking.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleMarkComplete(booking.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}