"use client";

import React from "react";
import { Icon } from "@iconify/react";

// ---------------- CONTAINER ----------------
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-6xl px-4 md:px-8 lg:px-12">{children}</div>
);

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans">
      <Container>
        <header className="py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Dashboard
          </h1>
          <div className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 mt-2">
            Quick insights into your events and bookings.
          </p>
            <button
            type="button"
            onClick={() => window.location.href = "/manage"}
            className="flex items-center justify-center py-3 px-6 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition-all"
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
            value="12"
            icon="mdi:calendar-multiple"
            color="bg-purple-100 text-purple-600"
          />
          <MetricCard
            title="Total Bookings"
            value="542"
            icon="mdi:ticket-confirmation"
            color="bg-green-100 text-green-600"
          />
          <MetricCard
            title="Revenue"
            value="$7,230"
            icon="mdi:currency-usd"
            color="bg-yellow-100 text-yellow-600"
          />
          <MetricCard
            title="Upcoming"
            value="3"
            icon="mdi:clock-outline"
            color="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Recent Events */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Events
          </h2>
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
                {[
                  {
                    title: "Coldplay Live",
                    date: "Nov 15, 2025",
                    location: "NYC Arena",
                    bookings: 230,
                  },
                  {
                    title: "Tech Summit 2025",
                    date: "Dec 1, 2025",
                    location: "Brooklyn Expo",
                    bookings: 120,
                  },
                  {
                    title: "Christmas Party",
                    date: "Dec 24, 2025",
                    location: "Downtown Club",
                    bookings: 98,
                  },
                ].map((event, i) => (
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
