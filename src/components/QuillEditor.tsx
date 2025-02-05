import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

function QuillEditor() {
  const [editorData, setEditorData] = useState("");

  return (
    <div className="quill-editor">
      <ReactQuill
        value={editorData}
        onChange={setEditorData}
        theme="snow"
      />
    </div>
  );
}

export default QuillEditor;