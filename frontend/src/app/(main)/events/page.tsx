'use client'
import React, { useEffect, useState, useMemo, memo } from 'react';
import { Icon } from '@iconify/react';

const mockEvents = [
  {
    id: 1,
    category: 'concert',
    title: 'Jazz Night in the City',
    date: 'Dec 15, 2024',
    location: 'Central Hall',
    city: 'New York',
    description: 'An evening of smooth jazz and soulful tunes.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
  {
    id: 2,
    category: 'dance',
    title: 'Contemporary Dance Showcase',
    date: 'Dec 20, 2024',
    location: 'Artistic Center',
    city: 'Los Angeles',
    description: 'A performance highlighting modern dance choreography.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
  {
    id: 4,
    category: 'party',
    title: 'New Year\'s Eve Bash',
    date: 'Dec 31, 2024',
    location: 'Skyline Lounge',
    city: 'Los Angeles',
    description: 'Ring in the new year with great music and a fantastic view.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
  {
    id: 5,
    category: 'concert',
    title: 'Rock Festival',
    date: 'Jan 10, 2025',
    location: 'Outdoor Amphitheater',
    city: 'Chicago',
    description: 'A full day of live performances by local rock bands.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
  {
    id: 6,
    category: 'movie',
    title: 'Outdoor Film Screening',
    date: 'Aug 20, 2025',
    location: 'Parkside Lawn',
    city: 'New York',
    description: 'A family-friendly screening of a classic film under the stars.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
];

const categories = ['concert', 'dance', 'movie', 'party'];

interface Event {
  id: number;
  category: string;
  title: string;
  date: string;
  location: string;
  city: string;
  description: string;
  imageUrl: string;
}

const getIcon = (category: string) => {
  switch (category) {
    case 'concert':
      return <Icon icon="flat-color-icons:music" className='h-6 w-6 text-purple-500' />;
    case 'dance':
      return <Icon icon="noto:woman-dancing" className='h-6 w-6' />;
    case 'competition':
      return <Icon icon="mdi:trophy" className='h-6 w-6 text-yellow-500' />;
    case 'party':
      return <Icon icon="bxs:party" className='h-6 w-6 text-purple-500' />;
    case 'movie':
      return <Icon icon="mingcute:movie-fill" className='h-6 w-6 text-gray-500' />;
    default:
      return null;
  }
};

// --- REUSABLE COMPONENTS ---

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
    {children}
  </div>
);

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
      return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
    };

    const dates = `${formatDateTime(startDate)}/${formatDateTime(endDate)}`;
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(`${event.location}, ${event.city}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300"
      style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)", border: "1px solid rgb(0, 0, 0)" }}>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{event.date}</p>
        </div>
        {getIcon(event.category)}
      </div>
      <p className="text-gray-600 text-sm mb-4">{event.description}</p>
      <div className="flex items-center space-x-4 text-gray-500">
        <a
          href={getGoogleMapsUrl(event.location, event.city)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm hover:text-purple-600 transition-colors duration-200"
          title="View on Google Maps"
        >
          <Icon icon="mdi:map-marker" className="h-4 w-4 mr-1" />
          <span>{event.location}</span>
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

// Main Page Component
export default function EventsPage() {
  const userCity = 'New York';
  const [searchQuery, setSearchQuery] = useState('');

  const eventsInMyCity = useMemo(() =>
    mockEvents.filter(event =>
      event.city === userCity &&
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.location.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [searchQuery, userCity]
  );

  return (
    <main className="min-h-screen text-black font-sans">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Container>
        <section className="py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center">
            Events in <span className="text-purple-600">{userCity}</span>
          </h2>
          {eventsInMyCity.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsInMyCity.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg p-8 bg-white rounded-lg shadow-sm border border-black"
              style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}>
              No upcoming events found in your city. Check back soon!
            </p>
          )}
        </section>
        <section className="py-12 md:py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center">
            Explore by Category
          </h2>
          {categories.map(category => {
            const events = mockEvents.filter(e => e.category === category);
            if (events.length === 0) return null;
            return (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 capitalize text-center text-gray-800">
                  {category.replace('-', ' ')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </Container>
    </main>
  );
}

// Header component with the correct dual-box layout
const Header = ({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <header className="flex flex-col items-center pt-24 pb-12 font-sans text-gray-900">
      <div className="bg-purple-50 w-full max-w-2xl text-center rounded-3xl p-16 shadow-lg shadow-purple-200"
        style={{ 
          border: "1px solid rgb(0, 0, 0)",
          boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-relaxed max-w-md mx-auto">
          Discover restaurants, explore menus, book tables - all in one place
        </h1>
        <div className="relative mt-12 w-full max-w-sm mx-auto">
          <Icon icon="eva:search-fill" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a restaurant name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 bg-white rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow duration-200"
          />
        </div>
      </div>
    </header>
  );
};