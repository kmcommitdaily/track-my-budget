"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface NotepadProps {
  value: string
  onChange: (value: string) => void
}

export function Notepad({ value, onChange }: NotepadProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add your notes here..."
          className="min-h-[200px] resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  )
}

