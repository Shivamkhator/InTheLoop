"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
// Removed dependency on @iconify/react for stable compilation

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

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string; // ISO string
  image: string;
  category: Category;
  city: City;
  location: Location;
  createdAt: string;
}

interface FormData {
  _id: string | null;
  title: string;
  description: string;
  date: string;
  category: string;
  city: string;
  location: string;
  image: string;
}

// ---------------- ICON UTILS (Using Inline SVGs and Emojis) ----------------
// Standard SVG Icons for CRUD/Navigation
const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);
const CalendarPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="14" x2="12" y2="18" />
    <line x1="10" y1="16" x2="14" y2="16" />
  </svg>
);
const DotsVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <circle cx="12" cy="7" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="17" r="1.5" />
  </svg>
);
const CrosshairsGpsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h4v2h-4v4h-2v-4H7v-2h4V8z" />
  </svg>
);
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

// Category Icons (Emojis used to avoid external dependencies)
const getIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "concert":
      return <span className="h-6 w-6 text-purple-500 text-2xl">🎵</span>;
    case "dance":
      return <span className="h-6 w-6 text-2xl">💃</span>;
    case "competition":
      return <span className="h-6 w-6 text-yellow-500 text-2xl">🏆</span>;
    case "party":
      return <span className="h-6 w-6 text-purple-500 text-2xl">🎉</span>;
    case "movie":
      return <span className="h-6 w-6 text-gray-500 text-2xl">🎬</span>;
    default:
      return null;
  }
};

// ---------------- UTILITY COMPONENTS ----------------
const FeedbackMessage = ({
  feedback,
  onClose,
}: {
  feedback: { type: "success" | "error"; message: string } | null;
  onClose: () => void;
}) => {
  if (!feedback) return null;
  const bgColor =
    feedback.type === "success"
      ? "bg-green-100 border-green-500 text-green-700"
      : "bg-red-100 border-red-500 text-red-700";
  const icon = feedback.type === "success" ? "✅" : "❌";

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-start pt-20 transition-opacity duration-300`}
    >
      <div
        className={`p-5 rounded-xl border-l-4 ${bgColor} shadow-2xl w-full max-w-sm mx-4 transform transition-transform duration-300 scale-100`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="text-xl mr-3">{icon}</span>
            <p className="font-medium">{feedback.message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-lg leading-none p-1"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
    {children}
  </div>
);

// ---------------- DROPDOWN ACTIONS ----------------

const ActionsDropdown = memo(
  ({
    event,
    onEdit,
    onDelete,
    loading,
  }: {
    event: EventData;
    onEdit: (event: EventData) => void;
    onDelete: (id: string) => void;
    loading: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);

    const handleDeleteClick = useCallback(() => {
      setIsOpen(false);
      onDelete(event._id);
    }, [onDelete, event._id]);

    const handleEditClick = useCallback(() => {
      setIsOpen(false);
      onEdit(event);
    }, [onEdit, event]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          isOpen &&
          e.target instanceof HTMLElement &&
          !e.target.closest(`#actions-dropdown-${event._id}`)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, event._id]);

    return (
      <div
        id={`actions-dropdown-${event._id}`}
        className="relative inline-block text-left z-10"
      >
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={loading}
          className="inline-flex justify-center items-center w-full rounded-full border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50"
        >
          <DotsVerticalIcon className="h-5 w-5" />
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              <button
                onClick={handleEditClick}
                className="text-gray-700 flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                role="menuitem"
              >
                <EditIcon className="h-4 w-4 mr-2 text-blue-500" />
                Edit Event
              </button>
              <button
                onClick={handleDeleteClick}
                className="text-red-600 flex items-center w-full px-4 py-2 text-sm hover:bg-red-50"
                role="menuitem"
              >
                <TrashIcon className="h-4 w-4 mr-2 text-red-500" />
                Delete Event
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// ---------------- EVENT CARD ----------------
const EventCard = memo(
  ({
    event,
    onEdit,
    onDelete,
    loading,
  }: {
    event: EventData;
    onEdit: (event: EventData) => void;
    onDelete: (id: string) => void;
    loading: boolean;
  }) => {
    const getGoogleMapsUrl = (location: string, city: string) => {
      const encodedLocation = encodeURIComponent(`${location}, ${city}`);
      return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    };

    const getGoogleCalendarUrl = (event: EventData) => {
      const date = new Date(event.date);
      const start = new Date(date.getTime());
      const end = new Date(date.getTime() + 2 * 60 * 60 * 1000); // Assume 2-hour duration

      const formatDateTime = (d: Date) =>
        d
          .toISOString()
          .replace(/[-:]|\.\d{3}/g, "")
          .replace("Z", "");

      const dates = `${formatDateTime(start)}/${formatDateTime(end)}`;
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
        className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 relative"
        style={{
          boxShadow: "2px 2px 1px rgb(0, 0, 0)",
          border: "1px solid rgb(0, 0, 0)",
        }}
      >
        {/* CRUD Dropdown */}
        <div className="absolute top-4 right-4 z-20">
          <ActionsDropdown
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
            loading={loading}
          />
        </div>

        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-40 object-cover rounded-lg mb-4"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x160/cccccc/333333?text=Image+Missing";
            }}
          />
        )}
        <div className="flex items-start justify-between mb-4 pr-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          </div>
          <div className="flex-shrink-0 ml-3">
            {getIcon(event.category.name)}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>
        <div className="flex items-center space-x-4 text-gray-500 pt-2 border-t border-gray-100">
          <a
            href={getGoogleMapsUrl(event.location.name, event.city.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs hover:text-purple-600 transition-colors duration-200"
            title="View on Google Maps"
          >
            <MapPinIcon className="h-4 w-4 mr-1 text-purple-500" />
            <span>{event.location.name}</span>
          </a>
          <a
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs hover:text-purple-600 transition-colors duration-200"
            title="Add to Google Calendar"
          >
            <CalendarPlusIcon className="h-4 w-4 mr-1 text-purple-500" />
            <span>Calendar</span>
          </a>
        </div>
      </div>
    );
  }
);

// ---------------- MODAL FORM COMPONENT ----------------

interface ModalProps {
  isEditing: boolean;
  formData: FormData;
  loading: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
}

const EventFormModal: React.FC<ModalProps> = ({
  isEditing,
  formData,
  loading,
  handleChange,
  handleSubmit,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-300"
      // Outer Overlay uses backdrop-filter to blur the content behind the modal box
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="w-full max-w-2xl rounded-xl shadow-2xl my-8 transform scale-100 transition-transform duration-300">
        <div
          className="rounded-xl overflow-hidden p-6"
          // Inner content box using transparency and blur for the core glass effect
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent white
            border: "1px solid rgba(255, 255, 255, 0.3)", // Light border
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", // Glass shadow
            backdropFilter: "blur(15px)", // Stronger inner blur
          }}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-300/50">
            <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Event</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <XCircleIcon className="h-7 w-7" />
            </button>
          </div>

          {/* Modal Body (Form) */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white bg-opacity-80"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                  rows={4}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white bg-opacity-80"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700">
                    Event Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white bg-opacity-80"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white bg-opacity-80"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Concert">Concert</option>
                    <option value="Party">Party</option>
                    <option value="Dance">Dance</option>
                    <option value="Movie">Movie</option>
                    <option value="Competition">Competition</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              {/* City & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., San Francisco"
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white bg-opacity-80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., The Warfield"
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white bg-opacity-80"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700">
                  Event Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/event.jpg"
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white bg-opacity-80"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3 px-6 rounded-lg bg-purple-600 text-white font-bold text-lg shadow-md hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={{
                    boxShadow: loading ? "none" : "2px 2px 0px #4c1d95",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Saving...
                    </span>
                  ) : (
                    <>
                      <EditIcon className="h-5 w-5 mr-2" />
                      Update Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- MAIN COMPONENT (CRUD MANAGER) ----------------
const initialFormData: FormData = {
  _id: null,
  title: "",
  description: "",
  date: "",
  category: "",
  city: "",
  location: "",
  image: "",
};

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [userCity, setUserCity] = useState("Vellore");
  const [searchQuery, setSearchQuery] = useState("");

  // --- CRUD State ---
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loadingCity, setLoadingCity] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Controls Modal visibility

  const isEditing = !!formData._id;
  const MONGODB_API_ENDPOINT = "/api/events";

  // --- CRUD Logic: Read ---
  const fetchEvents = useCallback(async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(MONGODB_API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch events.");

      const data = await response.json();
      // Ensure date is sorted (in-memory sort to avoid Mongoose index issues)
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
      setLoading(false); // Make sure general loading state is also reset
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // --- Form Handlers ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- CRUD Logic: Update ---
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setIsFormVisible(false); // Hide Modal on cancel/reset
  }, []);

  // This handler opens the modal and sets the data for editing
  const handleEdit = useCallback((eventToEdit: EventData) => {
    // Format the date for the datetime-local input (YYYY-MM-DDTHH:mm)
    const dateObj = new Date(eventToEdit.date);
    const formattedDate = dateObj.toISOString().substring(0, 16);

    setFormData({
      _id: eventToEdit._id,
      title: eventToEdit.title,
      description: eventToEdit.description,
      date: formattedDate,
      category: eventToEdit.category.name,
      city: eventToEdit.city.name,
      location: eventToEdit.location.name,
      image: eventToEdit.image,
    });
    setIsFormVisible(true); // Show Modal when editing
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    // This is always a PUT (update) since the creation path is removed
    const method = "PUT";
    const url = `${MONGODB_API_ENDPOINT}/${formData._id}`;

    const requestData = {
      ...formData,
      // Ensure ISO format for Mongoose
      date: new Date(formData.date).toISOString(),
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }

      await response.json();
      setFeedback({ type: "success", message: `Event updated successfully!` });
      resetForm(); // Hides Modal and resets form data
      fetchEvents(); // Re-fetch to update the list
    } catch (error: any) {
      console.error("API Error:", error);
      setFeedback({
        type: "error",
        message: `Operation failed: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD Logic: Delete ---
  const handleDelete = async (id: string) => {
    // NOTE: Using window.confirm for simplicity, should be replaced by a custom modal
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`${MONGODB_API_ENDPOINT}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }

      setFeedback({ type: "success", message: "Event deleted successfully." });
      fetchEvents();
    } catch (error: any) {
      console.error("Delete Error:", error);
      setFeedback({
        type: "error",
        message: `Delete failed: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

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
    <main className="min-h-screen bg-gray-50 text-black font-sans">
      <FeedbackMessage feedback={feedback} onClose={() => setFeedback(null)} />

      {/* --- Event Form Modal (Only visible when isFormVisible is true) --- */}
      {isFormVisible && (
        <EventFormModal
          // isEditing is implicitly true since creation path is removed
          isEditing={isEditing}
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          onClose={resetForm} // Close button resets the form and hides the modal
        />
      )}

      <div
        className="w-full rounded-b-xl pb-16"
        style={{
          backgroundImage:
            "url('https://thumbs.dreamstime.com/b/colorful-nightclub-party-diverse-crowd-dancing-vibrant-silhouettes-group-people-surrounded-lights-festive-330803438.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <Container>
        {/* Events in My City */}
        <section className="py-12 md:py-16 pt-4">
          <div className="flex items-center flex-wrap gap-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Upcoming Events in{" "}
              <span className="text-purple-600 flex gap-4 items-center">
                {userCity || "Your City"}
                <button
                  onClick={handleDetectCity}
                  disabled={loadingCity}
                  className="flex items-center justify-center h-10 w-10 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-400"
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
                    <CrosshairsGpsIcon className="h-5 w-5" />
                  )}
                </button>
              </span>
            </h2>
          </div>

          {cityError && <p className="text-red-500 mb-4">{cityError}</p>}

          {fetchLoading && (
            <div className="text-center p-8 text-lg text-purple-600 font-medium">
              Loading events from API...
            </div>
          )}

          {!fetchLoading && eventsInMyCity.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsInMyCity.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ))}
            </div>
          ) : (
            !fetchLoading && (
              <p
                className="text-center text-gray-800 text-lg p-8 bg-white rounded-lg shadow-sm border border-black"
                style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}
              >
                No upcoming events found in{" "}
                <span className="font-bold italic">{userCity}</span>.
              </p>
            )
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
                <EventCard
                  key={event._id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
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
          // Updated to use a blur effect for a "frosted glass" appearance
          backgroundColor: "rgba(237, 233, 254, 0.7)",
          border: "1px solid rgb(0, 0, 0)",
          boxShadow: "2px 2px 1px rgb(0, 0, 0)",
          backdropFilter: "blur(8px)", // Increased blur strength
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
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
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
