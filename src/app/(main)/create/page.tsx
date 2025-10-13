"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface FormData {
  title: string;
  description: string;
  date: string;
  category: string;
  city: string;
  location: string;
  image: string;
}

export default function CreateEventPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    category: "",
    city: "",
    location: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event Created:", formData);
    alert("✅ Event created successfully!");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black font-sans">
      <div className="w-full max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          🎉 Create New Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg border border-black space-y-6"
          style={{ boxShadow: "2px 2px 1px rgb(0,0,0)" }}
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              rows={4}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              <option value="Concert">Concert</option>
              <option value="Party">Party</option>
              <option value="Dance">Dance</option>
              <option value="Movie">Movie</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          {/* City & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Location / Venue
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter venue"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Event Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/event.jpg"
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-6 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition-all"
          >
            <Icon icon="mdi:plus-circle" className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </form>

        {/* Live Preview */}
        {formData.title && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              👀 Live Preview
            </h2>
            <div
              className="bg-white p-6 rounded-xl shadow-lg border border-black"
              style={{ boxShadow: "2px 2px 1px rgb(0,0,0)" }}
            >
              {formData.image && (
                <img
                  src={formData.image}
                  alt={formData.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-gray-800">
                {formData.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formData.date
                  ? new Date(formData.date).toDateString()
                  : "No date selected"}
              </p>
              <p className="mt-2 text-gray-600">{formData.description}</p>
              <p className="mt-3 text-gray-500 text-sm flex items-center">
                <Icon
                  icon="mdi:map-marker"
                  className="h-4 w-4 mr-1 text-purple-500"
                />
                {formData.location}, {formData.city}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
