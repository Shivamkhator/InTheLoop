"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";

// ---------------- TYPE DEFINITIONS ----------------
// These types should ideally be in a shared file (e.g., 'types.ts')
interface City {
  _id: string;
  name: string;
  state?: string;
  country?: string;
}

interface Location {
  _id: string;
  name: string;
  city: City;
}

interface Category {
  _id: string;
  name: string;
  icon?: string;
}

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: Category;
  city: City;
  location: Location;
  createdAt: string;
}

// ---------------- UTILITY ICON COMPONENTS ----------------
const ArrowLeftIcon = ({ className = "h-6 w-6" }) => (
  <Icon icon="mdi:arrow-left" className={className} />
);
const MapPinIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:map-marker" className={className} />
);
const CalendarIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:calendar" className={className} />
);
const TimeIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:clock-outline" className={className} />
);
const CategoryIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:tag-multiple" className={className} />
);
const LoadingIcon = () => (
    <Icon icon="mdi:loading" className="h-6 w-6 animate-spin mr-2" />
);

// ---------------- CATEGORY ICON SWITCH ----------------
const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "concert":
        return <Icon icon="flat-color-icons:music" className="h-6 w-6 text-purple-500" />;
      case "dance":
        return <Icon icon="noto:woman-dancing" className="h-6 w-6" />;
      case "competition":
        return <Icon icon="mdi:trophy" className="h-6 w-6 text-yellow-500" />;
      case "party":
        return <Icon icon="bxs:party" className="h-6 w-6 text-purple-500" />;
      case "movie":
        return <Icon icon="mingcute:movie-fill" className="h-6 w-6 text-gray-500" />;
      case "workshop":
        return <Icon icon="mdi:tools" className="h-6 w-6 text-green-500" />;
      default:
        return <Icon icon="mdi:calendar-star" className="h-6 w-6 text-gray-500" />;
    }
};

// ---------------- EVENT DETAILS PAGE COMPONENT ----------------

export default function EventDetailsPage() {
  // Use useParams to get the dynamic segment (the event ID)
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the API endpoint for fetching a single event
  const MONGODB_API_ENDPOINT = `/api/events/${eventId}`;

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- START ACTUAL FETCH ---
        const response = await fetch(MONGODB_API_ENDPOINT);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Event not found.");
          }
          throw new Error(`Failed to fetch event data. Status: ${response.status}`);
        }
        
        const data: EventData = await response.json();
        setEvent(data);
        // --- END ACTUAL FETCH ---

      } catch (e: any) {
        console.error("Fetch Details Error:", e);
        setError(`Could not load event details: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  // Format date and time
  const formattedDate = event ? new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";
  
  const formattedTime = event ? new Date(event.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }) : "";

  // ---------------- RENDER STATES ----------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <p className="text-xl text-purple-600 flex items-center font-semibold">
            <LoadingIcon /> Fetching event details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-6">{error}</p>
        <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 transition">
            <ArrowLeftIcon className="mr-2" /> Back to Event List
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
        <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Event Not Found</h1>
            <p className="text-lg text-gray-700 mb-6">The event with ID **{eventId}** could not be found.</p>
            <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 transition">
                <ArrowLeftIcon className="mr-2" /> Back to Event List
            </Link>
        </div>
    );
  }

  // ---------------- MAIN CONTENT ----------------

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link 
            href="/" 
            className="flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors mb-8"
        >
          <ArrowLeftIcon className="mr-2" /> Back to All Events
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Header Image */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-80 object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "https://placehold.co/1200x400/cccccc/333333?text=Event+Image+Missing";
          }}
          />

          <div className="p-8 md:p-12">
            
            {/* Title and Category */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center text-lg text-purple-600 font-semibold">
                    <CategoryIcon className="h-6 w-6 mr-2" />
                    {event.category.name}
                    <span className="ml-3">{getIcon(event.category.name)}</span>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              
              <div className="flex items-center p-4 bg-purple-50 rounded-lg shadow-sm">
                <CalendarIcon className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg font-bold text-gray-800">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-purple-50 rounded-lg shadow-sm">
                <TimeIcon className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-lg font-bold text-gray-800">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-purple-50 rounded-lg shadow-sm col-span-1 md:col-span-2">
                <MapPinIcon className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg font-bold text-gray-800">
                    {event.location.name}, {event.city.name}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">
                About the Event
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Primary Action Button (e.g., Book Tickets) */}
            <button
              onClick={() => alert(`Redirecting to booking system for: ${event.title}`)}
              className="w-full py-3 px-6 rounded-xl bg-purple-600 text-white text-xl font-extrabold 
                         hover:bg-purple-700 transition-colors duration-200 shadow-lg shadow-purple-500/50"
            >
              Book Tickets Now!
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}