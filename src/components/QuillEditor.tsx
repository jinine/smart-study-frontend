import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

type Params = {
    value: any,
    setValue: any
};

export default function QuillEditor({value, setValue}: Params) {

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
