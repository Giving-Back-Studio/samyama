import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const NoteWidget = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    const savedNote = localStorage.getItem('quickNote');
    if (savedNote) {
      const contentBlock = htmlToDraft(savedNote);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, []);

  const handleEditorChange = (state) => {
    setEditorState(state);
    const html = draftToHtml(convertToRaw(state.getCurrentContent()));
    localStorage.setItem('quickNote', html);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Quick Notes</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          wrapperClassName="border rounded-md"
          editorClassName="px-3 min-h-[200px]"
          toolbar={{
            options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'remove', 'history'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default NoteWidget;