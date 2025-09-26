export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: string;
  category: EventCategory;
  createdAt?: string;
  updatedAt?: string;
}
export type EventCategory = 'work' | 'personal' | 'other';

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  {value: 'other', label: 'Other' },
];