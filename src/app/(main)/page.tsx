"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useUser, SignInButton } from "@clerk/nextjs";

// Import the WarpBackground component
import dynamic from "next/dynamic";
const WarpBackground = dynamic(
  () =>
    import("@/components/ui/warp-background").then((mod) => mod.WarpBackground),
  { ssr: false }
);
// ---------------- UTILITY ICON COMPONENTS ----------------
const MapPinIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:map-marker" className={className} />
);
const CalendarPlusIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:calendar-plus" className={className} />
);
const CrosshairsGpsIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:crosshairs-gps" className={className} />
);
const SearchIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="eva:search-fill" className={className} />
);
const CloseIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:close" className={className} />
);
const InformationIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:information-outline" className={className} />
);
const FilterIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:filter" className={className} />
);
const LockIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:lock" className={className} />
);

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

interface Feedback {
  type: "success" | "error";
  message: string;
}

// ---------------- ICONS (Category Switch) ----------------
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
    case "workshop":
      return <Icon icon="mdi:tools" className="h-6 w-6 text-green-500" />;
    default:
      return (
        <Icon icon="mdi:calendar-star" className="h-6 w-6 text-gray-500" />
      );
  }
};

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

// ---------------- FEEDBACK MESSAGE ----------------
const FeedbackMessage: React.FC<{
  feedback: Feedback | null;
  onClose: () => void;
}> = ({ feedback, onClose }) => {
  if (!feedback) return null;

  const baseClasses =
    "fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center transition-all duration-300 ease-in-out transform";
  const successClasses = "bg-green-600 text-white shadow-green-500/50";
  const errorClasses = "bg-red-600 text-white shadow-red-500/50";

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [feedback, onClose]);

  return (
    <div
      className={`${baseClasses} ${
        feedback.type === "success" ? successClasses : errorClasses
      }`}
      style={{ animation: "slideUp 0.3s ease-out forwards" }}
    >
      <div className="flex items-center space-x-3">
        {feedback.type === "success" ? (
          <Icon icon="mdi:check-circle" className="h-6 w-6" />
        ) : (
          <Icon icon="mdi:alert-circle" className="h-6 w-6" />
        )}
        <p className="text-sm font-medium">{feedback.message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 -mr-1 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// ---------------- EVENT CARD ----------------
const EventCard = memo(({ event }: { event: EventData }) => {
  const { isSignedIn, isLoaded } = useUser();

  const getGoogleMapsUrl = (location: string, city: string) => {
    const encodedLocation = encodeURIComponent(`${location}, ${city}`);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  const getGoogleCalendarUrl = (event: EventData) => {
    const date = new Date(event.date);
    const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);

    const formatDateTime = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]|\.\d{3}/g, "")
        .slice(0, 15);

    const dates = `${formatDateTime(date)}/${formatDateTime(end)}`;
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(
      `${event.location.name}, ${event.city.name}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="bg-white p-5 rounded-xl shadow-lg transition-transform duration-300 hover:shadow-xl relative flex flex-col h-full 
        border border-gray-900"
      style={{
        boxShadow: "4px 4px 0px 0px #1a202c",
      }}
    >
      <img
        src={
          event.image ||
          "https://placehold.co/600x160/cccccc/333333?text=Image+Missing"
        }
        alt={event.title}
        className="w-full h-40 object-cover rounded-lg mb-4 border border-gray-200"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src =
            "https://placehold.co/600x160/cccccc/333333?text=Image+Missing";
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-purple-600 font-medium mt-1">
            {formattedDate}
          </p>
        </div>
        <div className="flex-shrink-0 ml-3 mt-1" title={event.category.name}>
          {getIcon(event.category.name)}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 pt-3 border-t border-gray-100 mt-auto">
        <a
          href={getGoogleMapsUrl(event.location.name, event.city.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-xs hover:text-purple-600 transition-colors duration-200"
          title="View on Google Maps"
        >
          <MapPinIcon className="h-4 w-4 mr-1 text-purple-500" />
          <span className="line-clamp-1 font-medium">
            {event.location.name}
          </span>
        </a>
        <a
          href={getGoogleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-xs hover:text-purple-600 transition-colors duration-200"
          title="Add to Google Calendar"
        >
          <CalendarPlusIcon className="h-4 w-4 mr-1 text-purple-500" />
          <span>Add to Calendar</span>
        </a>
      </div>

      {isLoaded && (
        <>
          {isSignedIn ? (
            <Link
              href={`/events/${event._id}`}
              className="mt-4 w-full flex items-center justify-center py-2 px-4 rounded-lg bg-purple-600 text-white font-bold 
                  shadow-md hover:bg-purple-700 transition-colors duration-200 border border-purple-800"
            >
              <InformationIcon className="h-5 w-5 mr-2" />
              More Details
            </Link>
          ) : (
            <SignInButton>
              <button
                className="mt-4 w-full flex items-center justify-center py-2 px-4 rounded-lg bg-gray-600 text-white font-bold 
                    shadow-md hover:bg-gray-700 transition-colors duration-200 border border-gray-800"
              >
                <LockIcon className="h-5 w-5 mr-2" />
                Sign In to View Details
              </button>
            </SignInButton>
          )}
        </>
      )}
    </div>
  );
});

// ---------------- HEADER COMPONENT ----------------

const Header = ({
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  dateFilter: string;
  setDateFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <header className="w-full flex justify-center pt-12 sm:pt-16 pb-8 sm:pb-12 font-sans mb-12 sm:mb-8 relative z-0">
      <WarpBackground
        className="absolute bg-blue-200 rounded-md inset-0 w-full h-full z-0"
      >
        <div className="absolute inset-0 bg-purple-500 backdrop-blur-md"></div>
      </WarpBackground>

      <div className="w-full max-w-4xl text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black leading-tight mb-4 sm:mb-6">
          Ready to Get <span className="text-purple-900">InTheLoop</span>?
        </h1>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mx-auto items-center justify-center">
          <div className="relative">
            <label htmlFor="search-input" className="sr-only">
              Search Events
            </label>
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 h-5 w-5 sm:h-6 sm:w-6" />
            <input
              id="search-input"
              type="text"
              placeholder="Search events and locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white border-2 border-gray-900 rounded-xl
              text-gray-800 placeholder-gray-500 transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 
              shadow-lg hover:shadow-xl"
              style={{
                boxShadow: "4px 4px 0px 0px #1a202c",
              }}
            />
          </div>
          <div className="relative w-full flex justify-center items-center sm:w-64 flex-shrink-0">
            <div
              className="relative flex items-center w-full bg-white border-2 border-gray-900 rounded-xl shadow-lg"
              style={{
                boxShadow: "4px 4px 0px 0px #1a202c",
              }}
            >
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full py-3.5 sm:py-4 pl-12 pr-12 bg-transparent text-lg text-gray-800 
                  placeholder-gray-500 transition-all duration-200 appearance-none
                  focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 
                  rounded-xl"
                title="Filter by Date"
                style={{
                  colorScheme: "light",
                }}
              />
            </div>
          </div>
        </div>

        {(searchQuery || dateFilter) && (
          <div className="mt-5 sm:mt-6 flex items-center justify-center">
            <button
              onClick={() => {
                setSearchQuery("");
                setDateFilter("");
              }}
              className="flex items-center justify-center gap-2 px-5 py-2 text-sm 
              text-red-700 border-2 border-red-700 rounded-full bg-white hover:bg-red-50 transition-colors 
              duration-200 font-semibold"
              style={{
                boxShadow: "2px 2px 0px 0px #b91c1c", // Subtle shadow for the button
              }}
            >
              <CloseIcon className="h-4 w-4" />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

// ---------------- MAIN COMPONENT (EVENT VIEWER) ----------------
export default function EventCrudManager() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [userCity, setUserCity] = useState("Vellore");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loadingCity, setLoadingCity] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  const MONGODB_API_ENDPOINT = "/api/events";

  const fetchEvents = useCallback(async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(MONGODB_API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch events.");

      const data = await response.json();
      const sortedEvents = data.sort(
        (a: EventData, b: EventData) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sortedEvents);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      setFeedback({
        type: "error",
        message: `Could not load events: ${error.message}`,
      });
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
          const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
          const geocodeRes = await fetch(geocodeUrl, {
            headers: {
              "User-Agent": "EventExplorerApp/1.0 (contact@youremail.com)",
            },
          });

          if (!geocodeRes.ok) throw new Error("Geocoding service failed.");

          const data = await geocodeRes.json();
          let detectedCity = "Unknown City";

          const address = data.address;
          if (address) {
            detectedCity =
              address.city ||
              address.town ||
              address.village ||
              address.suburb ||
              address.state ||
              "Unknown City";
          }

          setUserCity(detectedCity);
          setLoadingCity(false);
          setCityError(null);
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          setCityError(
            "Could not determine city from location. Please enter it manually."
          );
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

  const filterEvents = useCallback(
    (eventsList: EventData[]) => {
      return eventsList.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = dateFilter
          ? new Date(event.date).toISOString().split("T")[0] === dateFilter
          : true;

        return matchesSearch && matchesDate;
      });
    },
    [searchQuery, dateFilter]
  );

  const eventsInMyCity = useMemo(() => {
    const cityMatched = events.filter(
      (event) =>
        event.city?.name?.toLowerCase() === userCity.toLowerCase() ||
        event.location.city?.name?.toLowerCase() === userCity.toLowerCase()
    );
    return filterEvents(cityMatched);
  }, [events, userCity, filterEvents]);

  const allFilteredEvents = useMemo(() => {
    return filterEvents(events);
  }, [events, filterEvents]);

  return (
    <main className="min-h-screen text-gray-900 font-sans">
      <FeedbackMessage feedback={feedback} onClose={() => setFeedback(null)} />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <Container>
        <section className="py-12 md:py-16 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold flex flex-col sm:flex-row sm:items-end">
              Events Near{" "}
              <span className="text-purple-600 flex gap-2 sm:gap-4 items-center mt-1 sm:mt-0 sm:ml-2">
                {userCity || "You"}
                <button
                  onClick={handleDetectCity}
                  disabled={loadingCity}
                  className="flex items-center justify-center h-10 w-10 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-400 shadow-md"
                  title="Detect City using GPS"
                >
                  {loadingCity ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <CrosshairsGpsIcon className="h-6 w-6" />
                  )}
                </button>
              </span>
            </h2>
          </div>

          {cityError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <p className="font-bold">Location Error</p>
              <p className="text-sm">{cityError}</p>
            </div>
          )}

          {fetchLoading && (
            <div
              className="text-center p-8 text-lg text-purple-600 font-medium flex items-center justify-center space-x-2 bg-white rounded-xl shadow-lg border border-gray-900"
              style={{ boxShadow: "4px 4px 0px 0px #1a202c" }}
            >
              <Icon icon="mdi:loading" className="h-6 w-6 animate-spin" />
              <span>Loading events...</span>
            </div>
          )}

          {!fetchLoading && eventsInMyCity.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsInMyCity.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            !fetchLoading && (
              <div
                className="text-center text-gray-600 text-lg p-10 bg-white rounded-xl shadow-lg border border-gray-900"
                style={{ boxShadow: "4px 4px 0px 0px #1a202c" }}
              >
                <p className="mb-2">
                  <Icon
                    icon="mdi:calendar-search"
                    className="inline h-8 w-8 text-black"
                  />
                </p>
                <p>
                  No events in{" "}
                  <span className="font-bold text-purple-600">{userCity}</span>.
                </p>
              </div>
            )
          )}
        </section>

        <section className="py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8">
            More <span className="text-purple-600">Events</span>
          </h2>
          {allFilteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allFilteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            !fetchLoading && (
              <div
                className="text-center text-gray-600 text-lg p-10 bg-white rounded-xl shadow-lg border border-gray-900"
                style={{ boxShadow: "4px 4px 0px 0px #1a202c" }}
              >
                <p className="mb-2">
                  <Icon
                    icon="mdi:calendar-off"
                    className="inline h-8 w-8 text-gray-500"
                  />
                </p>
                <p>No events available.</p>
              </div>
            )
          )}
        </section>
      </Container>
    </main>
  );
}
