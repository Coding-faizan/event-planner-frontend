"use client";

import { useState } from "react";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import { Event } from "@/types/event";

export default function Home() {
  const [selected, setSelected] = useState<Event | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSave = () => {
    setSelected(null);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Event Manager</h1>

      <EventForm
        selected={selected}
        onSave={handleSave}
      />

      <EventList onEdit={setSelected} refresh={refreshTrigger} selected={selected} />
    </div>
  );
}
