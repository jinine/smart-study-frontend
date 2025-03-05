import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Params = {
    value: any,
    setValue: any
};

export default function QuillEditor({ value, setValue }: Params) {
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'align', 'bold', 'italic', 'underline', 'strike', 
        'list', 'bullet', 'blockquote', 'code-block', 'link', 'image', 
        'color', 'background', 'clean'
    ];

    return (
            <ReactQuill
                value={value}
                onChange={setValue}
                theme="snow"
                className="rounded-lg border border-gray-300"
                modules={modules}
                formats={formats}
            />
    );
}
