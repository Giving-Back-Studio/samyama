import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from './RichTextEditor';

const NoteWidget = () => {
  const [note, setNote] = useState('');

  useEffect(() => {
    const savedNote = localStorage.getItem('quickNote');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const handleNoteChange = (content) => {
    setNote(content);
    localStorage.setItem('quickNote', content);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Quick Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <RichTextEditor value={note} onChange={handleNoteChange} />
      </CardContent>
    </Card>
  );
};

export default NoteWidget;