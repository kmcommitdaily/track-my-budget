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
  const [isLoading, setIsLoading] = useState(true);

  const [formattedDate, setFormattedDate] = useState<string>(
    formatDate(selectedDate)
  );

  useEffect(() => {
    getUserId().then((id) => {
      setUserId(id);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const stored = localStorage.getItem(`notepad-${userId}`);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch {
        setNotes({});
      }
    }
  }, [userId]);

  useEffect(() => {
    setFormattedDate(formatDate(selectedDate)); // Update formatted date when selectedDate changes
  }, [selectedDate]);

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
  function formatDate(date: Date): string {
    return date.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  // Avoid displaying notes until userId is set
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar - {formattedDate}</CardTitle>
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
