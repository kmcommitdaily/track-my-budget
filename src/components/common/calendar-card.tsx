'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Notepad } from '@/components/common/notepad';
import { useState } from 'react';

export function CalendarCard() {
  const date = new Date();
  const [notes, setNotes] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-around gap-3">
        <Calendar mode="single" selected={date} className="rounded-md border" />
        <Notepad value={notes} onChange={setNotes} />
      </CardContent>
    </Card>
  );
}
