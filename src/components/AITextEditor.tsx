import React, { useRef, useState } from "react";
import axios from "axios";

// Utility function to execute commands (bold, italic, etc.)
const execCommand = (command: string, value: unknown | any = null) => {
  document.execCommand(command, false, value);
};

const AITextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState("16px");
  const [loading, setLoading] = useState(false);
  const [isPromptActive, setIsPromptActive] = useState(false);
  const [promptType, setPromptType] = useState("summarize");

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);
    execCommand("fontSize", e.target.value);
  };

  const handleBold = () => execCommand("bold");
  const handleItalic = () => execCommand("italic");
  const handleUnderline = () => execCommand("underline");
  const handleAlign = (alignment: string) => execCommand("justify" + alignment);

  const sendPromptToAPI = async () => {
    const userInput = prompt("Enter your prompt:");

    if (userInput && editorRef.current) {
      setLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:5000/api/${promptType}`,
          {
            "text": userInput,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const apiResponseText = response.data.text || "No response from API";
        
        if (editorRef.current) {
          editorRef.current.innerHTML = apiResponseText;
        }

        console.log(response)
      } catch (error) {
        console.error("Error calling API:", error);
        alert("An error occurred while generating text. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

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

        {/* Generate Text Button */}
        <button
          onClick={() => setIsPromptActive(!isPromptActive)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Text"}
        </button>
      </div>
      {isPromptActive ? (
        <div className="flex items-center space-x-3 mb-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={() => {
              setPromptType("summarize");
              sendPromptToAPI();
            }}
          >
            summarize
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={() => {
              setPromptType("qa");
              sendPromptToAPI();
            }}
          >
            Question / Answer
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={() => {
              setPromptType("generate");
              sendPromptToAPI();
            }}
          >
            Generate Text
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={() => {
              setPromptType("paraphrase");
              sendPromptToAPI();
            }}
          >
            Paraphrase
          </button>
        </div>
      ) : null}

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

export default AITextEditor;
