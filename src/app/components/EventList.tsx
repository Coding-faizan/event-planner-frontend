"use client";

import { useEffect, useState } from "react";
import { Event, EVENT_CATEGORIES } from "@/types/event";


export default function EventList({
  onEdit,
  refresh,
}: {
  onEdit: (e: Event) => void;
  refresh: boolean;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchEvents();
      setIsLoading(false);
    };
    fetchData();
  }, [refresh, category]);

  async function fetchEvents() {
    const res = await fetch(`http://localhost:5000/api/events`,{method: "GET"});
    let data: Event[] = await res.json();
    if (category) {
      data = data.filter((e) => e.category === category);
    }
    setEvents(data);
  }


  function handleFilter(category: string) {
    setCategory(category === category ? "" : category);
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm("Delete this event?")) return;
    await fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" });
    fetchEvents();
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
                className="w-14 h-12 px-1 bg-green-500 text-white rounded"
                onClick={() => onEdit(event)}
              >
                Edit
              </button>
              <button
                className="w-14 h-12 px-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(event._id)}
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
