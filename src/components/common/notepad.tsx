'use client';

import { Textarea } from '@/components/ui/textarea';

interface NotepadProps {
  value: string;
  onChange: (value: string) => void;
}

export function Notepad({ value, onChange }: NotepadProps) {
  return (
    <Textarea
      placeholder="Add your notes here..."
      className="min-h-[200px] resize-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
