import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Notes = () => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    // In a real app, this would save the content to a backend
    console.log('Saving note:', content);
    // You could also use react-query's useMutation here for actual API calls
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Farm Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent}
            className="h-64 mb-12"
          />
          <div className="mt-4">
            <Button onClick={handleSave}>Save Note</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notes;