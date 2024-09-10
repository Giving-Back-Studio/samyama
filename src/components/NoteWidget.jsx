import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save } from "lucide-react";

const NoteWidget = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');

  const handleSaveNote = () => {
    if (currentNote.trim()) {
      setNotes([...notes, { id: Date.now(), content: currentNote }]);
      setCurrentNote('');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Quick Notes</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentNote('')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Textarea
          placeholder="Type your note here..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          className="flex-grow mb-4 resize-none"
        />
        <Button onClick={handleSaveNote} disabled={!currentNote.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Save Note
        </Button>
        <div className="mt-4 space-y-2 overflow-y-auto max-h-60">
          {notes.map((note) => (
            <div key={note.id} className="bg-gray-100 p-2 rounded">
              {note.content}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteWidget;