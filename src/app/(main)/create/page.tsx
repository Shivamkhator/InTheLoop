"use client";

import React, { useState, useEffect, useCallback } from "react";

// --- Custom Icon Components (Replacing external Icon dependency) ---
const PlusCircleIcon = (props) => (
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
const MapPinIcon = (props) => (
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
const EditIcon = (props) => (
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
const TrashIcon = (props) => (
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

// --- Utility Components ---
const FeedbackMessage = ({ feedback, onClose }) => {
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

// --- Interfaces ---
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

// --- Main Component ---
export default function EventManagementApp() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
    // Format the date for the datetime-local input (YYYY-MM-DDTHH:mm)
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
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- CRUD Operations ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${MONGODB_API_ENDPOINT}/${formData._id}`
      : MONGODB_API_ENDPOINT;

    // Prepare data to send to the API (category/city/location are sent as strings)
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

      await response.json(); // Wait for the response (saved data)
      setFeedback({
        type: "success",
        message: `Event ${isEditing ? "updated" : "created"} successfully!`,
      });
      resetForm();
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
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
      fetchEvents(); // Re-fetch to update the list
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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-['Inter',_sans-serif] p-4 sm:p-8">
      <style jsx global>{`
        body {
          font-family: "Inter", sans-serif;
        }
      `}</style>

      <FeedbackMessage feedback={feedback} onClose={() => setFeedback(null)} />

      <div className="w-full max-w-4xl mx-auto py-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
          🗓️ Event Management Dashboard
        </h1>

        {/* --- Event Form (Create/Edit) --- */}
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
          <div className="flex space-x-4">
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
                className="w-1/4 py-3 px-6 rounded-lg bg-gray-200 text-gray-800 font-bold shadow-md hover:bg-gray-300 transition-all duration-300"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* --- Event List (Read) --- */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">
          📋 Existing Events ({fetchLoading ? "Loading..." : events.length})
        </h2>

        {fetchLoading && (
          <div className="text-center p-8 text-lg text-purple-600 font-medium">
            Loading events from API...
          </div>
        )}

        {!fetchLoading && events.length === 0 && (
          <div className="text-center p-8 text-lg text-gray-500 border rounded-xl bg-white">
            No events found. Start by creating one above!
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-300 transition hover:shadow-xl"
            >
              <div className="md:flex">
                <img
                  src={
                    event.image ||
                    "https://placehold.co/120x80/8b5cf6/ffffff?text=Event"
                  }
                  alt={event.title}
                  className="w-full md:w-32 h-24 object-cover rounded-lg mb-4 md:mb-0 md:mr-6 flex-shrink-0"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/120x80/8b5cf6/ffffff?text=Image+Failed";
                  }}
                />
                <div className="flex-grow">
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
                    <MapPinIcon className="h-4 w-4 mr-1 text-purple-500" />
                    {event.location.name}, {event.city.name}
                  </p>
                </div>
                <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0 md:ml-6 items-start">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                    title="Edit Event"
                  >
                    <EditIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    title="Delete Event"
                    disabled={loading}
                  >
                    <TrashIcon className="h-5 w-5" />
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
