import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const RichTextEditor = ({ value, onChange }) => {
  const [editorState, setEditorState] = React.useState(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const handleEditorChange = (state) => {
    setEditorState(state);
    const html = draftToHtml(convertToRaw(state.getCurrentContent()));
    onChange(html);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleEditorChange}
      wrapperClassName="border rounded-md"
      editorClassName="px-3 min-h-[200px]"
      toolbar={{
        options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'history'],
        inline: {
          options: ['bold', 'italic', 'underline', 'strikethrough'],
        },
        blockType: {
          inDropdown: true,
          options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
        },
        list: {
          inDropdown: true,
          options: ['unordered', 'ordered'],
        },
        textAlign: {
          inDropdown: true,
          options: ['left', 'center', 'right', 'justify'],
        },
      }}
      toolbarCustomButtons={[]}
      customStyleMap={{
        'STRIKETHROUGH': {
          textDecoration: 'line-through',
        },
      }}
    />
  );
};

export default RichTextEditor;