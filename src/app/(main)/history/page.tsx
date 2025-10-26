// HistoryPage.tsx

"use client";

import { QRCodeCanvas } from "qrcode.react";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useUser } from "@clerk/nextjs";

// Expected data structure from API (populated with event details)
interface PopulatedBooking {
  _id: string; // Booking ID
  eventId: {
    _id: string;
    title: string;
    date: string; // Event Date
    location: {
      name: string;
      location: { name: string };
    };
  };
  userId: string;
  bookingDate: string;
  status: "confirmed" | "cancelled";
}

// Local display structure
interface HistoryEvent {
  id: string; // Booking ID
  title: string;
  bookingDate: string; // Date the user booked (formatted string)
  eventDate: string; // Actual event date (ISO string for filtering)
  location: string;
  status: "Confirmed" | "Cancelled"; // Booking status
  eventStatus: "past" | "upcoming"; // Event time status
}

const LoadingIcon = () => (
  <Icon icon="mdi:loading" className="h-6 w-6 animate-spin mr-2" />
);

export default function HistoryPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [bookings, setBookings] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | "past" | "upcoming">("upcoming");

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/bookings/user/${user.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch booking history.");
        }

        const data: PopulatedBooking[] = await response.json();

        const transformedBookings: HistoryEvent[] = data.map(booking => {
          const eventDate = new Date(booking.eventId.date);
          const now = new Date();

          const eventStatus: "past" | "upcoming" = eventDate < now ? "past" : "upcoming";

          const locationName = booking.eventId.location?.name || "Unknown Location";

          return {
            id: booking._id,
            title: booking.eventId.title,
            bookingDate: new Date(booking.bookingDate).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric"
            }),
            eventDate: booking.eventId.date,
            location: `${locationName}`,
            status: booking.status === "confirmed" ? "Confirmed" : "Cancelled",
            eventStatus: eventStatus
          };
        });

        setBookings(transformedBookings);

      } catch (e: any) {
        console.error("Fetch Bookings Error:", e);
        setError(`Could not load booking history: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isLoaded, isSignedIn, user?.id]);

  const filteredEvents = bookings.filter((event) => {
    if (filter === "all") return true;
    // Filter based on event status (past/upcoming)
    return event.eventStatus === filter;
  });


  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-xl text-purple-600 flex items-center font-semibold">
          <LoadingIcon /> Loading user data...
        </p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6">Please sign in to view your booking history.</p>
        <a href="/sign-in" className="flex items-center text-purple-600 hover:text-purple-800 transition font-medium">
          <Icon icon="mdi:login" className="mr-2 h-5 w-5" /> Go to Sign In
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-xl text-purple-600 flex items-center font-semibold">
          <LoadingIcon /> Loading booking history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-6">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-black font-sans">
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          My Bookings
        </h1>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          {["all", "upcoming", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-purple-50"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} Events
            </button>
          ))}
        </div>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-6 bg-white rounded-xl shadow-md border border-black transition hover:shadow-lg"
                style={{ boxShadow: "2px 2px 1px rgb(0,0,0)" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Event Time Status */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${event.eventStatus === "past"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {event.eventStatus === "past" ? "Past" : "Upcoming"}
                    </span>
                    {/* Booking Status */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${event.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Event Date: {new Date(event.eventDate).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-500 mt-0.5">Booked On: {event.bookingDate}</p>
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <Icon
                    icon="mdi:map-marker"
                    className="h-4 w-4 mr-1 text-purple-500"
                  />
                  {event.location}
                </p>

                <div className="mt-4 flex justify-center">
                  <QRCodeCanvas size={128} value={`Booking-ID:${event.id}|User:${user.id}|Event:${event.title}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg mt-8">
            No {filter} events found in your history. Time to book some! 🚀
          </p>
        )}
      </div>
    </main>
  );
}