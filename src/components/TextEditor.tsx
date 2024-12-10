import React, { useRef, useState } from "react";

// Utility function to execute commands (bold, italic, etc.)
const execCommand = (command: string, value: unknown | any = null) => {
  document.execCommand(command, false, value);
};

const TextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState("16px");

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);
    execCommand("fontSize", e.target.value);
  };

  const handleBold = () => execCommand("bold");
  const handleItalic = () => execCommand("italic");
  const handleUnderline = () => execCommand("underline");
  const handleAlign = (alignment: string) => execCommand("justify" + alignment);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        {/* Bold Button */}
        <button
          onClick={handleBold}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          <strong>B</strong>
        </button>
        
        {/* Italic Button */}
        <button
          onClick={handleItalic}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          <em>I</em>
        </button>

        {/* Underline Button */}
        <button
          onClick={handleUnderline}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          <u>U</u>
        </button>

        {/* Font Size Dropdown */}
        <select
          value={fontSize}
          onChange={handleFontSizeChange}
          className="p-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="12px">12px</option>
          <option value="16px">16px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="30px">30px</option>
        </select>

        {/* Alignment Buttons */}
        <button
          onClick={() => handleAlign("Left")}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Left
        </button>
        <button
          onClick={() => handleAlign("Center")}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Center
        </button>
        <button
          onClick={() => handleAlign("Right")}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Right
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] border border-gray-300 p-4 text-lg font-sans rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          fontSize: fontSize,
        }}
      >
        Start typing your document...
      </div>
    </div>
  );
};

export default TextEditor;
