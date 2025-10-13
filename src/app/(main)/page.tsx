"use client";

import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { Icon } from "@iconify/react";

// ---------------- INTERFACES ----------------
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

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  category: Category;
  city: City;
  location: Location;
}

// ---------------- ICONS ----------------
const getIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "concert":
      return (
        <Icon
          icon="flat-color-icons:music"
          className="h-6 w-6 text-purple-500"
        />
      );
    case "dance":
      return <Icon icon="noto:woman-dancing" className="h-6 w-6" />;
    case "competition":
      return <Icon icon="mdi:trophy" className="h-6 w-6 text-yellow-500" />;
    case "party":
      return <Icon icon="bxs:party" className="h-6 w-6 text-purple-500" />;
    case "movie":
      return (
        <Icon icon="mingcute:movie-fill" className="h-6 w-6 text-gray-500" />
      );
    default:
      return null;
  }
};

// ---------------- REUSABLE CONTAINER ----------------
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-6xl px-4 md:px-8 lg:px-12">{children}</div>
);

// ---------------- EVENT CARD ----------------
const EventCard = memo(({ event }: { event: Event }) => {
  const getGoogleMapsUrl = (location: string, city: string) => {
    const encodedLocation = encodeURIComponent(`${location}, ${city}`);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  const getGoogleCalendarUrl = (event: Event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(event.date);
    startDate.setHours(19, 0, 0);
    endDate.setHours(21, 0, 0);

    const formatDateTime = (date: Date) => {
      return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
    };

    const dates = `${formatDateTime(startDate)}/${formatDateTime(endDate)}`;
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(
      `${event.location.name}, ${event.location.city.name}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300"
      style={{
        boxShadow: "2px 2px 1px rgb(0, 0, 0)",
        border: "1px solid rgb(0, 0, 0)",
      }}
    >
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(event.date).toDateString()}
          </p>
        </div>
        {getIcon(event.category.name)}
      </div>
      <p className="text-gray-600 text-sm mb-4">{event.description}</p>
      <div className="flex items-center space-x-4 text-gray-500">
        <a
          href={getGoogleMapsUrl(event.location.name, event.location.city.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm hover:text-purple-600 transition-colors duration-200"
          title="View on Google Maps"
        >
          <Icon icon="mdi:map-marker" className="h-4 w-4 mr-1" />
          <span>{event.location.name}</span>
        </a>
        <a
          href={getGoogleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm hover:text-purple-600 transition-colors duration-200"
          title="Add to Google Calendar"
        >
          <Icon icon="mdi:calendar-plus" className="h-4 w-4 mr-1" />
          <span>Add to Calendar</span>
        </a>
      </div>
    </div>
  );
});

// ---------------- MAIN PAGE ----------------
export default function Home() {
  const [userCity, setUserCity] = useState("Vellore");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingCity, setLoadingCity] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // --- Geolocation Logic with Real API Placeholder ---
  const handleDetectCity = useCallback(async () => {
    if (!navigator.geolocation) {
      setCityError("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingCity(true);
    setCityError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // ----------------------------------------------------------------------
          // ✅ START OF REAL API LOGIC
          // ----------------------------------------------------------------------

          // NOTE: This URL uses the Nominatim reverse geocoding service (OpenStreetMap).
          // You should consider implementing a secure backend API route for this 
          // to manage rate limits and ensure stability in a production app.
          const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

          const geocodeRes = await fetch(geocodeUrl, {
            // Add a proper User-Agent header if deploying publicly 
            // to comply with Nominatim's usage policy.
            headers: {
              'User-Agent': 'EventExplorerApp/1.0 (contact@youremail.com)'
            }
          });

          if (!geocodeRes.ok) throw new Error("Geocoding service failed.");

          const data = await geocodeRes.json();
          let detectedCity = "Unknown City";

          // Nominatim often places the city name in 'city' or 'town' or 'village' or 'suburb'
          const address = data.address;
          if (address) {
            detectedCity = address.city || address.town || address.village || address.suburb || address.state || "Unknown City";
          }

          // ----------------------------------------------------------------------
          // ✅ END OF REAL API LOGIC
          // ----------------------------------------------------------------------

          setUserCity(detectedCity);
          setLoadingCity(false);
          setCityError(null);
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setCityError("Could not determine city from location. Please enter it manually.");
          setLoadingCity(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setLoadingCity(false);
        if (error.code === error.PERMISSION_DENIED) {
          setCityError("Location access denied by user. Please enable it.");
        } else {
          setCityError("Could not get location. Please use the input field.");
        }
      }
    );
  }, []);
  // -------------------------

  const eventsInMyCity = useMemo(
    () =>
      events.filter(
        (event) =>
          event.city?.name?.toLowerCase() === userCity.toLowerCase() &&
          (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ),
    [searchQuery, userCity, events]
  );

  return (
    <main className="min-h-screen text-black font-sans">
      <div
        className="w-full h-1vh rounded-xl"
        style={{
          backgroundImage:
            "url('https://thumbs.dreamstime.com/b/colorful-nightclub-party-diverse-crowd-dancing-vibrant-silhouettes-group-people-surrounded-lights-festive-330803438.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <Container>
        {/* Events in My City */}
        <section className="py-12 md:py-16">
          <div className="flex items-center flex-wrap gap-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Upcoming Events in <span className="text-purple-600 flex gap-4 items-center">{userCity || "Your City"}
                <button
                  onClick={handleDetectCity}
                  disabled={loadingCity}
                  className="flex items-center justify-center h-full p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-400"
                  title="Detect City using GPS"
                >
                  {loadingCity ? (
                    <Icon icon="mdi:loading" className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon icon="mdi:crosshairs-gps" className="h-5 w-5" />
                  )}
                </button>
              </span>
            </h2>

          </div>


          {eventsInMyCity.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsInMyCity.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p
              className="text-center text-gray-800 text-lg p-8 bg-white rounded-lg shadow-sm border border-black"
              style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}
            >
              No upcoming events found in <span className="font-bold italic">{userCity}</span>.
            </p>
          )}
        </section>

        {/* All Events */}
        <section className="py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8">
            All Upcoming <span className="text-purple-600">Events</span>
          </h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p
              className="text-center text-gray-500 text-lg p-8 bg-white rounded-lg shadow-sm border border-black"
              style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}
            >
              No upcoming events at the moment. Check back soon!
            </p>
          )}
        </section>
      </Container>
    </main>
  );
}

const Header = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <header className="flex flex-col items-center justify-center pt-24 pb-12 font-sans text-gray-900">
      <div
        className="w-full max-w-2xl text-center rounded-3xl p-16 shadow-lg my-auto shadow-purple-200"
        style={{
          backgroundColor: "rgba(237, 233, 254, 0.8)",
          border: "1px solid rgb(0, 0, 0)",
          boxShadow: "2px 2px 1px rgb(0, 0, 0)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-relaxed max-w-md mx-auto">
          Discover, explore, book.
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          Search and discover the best events according to your interests.
        </p>

        {/* Event Search Input */}
        <div className="relative mt-12 w-full max-w-sm mx-auto">
          <Icon
            icon="eva:search-fill"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search for an event or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 bg-white rounded-full border border-gray-200 shadow-sm transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
            hover:ring-2 hover:ring-purple-400 hover:ring-offset-2"
          />
        </div>
      </div>
    </header>
  );
};