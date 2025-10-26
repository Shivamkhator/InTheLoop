"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useUser } from "@clerk/nextjs";

// ---------------- CONTAINER ----------------
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-6xl px-4 md:px-8 lg:px-12">{children}</div>
);

interface Event {
  _id: string;
  title: string;
  date: string;
  location: {
    name: string;
  };
  city: {
    name: string;
  };
  creatorId: string;
}

interface Booking {
  _id: string;
  eventId: string;
  userId: string;
  status: string;
}

interface DashboardStats {
  totalEvents: number;
  totalBookings: number;
  upcomingEvents: number;
  recentEvents: Array<{
    title: string;
    date: string;
    location: string;
    bookings: number;
  }>;
}

const LoadingIcon = () => (
  <Icon icon="mdi:loading" className="h-6 w-6 animate-spin mr-2" />
);

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalBookings: 0,
    upcomingEvents: 0,
    recentEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all events
        const eventsResponse = await fetch("/api/events");
        if (!eventsResponse.ok) throw new Error("Failed to fetch events");
        const allEvents: Event[] = await eventsResponse.json();

        // Filter events created by current user
        const userEvents = allEvents.filter(
          (event) => event.creatorId === user.id
        );

        // Calculate upcoming events
        const now = new Date();
        const upcoming = userEvents.filter(
          (event) => new Date(event.date) > now
        ).length;

        // Fetch all bookings to count bookings per event
        const bookingsResponse = await fetch("/api/bookings");
        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");
        const allBookings: Booking[] = await bookingsResponse.json();

        // Count bookings for user's events (excluding the creator's own bookings)
        const userEventIds = new Set(userEvents.map((e) => e._id));
        const userEventBookings = allBookings.filter((booking) =>
          userEventIds.has(booking.eventId) && booking.userId !== user.id
        );

        // Create booking count map (only bookings by other users)
        const bookingCountMap = new Map<string, number>();
        userEventBookings.forEach((booking) => {
          const count = bookingCountMap.get(booking.eventId) || 0;
          bookingCountMap.set(booking.eventId, count + 1);
        });

        // Prepare recent events (last 5, sorted by date descending)
        const sortedEvents = [...userEvents]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        const recentEvents = sortedEvents.map((event) => ({
          title: event.title,
          date: new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          location: `${event.location?.name || "Unknown"}, ${event.city?.name || "Unknown"}`,
          bookings: bookingCountMap.get(event._id) || 0,
        }));

        setStats({
          totalEvents: userEvents.length,
          totalBookings: userEventBookings.length,
          upcomingEvents: upcoming,
          recentEvents,
        });
      } catch (e: any) {
        console.error("Dashboard fetch error:", e);
        setError(e.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-xl text-purple-600 flex items-center font-semibold">
          <LoadingIcon /> Loading user data...
        </p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6">
          Please sign in to view your dashboard.
        </p>
        <a
          href="/sign-in"
          className="flex items-center text-purple-600 hover:text-purple-800 transition font-medium"
        >
          <Icon icon="mdi:login" className="mr-2 h-5 w-5" /> Go to Sign In
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-xl text-purple-600 flex items-center font-semibold">
          <LoadingIcon /> Loading dashboard...
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
      <Container>
        <header className="py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Dashboard
          </h1>
          <div className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 mt-2">
              Overview of events you've created and bookings from attendees.
            </p>
            <button
              type="button"
              onClick={() => (window.location.href = "/manage")}
              className="flex items-center justify-center py-3 px-6 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition-all mt-4 sm:mt-0"
            >
              <Icon icon="mdi:plus-circle" className="h-5 w-5 mr-2" />
              Manage Events
            </button>
          </div>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Events"
            value={stats.totalEvents.toString()}
            icon="mdi:calendar-multiple"
            color="bg-purple-100 text-purple-600"
          />
          <MetricCard
            title="Total Bookings"
            value={stats.totalBookings.toString()}
            icon="mdi:ticket-confirmation"
            color="bg-green-100 text-green-600"
          />
          <MetricCard
            title="Upcoming"
            value={stats.upcomingEvents.toString()}
            icon="mdi:clock-outline"
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard
            title="Avg Bookings"
            value={
              stats.totalEvents > 0
                ? Math.round(stats.totalBookings / stats.totalEvents).toString()
                : "0"
            }
            icon="mdi:chart-line"
            color="bg-yellow-100 text-yellow-600"
          />
        </div>

        {/* Recent Events */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Events
          </h2>
          {stats.recentEvents.length > 0 ? (
            <div className="bg-white shadow-lg border border-black rounded-xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-purple-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-left">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEvents.map((event, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{event.title}</td>
                      <td className="py-3 px-4">{event.date}</td>
                      <td className="py-3 px-4">{event.location}</td>
                      <td className="py-3 px-4 font-semibold text-purple-600">
                        {event.bookings}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow-lg border border-black rounded-xl p-8 text-center">
              <Icon
                icon="mdi:calendar-plus"
                className="h-16 w-16 mx-auto text-gray-300 mb-4"
              />
              <p className="text-gray-600 text-lg">
                No events created yet. Start by creating your first event!
              </p>
              <button
                onClick={() => (window.location.href = "/manage")}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Create Event
              </button>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}

const MetricCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) => (
  <div
    className="p-6 bg-white rounded-xl shadow-md border border-black"
    style={{ boxShadow: "2px 2px 1px rgb(0,0,0)" }}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon icon={icon} className="h-6 w-6" />
      </div>
      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);