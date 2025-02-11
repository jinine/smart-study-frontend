import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

export default function QuillEditor() {
    const [value, setValue] = useState("");

    return (
        <div className="w-full p-4 bg-white rounded-lg">
            <ReactQuill
                value={value}
                onChange={setValue}
                className="h-[75vh]"
                theme="snow"
            />
        </div>
    );
}
