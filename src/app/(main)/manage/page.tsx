"use client";

import React, { useState, useEffect, useCallback } from "react";


// ====================================================================
// --- Dynamic Icon Map & Component (Kept as-is) ---
// ====================================================================

const IconMap: {
  [key: string]: {
    viewBox: string;
    paths: { d: string; type?: "circle" | "path" }[];
  };
} = {
  plusCircle: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 8v8", type: "path" },
      { d: "M8 12h8", type: "path" },
      { d: "M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0", type: "path" }, // Simplified circle drawing
    ],
  },
  mapPin: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", type: "path" },
      { d: "M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0", type: "path" }, // Simplified circle drawing
    ],
  },
  edit: {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5L2 22l1.5-5.5L17 3z",
        type: "path",
      },
    ],
  },
  trash: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M3 6h18", type: "path" },
      { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", type: "path" },
      { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", type: "path" },
    ],
  },
  checkCircle: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14", type: "path" },
      { d: "M22 4L12 14.01l-3-3", type: "path" },
    ],
  },
  alertTriangle: {
    viewBox: "0 0 24 24",
    paths: [
      {
        d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h18.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
        type: "path",
      },
      { d: "M12 9v4", type: "path" },
      { d: "M12 17h.01", type: "path" },
    ],
  },
  chevronDown: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "m6 9 6 6 6-6", type: "path" }
    ]
  },
  x: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M18 6 6 18", type: "path" },
      { d: "m6 6 12 12", type: "path" },
    ],
  },
};

// --- Single Dynamic Icon Component (Simulating Iconify Usage) ---
interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  iconName: keyof typeof IconMap; // Enforce valid icon names
}

const DynamicIcon = ({ iconName, ...props }: DynamicIconProps) => {
  const iconData = IconMap[iconName];

  if (!iconData) {
    console.error(`Icon "${iconName}" not found in map.`);
    return null;
  }

  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox={iconData.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconData.paths.map((pathData, index) =>
        pathData.type === "circle" ? (
          <circle key={index} cx="12" cy="12" r="10" />
        ) : (
          <path key={index} d={pathData.d} />
        )
      )}
    </svg>
  );
};

// ====================================================================
// --- Toast Notification Implementation (Kept as-is) ---
// ====================================================================

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

const TOAST_DURATION = 4000; // 4 seconds

const ToastContext = React.createContext<
  ((message: string, type: "success" | "error") => void) | undefined
>(undefined);

// A custom hook to use the toast function
const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// The component to display a single toast
const Toast = ({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) => {
  const baseClasses =
    "p-4 rounded-xl shadow-xl mb-4 max-w-sm w-full flex items-center transform transition-all duration-300 ease-out pointer-events-auto";
  const successClasses = "bg-green-600 text-white";
  const errorClasses = "bg-red-600 text-white";
  const iconName = toast.type === "success" ? "checkCircle" : "alertTriangle";

  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${baseClasses} ${
        toast.type === "success" ? successClasses : errorClasses
      }`}
      style={{
        animationName: "slideIn",
        animationDuration: "0.3s",
        animationTimingFunction: "ease-out",
      }}
    >
      <DynamicIcon iconName={iconName} className="h-6 w-6 mr-3 flex-shrink-0" />
      <p className="font-medium flex-grow">{toast.message}</p>
      <button
        onClick={onClose}
        className="ml-4 p-1 rounded-full hover:bg-white/30 transition flex-shrink-0"
        aria-label="Close notification"
      >
        <DynamicIcon iconName="x" className="h-5 w-5" />
      </button>
    </div>
  );
};

// The main container and provider for toasts
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    const newToast = { id, message, type };
    // Only keep a maximum of 3 toasts visible at a time
    setToasts((prev) => [...prev.slice(-2), newToast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 sm:p-6 space-y-2 flex flex-col items-end">
        {/* Keyframes for the slide-in animation */}
        <style jsx global>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ====================================================================
// --- Interfaces & Initial State (Kept as-is) ---
// ====================================================================

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string; // ISO string
  image: string;
  category: { name: string };
  city: { name: string };
  location: { name: string; city: { name: string } };
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


// ====================================================================
// --- Main Component: EventManagement (MODIFIED TOGGLE LOGIC) ---
// ====================================================================

function EventManagement() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  
  // NEW STATE: Controls the visibility of the form
  const [showForm, setShowForm] = useState<boolean>(false);

  const showToast = useToast();

  const isEditing = !!formData._id;
  const MONGODB_API_ENDPOINT = "/api/events";

  // --- Data Fetching ---
  const fetchEvents = useCallback(async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(MONGODB_API_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch events.");

      const data = await response.json();
      setEvents(data);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      showToast("Could not load events. Server error.", "error");
    } finally {
      setFetchLoading(false);
    }
  }, [showToast]);

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

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleEdit = (eventToEdit: EventData) => {
    // 1. Show the form
    setShowForm(true);

    // 2. Populate the form data
    const formattedDate = new Date(eventToEdit.date)
      .toISOString()
      .substring(0, 16);

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
    
    // 3. Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to prepare the form for a new creation or toggle visibility
  const handleToggleCreateForm = () => {
    if (showForm && !isEditing) {
        // If visible and not editing (i.e., we are in create mode), hide it
        setShowForm(false);
        resetForm();
    } else {
        // If hidden or currently editing an old event, show/reset to create mode
        resetForm(); // Ensure we clear any old edit data
        setShowForm(true); 
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the form
    }
  }

  // --- CRUD Operations (Using Toast for feedback) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${MONGODB_API_ENDPOINT}/${formData._id}`
      : MONGODB_API_ENDPOINT;

    // Prepare data to send to the API
    const requestData = {
      ...formData,
      date: new Date(formData.date).toISOString(), // Ensure ISO format for Mongoose
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
      showToast(
        `Event ${isEditing ? "updated" : "created"} successfully!`,
        "success"
      );
      resetForm();
      setShowForm(false); // Hide form on successful submission
      fetchEvents(); 
    } catch (error: any) {
      console.error("API Error:", error);
      showToast(`Operation failed: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    setLoading(true);

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

      showToast("Event deleted successfully.", "success");
      // If we were editing the deleted event, reset the form state and hide
      if (formData._id === id) {
          resetForm();
          setShowForm(false);
      }
      fetchEvents();
    } catch (error: any) {
      console.error("Delete Error:", error);
      showToast(`Delete failed: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-['Inter',_sans-serif] p-4 sm:p-8">
      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
        }
      `}</style>

      <div className="w-full max-w-4xl mx-auto py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
          <DynamicIcon iconName="edit" className="h-8 w-8 mr-3 text-purple-600"/>
          Event Management Dashboard
        </h1>

        {/* --- TOGGLE BUTTON FOR CREATE FORM --- */}
        <div className="mb-8">
            <button
                onClick={
                    // If editing, clicking the button shows/hides the form while keeping edit data
                    isEditing 
                        ? () => setShowForm(prev => !prev) 
                        // If not editing, clicking the button toggles between create form being shown/hidden
                        : handleToggleCreateForm
                }
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                    (showForm && !isEditing) 
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                }`}
                style={{ boxShadow: "2px 2px 0px #4c1d95" }}
            >
                {isEditing ? (
                    <>
                        <DynamicIcon iconName="edit" className="h-5 w-5 mr-2" />
                        {showForm ? 'Hide Edit Form' : `Currently Editing: ${formData.title || "Event"} (Click to Show)`}
                    </>
                ) : showForm ? (
                    <>
                        <DynamicIcon iconName="x" className="h-5 w-5 mr-2" />
                        Hide Create Form
                    </>
                ) : (
                    <>
                        <DynamicIcon iconName="plusCircle" className="h-5 w-5 mr-2" />
                        Create New Event
                    </>
                )}
            </button>
        </div>


        {/* --------------------------- */}
        {/* --- Event Form (C/U) - Conditional Rendering --- */}
        {/* --------------------------- */}
        {showForm && (
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
                    {isEditing ? "✏️ Edit Event" : "✨ Create New Event"}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-900 space-y-6"
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
                                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none transition duration-150 bg-white"
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
                                    {isEditing ? (
                                        <DynamicIcon iconName="edit" className="h-5 w-5 mr-2" />
                                    ) : (
                                        <DynamicIcon iconName="plusCircle" className="h-5 w-5 mr-2" />
                                    )}
                                    {isEditing ? "Update Event" : "Create Event"}
                                </>
                            )}
                        </button>
                        {(isEditing || showForm) && (
                            <button
                                type="button"
                                onClick={() => {resetForm(); setShowForm(false);}}
                                className="w-1/4 py-3 px-6 rounded-lg bg-gray-200 text-gray-800 font-bold shadow-md hover:bg-gray-300 transition-all duration-300"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        )}

        {/* --------------------------- */}
        {/* --- Event List (R/D) --- */}
        {/* --------------------------- */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
          <DynamicIcon iconName="checkCircle" className="h-6 w-6 mr-2 text-green-600"/>
          Existing Events ({fetchLoading ? "Loading..." : events.length})
        </h2>

        {fetchLoading && (
          <div className="text-center p-8 text-lg text-purple-600 font-medium">
            Loading events from API...
          </div>
        )}

        {!fetchLoading && events.length === 0 && (
          <div className="text-center p-8 text-lg text-gray-500 border rounded-xl bg-white shadow-md">
            No events found. Start by creating one above!
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className={`bg-white p-6 rounded-xl shadow-lg border-2 transition hover:shadow-xl ${
                isEditing && formData._id === event._id ? 'border-4 border-purple-500 ring-4 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="md:flex">
                <img
                  src={
                    event.image ||
                    "https://placehold.co/120x80/8b5cf6/ffffff?text=Event"
                  }
                  alt={event.title}
                  className="w-full md:w-32 h-24 object-cover rounded-lg mb-4 md:mb-0 md:mr-6 flex-shrink-0 border border-gray-100"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/120x80/8b5cf6/ffffff?text=Image+Failed";
                  }}
                />
                <div className="flex-grow min-w-0">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mb-1">
                    {event.category.name}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                    {event.description}
                  </p>
                  <p className="mt-2 text-gray-500 text-sm flex items-center">
                    <DynamicIcon
                      iconName="mapPin"
                      className="h-4 w-4 mr-1 text-purple-600"
                    />
                    <span className="truncate">{event.location.name}, {event.city.name}</span>
                  </p>
                </div>
                <div className="flex flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-3 mt-4 md:mt-0 md:ml-6 items-start">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition shadow-md"
                    title="Edit Event"
                  >
                    <DynamicIcon iconName="edit" className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md"
                    title="Delete Event"
                    disabled={loading}
                  >
                    <DynamicIcon iconName="trash" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ====================================================================
// --- App Wrapper ---
// ====================================================================

export default function EventManagementApp() {
    return (
        <ToastProvider>
            <EventManagement />
        </ToastProvider>
    );
}