"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Icon } from "@iconify/react";

// ---------------- UTILITY ICON COMPONENTS (Using Iconify) ----------------
const DotsVerticalIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:dots-vertical" className={className} />
);
const EditIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:pencil-outline" className={className} />
);
const TrashIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:trash-can-outline" className={className} />
);
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
const PlusCircleIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:plus-circle-outline" className={className} />
);
const AlertIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:alert-circle-outline" className={className} />
);
const CloseIcon = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:close" className={className} />
);

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

interface Feedback {
  type: "success" | "error";
  message: string;
}

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

// ---------------- REUSABLE CONTAINER ----------------
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
    {children}
  </div>
);

// ---------------- FEEDBACK MESSAGE (MODIFIED FOR BOTTOM-RIGHT TOAST) ----------------
const FeedbackMessage: React.FC<{
  feedback: Feedback | null;
  onClose: () => void;
}> = ({ feedback, onClose }) => {
  if (!feedback) return null;

  // Change position from top-4 to bottom-4, keep right-4
  const baseClasses =
    "fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center transition-all duration-300 ease-in-out transform";
  const successClasses = "bg-green-600 text-white shadow-green-500/50";
  const errorClasses = "bg-red-600 text-white shadow-red-500/50";

  // Use useEffect to automatically dismiss the toast after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [feedback, onClose]);

  return (
    <div
      className={`${baseClasses} ${
        feedback.type === "success" ? successClasses : errorClasses
      }`}
      style={{ animation: 'slideUp 0.3s ease-out forwards' }} // Apply animation for visibility
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
      {/* Global style to define the slide-up animation */}
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

// ---------------- ACTIONS DROPDOWN (CRUD) ----------------
const ActionsDropdown = memo(
  ({
    event,
    onEdit,
    onDelete,
    loading,
  }: {
    event: EventData;
    onEdit: (event: EventData) => void;
    // Changed onDelete signature to handle direct delete logic (no modal)
    onDelete: (event: EventData) => void;
    loading: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false); // New state for double-click confirmation

    const toggleDropdown = useCallback(() => {
      setIsOpen((prev) => !prev);
      setConfirmDelete(false); // Reset confirmation state on open/close
    }, []);

    const handleDeleteClick = useCallback(() => {
      if (confirmDelete) {
        setIsOpen(false);
        setConfirmDelete(false); // Final delete action
        onDelete(event); // Triggers the delete directly
      } else {
        setConfirmDelete(true); // First click: ask for confirmation
        setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3 seconds
      }
    }, [confirmDelete, onDelete, event]);

    const handleEditClick = useCallback(() => {
      setIsOpen(false);
      onEdit(event);
      // Simulate redirect: Scroll to the form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [onEdit, event]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const dropdownElement = document.getElementById(
          `actions-dropdown-${event._id}`
        );
        if (
          isOpen &&
          dropdownElement &&
          e.target instanceof HTMLElement &&
          !dropdownElement.contains(e.target)
        ) {
          setIsOpen(false);
          setConfirmDelete(false); // Reset confirmation state
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, event._id]);

    return (
      <div
        id={`actions-dropdown-${event._id}`}
        className="relative inline-block text-left z-20"
      >
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={loading}
          className="inline-flex justify-center items-center w-8 h-8 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <DotsVerticalIcon className="h-5 w-5" />
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={`actions-dropdown-${event._id}`}
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
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  confirmDelete
                    ? "bg-red-500 text-white font-bold hover:bg-red-600"
                    : "text-red-600 hover:bg-red-50"
                }`}
                role="menuitem"
                disabled={loading}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                {confirmDelete ? (
                  <>
                    <span className="animate-pulse">Click AGAIN to Delete!</span>
                    <AlertIcon className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Delete Event"
                )}
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
    onDelete: (event: EventData) => void;
    loading: boolean;
  }) => {
    // FIX 1: Corrected the Google Maps URL template
    const getGoogleMapsUrl = (location: string, city: string) => {
      const encodedLocation = encodeURIComponent(`${location}, ${city}`);
      return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    };

    // FIX 2: Corrected Google Calendar URL date formatting (ZULU/UTC)
    const getGoogleCalendarUrl = (event: EventData) => {
      const date = new Date(event.date);
      // Assuming a 2-hour event duration for the calendar template
      const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);

      // Calendar dates must be in YYYYMMDDTHHMMSS format (UTC/Zulu)
      const formatDateTime = (d: Date) =>
        d
          .toISOString()
          .replace(/[-:]|\.\d{3}/g, "") // Remove - : and milliseconds
          .slice(0, 15); // Keep YYYYMMDDTHHMMSS

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
        className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 relative group"
        style={{
          boxShadow: "2px 2px 1px rgb(0, 0, 0)",
          border: "1px solid rgb(0, 0, 0)",
        }}
      >
        <div className="absolute top-4 right-4 z-20">
          <ActionsDropdown
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
            loading={loading}
          />
        </div>

        <img
          src={
            event.image ||
            "https://placehold.co/600x160/cccccc/333333?text=Image+Missing"
          }
          alt={event.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "https://placehold.co/600x160/cccccc/333333?text=Image+Missing";
          }}
        />

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
            <span className="line-clamp-1">{event.location.name}</span>
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

// ---------------- EVENT CRUD FORM (Only Renders for Edit/Create) ----------------
const EventCrudForm: React.FC<{
  formData: FormData;
  loading: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  // New prop to control visibility
  isVisible: boolean;
}> = ({ formData, loading, handleChange, handleSubmit, resetForm, isVisible }) => {
  if (!isVisible) return null; // Render null if not visible

  const isEditing = !!formData._id;

  return (
    <div className="w-full max-w-4xl mx-auto py-6" id="event-crud-form">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">
        {isEditing ? "✏️ Edit Event" : "✨ Create New Event"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-900 space-y-6 mb-12"
        style={{ boxShadow: "4px 4px 0px #1f2937" }}
      >
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
            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150"
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
            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150"
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
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150"
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
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150"
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
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150"
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
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150"
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
            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150"
          />
        </div>

        {/* Submit / Cancel */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center py-3 px-6 rounded-lg bg-purple-600 text-white font-bold text-lg shadow-md hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            style={{ boxShadow: loading ? "none" : "2px 2px 0px #4c1d95" }}
          >
            {loading ? (
              <span className="flex items-center">
                <Icon
                  icon="mdi:loading"
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                />
                Saving...
              </span>
            ) : (
              <>
                {isEditing ? (
                  <EditIcon className="h-5 w-5 mr-2" />
                ) : (
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                )}
                {isEditing ? "Update Event" : "Create Event"}
              </>
            )}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="w-1/4 py-3 px-6 rounded-lg bg-gray-200 text-gray-800 font-bold shadow-md hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ---------------- MAIN COMPONENT (CRUD MANAGER) ----------------
export default function EventCrudManager() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [userCity, setUserCity] = useState("Vellore");
  const [searchQuery, setSearchQuery] = useState("");

  // --- CRUD State ---
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loadingCity, setLoadingCity] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  // New state to manage form visibility
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const isEditing = !!formData._id;
  const MONGODB_API_ENDPOINT = "/api/events";

  // --- CRUD Logic: Read ---
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
      setLoading(false);
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

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setIsFormVisible(false); // Hide form on reset
  }, []);

  // Handler to set form data for editing and show the form
  const handleEdit = useCallback((eventToEdit: EventData) => {
    // Format date to 'YYYY-MM-DDTHH:mm' for datetime-local input
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
      image: eventToEdit.image || "",
    });
    setIsFormVisible(true); // Show form for editing
    // Simulate redirection: Scroll to the form area after setting data
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCreateNew = useCallback(() => {
      resetForm(); // Ensure form is cleared
      setIsFormVisible(true); // Show form for creating
      window.scrollTo({ top: 0, behavior: "smooth" });
  }, [resetForm]);


  // --- CRUD Logic: Create/Update ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${MONGODB_API_ENDPOINT}/${formData._id}`
      : MONGODB_API_ENDPOINT;

    const requestData = {
      ...formData,
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
      setFeedback({
        type: "success",
        message: `Event ${isEditing ? "updated" : "created"} successfully!`,
      });
      resetForm(); // This now hides the form
      fetchEvents();
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

  // --- CRUD Logic: Delete (called directly from dropdown) ---
  const handleDelete = async (event: EventData) => {
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(
        `${MONGODB_API_ENDPOINT}/${event._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }

      setFeedback({ type: "success", message: `Event '${event.title}' deleted successfully.` });
      fetchEvents();
      if (isEditing && formData._id === event._id) {
          resetForm(); // Hide form if the event being edited was just deleted
      }
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
  
  // --- Geolocation Logic (Kept as is) ---
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

  // Memoized list of events filtered by city and search query
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
      {/* RENDER THE FEEDBACK MESSAGE / TOAST */}
      <FeedbackMessage feedback={feedback} onClose={() => setFeedback(null)} />
      {/* DeleteConfirmationModal removed */}

      {/* Header with Background and Search */}
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
          {/* Create New Button - Always visible, triggers the form */}
        {!isFormVisible && (
            <div className="text-center pt-10">
                <button
                    onClick={handleCreateNew}
                    className="flex items-center justify-center mx-auto py-3 px-8 rounded-full bg-purple-600 text-white font-bold text-lg shadow-md hover:bg-purple-700 transition-all duration-300"
                    style={{ boxShadow: "2px 2px 0px #4c1d95" }}
                >
                    <PlusCircleIcon className="h-6 w-6 mr-2" />
                    Post a New Event
                </button>
            </div>
        )}

        {/* --- Create/Edit Event Form (Conditional Rendering) --- */}
        <EventCrudForm
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          isVisible={isFormVisible} // Pass visibility state
        />
        
        {/* --- Events in My City Section --- */}
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
            <div
              className="text-center p-8 text-lg text-purple-600 font-medium flex items-center justify-center space-x-2 bg-white rounded-lg shadow-sm border border-black"
              style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}
            >
              <Icon icon="mdi:loading" className="h-6 w-6 animate-spin" />
              <span>Loading events from API...</span>
            </div>
          )}

          {!fetchLoading && eventsInMyCity.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsInMyCity.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete} // Use the direct delete handler
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

        {/* --- All Events Section --- */}
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
                  onDelete={handleDelete} // Use the direct delete handler
                  loading={loading}
                />
              ))}
            </div>
          ) : (
            !fetchLoading && (
              <p
                className="text-center text-gray-500 text-lg p-8 bg-white rounded-lg shadow-sm border border-black"
                style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}
              >
                No upcoming events at the moment. Check back soon!
              </p>
            )
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
          backgroundColor: "rgba(237, 233, 254, 0.7)",
          border: "1px solid rgb(0, 0, 0)",
          boxShadow: "2px 2px 1px rgb(0, 0, 0)",
          backdropFilter: "blur(8px)",
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