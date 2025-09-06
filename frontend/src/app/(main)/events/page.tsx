import React from 'react';
import { Icon } from '@iconify/react';

// Mock data for events with added imageUrls
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
    id: 3,
    category: 'exhibition',
    title: 'Future Tech Expo 2024',
    date: 'Jan 5, 2025',
    location: 'Convention Center',
    city: 'New York',
    description: 'Explore the latest innovations in technology and AI.',
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
  {
    id: 7,
    category: 'stand-up',
    title: 'Laugh Out Loud Comedy Night',
    date: 'Sep 5, 2025',
    location: 'The Comedy Club',
    city: 'New York',
    description: 'An evening of hilarious stand-up from up-and-coming comedians.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
  {
    id: 8,
    category: 'disco',
    title: '70s Disco Fever',
    date: 'Nov 1, 2025',
    location: 'The Groove Factory',
    city: 'Chicago',
    description: 'Get down to the best funk and disco hits from the 70s.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
  {
    id: 9,
    category: 'opera',
    title: 'The Grand Opera',
    date: 'Jan 25, 2025',
    location: 'The Historic Theater',
    city: 'Los Angeles',
    description: 'A stunning performance of a timeless opera masterpiece.',
    imageUrl: 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg',
  },
];

// Function to get the correct Iconify component for each category
const getIcon = (category: string) => {
  switch (category) {
    case 'concert':
      return <Icon icon="flat-color-icons:music" className='h-5 w-5 text-indigo-500' />;
    case 'dance':
      return <Icon icon="noto:woman-dancing" className='h-5 w-5' />;
    case 'exhibition':
      return <Icon icon="flat-color-icons:gallery" className='h-5 w-5 text-teal-500' />;
    case 'party':
      return <Icon icon="bxs:party" className='h-5 w-5 text-yellow-500' />;
    case 'movie':
      return <Icon icon="mingcute:movie-fill" className='h-5 w-5 text-grey-500' />;
    case 'stand-up':
      return <Icon icon="material-symbols:mic" className='h-5 w-5 text-grey-500' />;
    case 'opera':
      return <Icon icon="flat-color-icons:opera" className='h-5 w-5 text-purple-500' />;
    case 'disco':
      return <Icon icon="flat-color-icons:disco-ball" className='h-5 w-5 text-blue-500' />;
    default:
      return null;
  }
};

// Define interface for event object
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

// Helper component for a single event card
const EventCard = ({ event }: { event: Event }) => {
  const getGoogleMapsUrl = (location: string, city: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location}, ${city}`)}`;
  };

  const getGoogleCalendarUrl = (event: Event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(event.date);
    startDate.setHours(19, 0, 0); // Defaulting to 7 PM for evening events
    endDate.setHours(21, 0, 0); // Event ends 2 hours later

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
    <div className="bg-white p-6 rounded-xl shadow-lg transition-transform hover:scale-105 duration-300" style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)", border: "1px solid rgb(0, 0, 0)" }}>
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover rounded-md mb-4" />
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
        {getIcon(event.category)}
      </div>
      <p className="text-sm text-gray-500 mb-1 flex items-center">
        {event.date}
        <a 
          href={getGoogleCalendarUrl(event)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-2 text-blue-500 hover:text-blue-700"
          title="Add to Google Calendar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </a>
      </p>
      <p className="text-sm text-gray-500 mb-4 flex items-center">
        {event.location}, {event.city}
        <a 
          href={getGoogleMapsUrl(event.location, event.city)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-2 text-green-500 hover:text-green-700"
          title="View on Google Maps"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </a>
      </p>
      <p className="text-gray-600 text-sm">{event.description}</p>
    </div>
  );
};

export default function EventsPage() {
  const userCity = 'New York'; // This could be dynamically set in a real app
  
  const categories = ['concert', 'dance', 'movie', 'stand-up', 'opera', 'disco', 'exhibition', 'party'];
  
  const eventsInMyCity = mockEvents.filter(event => event.city === userCity);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-16 lg:p-24 bg-gradient-to-br from-blue-100 to-purple-100 font-sans">
      
      {/* Page Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-900">
          Upcoming Events
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore a world of events, from concerts and art shows to parties and more.
        </p>
      </div>

      {/* Section 1: Register Shows */}
      <section className="w-full max-w-5xl mb-12 p-6 bg-purple-50 rounded-2xl shadow-md" style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)", border: "1px solid rgb(0, 0, 0)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-700">
            Showcase Your Talent
          </h2>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all hover:bg-purple-700 hover:shadow-lg" style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}>
            Register Your Show
          </button>
        </div>
        <p className="text-gray-700">
          Have an event you want to promote? Register your show with us to reach a wider audience. It's fast, easy, and effective.
        </p>
      </section>

      {/* Section 2: Events in My City */}
      <section className="w-full max-w-5xl mb-12" >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Events in {userCity}
        </h2>
        {eventsInMyCity.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsInMyCity.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg text-center p-8 bg-gray-100 rounded-xl" style={{ boxShadow: "2px 2px 1px rgb(0, 0, 0)" }}>
            No upcoming events found in your city. Check back soon!
          </p>
        )}
      </section>

      {/* Section 3: Categories */}
      <section className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6">
          Browse by Category
        </h2>
        
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 capitalize">
              {category.replace('-', ' ')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEvents.filter(e => e.category === category).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}

      </section>
    </main>
  );
}