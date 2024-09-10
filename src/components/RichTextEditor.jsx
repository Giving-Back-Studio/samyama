import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const RichTextEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = React.useState(() =>
    value
      ? EditorState.createWithContent(ContentState.createFromText(value))
      : EditorState.createEmpty()
  );

  const handleEditorChange = (state) => {
    setEditorState(state);
    onChange(convertToRaw(state.getCurrentContent()));
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleEditorChange}
      wrapperClassName="border rounded-md"
      editorClassName="px-3 min-h-[200px]"
      toolbar={{
        options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'history'],
        inline: { options: ['bold', 'italic', 'underline'] },
        blockType: { options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote'] },
        list: { options: ['unordered', 'ordered'] },
      }}
    />
  );
};

export default RichTextEditor;