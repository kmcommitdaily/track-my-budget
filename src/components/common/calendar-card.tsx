'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Notepad } from '@/components/common/notepad';
import { useEffect, useState } from 'react';

async function getUserId(): Promise<string> {
  const res = await fetch('/api/user');
  const data = await res.json();
  return data.user?.id ?? 'guest';
}

export function CalendarCard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true); // Loading state for user ID fetch

  useEffect(() => {
    // Fetch user ID on component mount
    getUserId().then((id) => {
      setUserId(id);
      setIsLoading(false); // Stop loading once user ID is set
    });
  }, []);

  useEffect(() => {
    if (!userId) return; // Don't attempt to load notes without a user ID

    // Load notes from localStorage when userId is available
    const stored = localStorage.getItem(`notepad-${userId}`);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch {
        setNotes({});
      }
    }
  }, [userId]); // Only run when userId changes

  // Handle note change
  const currentKey = selectedDate.toDateString();
  const currentNote = notes[currentKey] || '';

  const handleNoteChange = (val: string) => {
    if (!userId) return;

    setNotes((prev) => {
      const updated = { ...prev, [currentKey]: val };
      localStorage.setItem(`notepad-${userId}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Avoid displaying notes until userId is set
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around gap-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border"
        />
        <Notepad value={currentNote} onChange={handleNoteChange} />
      </CardContent>
    </Card>
  );
}
