"use client";

import { useCallback, useEffect, useState } from "react";
import { Event, EVENT_CATEGORIES } from "@/types/event";


export default function EventList({
  onEdit,
  refresh,
  selected,
}: {
  onEdit: (e: Event) => void;
  refresh: number;
  selected: Event | null;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/events?category=${category}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      let data: Event[] = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    }
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchEvents();
      setIsLoading(false);
    };
    fetchData();
  }, [refresh, fetchEvents]);


  function handleFilter(c: string) {
    setCategory(c === category ? "" : c);
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm("Delete this event?")) return;
    
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <p>Loading...</p>;


  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        {EVENT_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => handleFilter(c.value)}
            className={`px-3 py-1 rounded ${
              category === c.value ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {(!isLoading && events.length === 0) ? <p>No events found.</p> :
      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event._id}
            className="p-4 border rounded shadow flex justify-between"
          >
            <div>
              <h2 className="font-bold text-lg">{event.title}</h2>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()} • {event.category}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="w-14 h-12 px-1 bg-green-500 text-white rounded disabled:opacity-50"
                onClick={() => onEdit(event)}
                disabled={isLoading || (!!selected && selected._id === event._id)}
              >
                Edit
              </button>
              <button
                className="w-14 h-12 px-1 bg-red-500 text-white rounded disabled:opacity-50"
                onClick={() => handleDelete(event._id)}
                disabled={isLoading || (!!selected && selected._id === event._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    }
    </div>
  );
}
