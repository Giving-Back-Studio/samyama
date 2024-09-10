import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RichTextEditor from './RichTextEditor';

const Notes = () => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    // In a real app, this would save the content to a backend
    console.log('Saving note:', content);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Farm Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          <div className="mt-4">
            <Button onClick={handleSave}>Save Note</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notes;