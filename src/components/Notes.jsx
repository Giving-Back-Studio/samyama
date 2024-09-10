import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Notes = () => {
  const [content, setContent] = useState('');
  const editorRef = useRef(null);

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      // In a real app, this would save the content to a backend
      console.log('Saving note:', content);
      setContent(content);
    }
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
          <div className="mb-4">
            <Editor
              apiKey="your-tinymce-api-key"
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={content}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
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