"use client";

import { QRCodeCanvas } from "qrcode.react";
import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface HistoryEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "Completed" | "Upcoming";
}

const mockHistory: HistoryEvent[] = [
  {
    id: "1",
    title: "Summer Music Fest",
    date: "July 22, 2025",
    location: "Central Park, NYC",
    status: "Completed",
  },
  {
    id: "2",
    title: "Startup Pitch Night",
    date: "Aug 12, 2025",
    location: "Soho Hub, NYC",
    status: "Completed",
  },
  {
    id: "3",
    title: "Halloween Party",
    date: "Oct 31, 2025",
    location: "Times Square Club, NYC",
    status: "Upcoming",
  },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "Completed" | "Upcoming">("all");

  const filteredEvents =
    filter === "all"
      ? mockHistory
      : mockHistory.filter((e) => e.status === filter);

  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans">
      <div className="w-full max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          History
        </h1>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          {["all", "Completed", "Upcoming"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-purple-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Events */}
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
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        event.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Icon
                    icon="mdi:map-marker"
                    className="h-4 w-4 mr-1 text-purple-500"
                  />
                  {event.location}
                </p>

                <div className="mt-4 flex justify-center">
                  <QRCodeCanvas value={`https://youtu.be/dQw4w9WgXcQ?si=xQCpFPtjFE1VKWoY`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg mt-8">
            No {filter} events found in your history.
          </p>
        )}
      </div>
    </main>
  );
}
