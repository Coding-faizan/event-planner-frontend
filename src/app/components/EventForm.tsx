"use client";

import { useEffect, useState } from "react";
import { Event, EVENT_CATEGORIES, EventCategory } from "@/types/event";
import { on } from "events";

type FormData = {
  title: string;
  description: string;
  date: string;
  category: EventCategory;
};

export default function EventForm({
  selected,
  onSave,
}: {
  selected: Event | null;
  onSave: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    category: "work",
  });
  const [isSubmitting,setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      category: "work",
    });
  };

  useEffect(() => {
    if (selected) {
      setForm({
        title: selected.title,
        description: selected.description,
        date: selected.date.slice(0, 10), // fix for input[type=date]
        category: selected.category,
      });
    } else {
      resetForm();
    }
  }, [selected]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      let res: Response;
      
      if (selected?._id) {
        res = await fetch(`http://localhost:5000/api/events/${selected._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        throw new Error(`Failed to ${selected ? 'update' : 'add'} event`);
      }

      const result = await res.json();
      console.log('Event saved successfully:', result);
      
      // Reset form on success
      resetForm();
      onSave();
    } catch (err) {
      console.error('Failed to save event:', err);
      alert(`Failed to ${selected ? 'update' : 'add'} event. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-gray-50 border rounded shadow">
      <h2 className="font-bold text-xl">
        {selected ? "Edit Event" : "Add Event"}
      </h2>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-2 border rounded"
        required
        disabled={isSubmitting}
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded resize-none"
        disabled={isSubmitting}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        min={new Date().toISOString().split("T")[0]}
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
        disabled={isSubmitting}
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
        disabled={isSubmitting}
      >
        {EVENT_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <button
        disabled={isSubmitting}
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded w-full disabled:opacity-50"
      >
        {selected ? "Update Event" : "Add Event"}
      </button>
      {selected &&
        <button
          type="button"
          onClick={() => {
            resetForm();
            onSave();
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded w-full mt-2 disabled:opacity-50"
          disabled={isSubmitting}
        > Cancel </button>
      }
    </form>
  );
}
