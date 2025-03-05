import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import QuillEditor from "../components/QuillEditor";
import Modal from "../components/Modal";
// import { Modal } from "@fluentui/react";

export default function Dashboard() {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [value, setValue] = useState("");
    const [share, setShare] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        if (!uuid) return;

        setLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/document/${uuid}`)
            .then((response) => {
                setDocument(response.data.document);
                setValue(response.data.document.content);
                setError("");
            })
            .catch((err) => {
                console.error("Error fetching document:", err);
                setError("Document not found.");
            })
            .finally(() => setLoading(false));
    }, [uuid]);

    const handleSave = async () => {
        if (!document) return;

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URI}/api/v1/documents/update_document/${uuid}`, {
                access_type: document.access_type,
                users: document.users,
                content: value,
            });
            alert("Document saved successfully!");
        } catch (err) {
            console.error("Error saving document:", err);
            alert("Failed to save document.");
        }
    };

    const handleDelete = async () => {
        if (!uuid) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this document?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URI}/api/v1/documents/delete_document/${uuid}`);
            alert("Document deleted successfully!");
            navigate("/");
        } catch (err) {
            console.error("Error deleting document:", err);
            alert("Failed to delete document.");
        }
    };


    const shareContent = () => {
        <div className="text-black">
            Sonmething is cool
        </div>
    }

    return (
        <div>
            <Header />
            <main className="p-8 lg:flex-col">
                {share && (
                    <Modal openClose={() => setShare(!share)} children={shareContent}></ Modal>
                )}
                {loading ? (
                    <p>Loading document...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <>
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                            <button onClick={() => setShare(true)} className="">
                                Share
                            </button>
                        </div>
                        <QuillEditor value={value} setValue={setValue} />
                    </>
                )}
            </main>
        </div>
    );
}