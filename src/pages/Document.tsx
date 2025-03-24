import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import QuillEditor from "../components/QuillEditor";
import Modal from "../components/Modal";
import Share from "../components/share";
import { io } from "socket.io-client";

// Create a socket connection
const socket = io(process.env.REACT_APP_BACKEND_URI);

export default function Dashboard() {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [value, setValue] = useState("");
    const [share, setShare] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
    const user = localStorage.getItem("user");
    const [title, setTitle] = useState("");
    const [cuecardmodal, setcuecardmodal] = useState(false);

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
                if (!response.data.document.users.includes(user) && response.data.document.access_type !== "public") {
                    navigate("/dashboard");
                }
                setError("");
            })
            .catch((err) => {
                console.error("Error fetching document:", err);
                setError("Document not found.");
            })
            .finally(() => setLoading(false));
    }, [uuid]);

    useEffect(() => {
        if (uuid) {
            socket.on("document-update", (documentUuid, newContent) => {
                if (documentUuid === uuid) {
                    setValue(newContent);
                }
            });

            return () => {
                socket.off("document-update");
            };
        }
    }, [uuid]);

    const handleChange = (newContent: string) => {
        setValue(newContent);
        socket.emit("document-change", uuid, newContent);
    };

    const handleSave = async () => {
        if (!document) return;

        setIsSaving(true);

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
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        let saveIntervalId: NodeJS.Timeout;

        if (autoSaveEnabled) {
            saveIntervalId = setInterval(() => {
                handleSave();
            }, 60000);
        }

        return () => {
            if (saveIntervalId) clearInterval(saveIntervalId);
        };
    }, [value, document, uuid, autoSaveEnabled]);

    const handleDelete = async () => {
        if (!uuid) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this document?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URI}/api/v1/documents/delete_document/${uuid}`);
            alert("Document deleted successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error deleting document:", err);
            alert("Failed to delete document.");
        }
    };

    const shareContent = () => {
        return (
            <Share documentUuid={uuid} />
        );
    };

    const handletitlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const generateCueCardContent = () => {
        return (
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Enter cue card title"
                    className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={handletitlechange}
                />
                <button
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    onClick={generateCueCards}
                >
                    Generate
                </button>
            </div>
        );
    };

    const generateCueCards = async () => {
        if (!value) return alert("Document is empty!");

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URI}/api/v1/generate-cue-cards`,
                {
                    text: value, users: user, title: title
                }
            );
            if (response.status === 201) {
                setcuecardmodal(false);
            }
        } catch (error) {
            console.error("Error generating cue cards:", error);
            alert("Failed to generate cue cards.");
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <Header />
            <main className="p-8 lg:flex-col">
                {share && (
                    <Modal openClose={() => setShare(!share)}>{shareContent()}</Modal>
                )}
                {cuecardmodal && (
                    <Modal openClose={() => setcuecardmodal(!cuecardmodal)}>{generateCueCardContent()}</Modal>
                )}
                {loading ? (
                    <p className="text-gray-400">Loading document...</p>
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
                            <button
                                onClick={() => setcuecardmodal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Generate Cue Cards
                            </button>
                            <button onClick={() => setShare(true)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition">
                                Share
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <label className="text-gray-300">Enable Auto-save</label>
                            <input
                                type="checkbox"
                                checked={autoSaveEnabled}
                                onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                                className="h-5 w-5 bg-gray-700"
                            />
                        </div>

                        {isSaving && (
                            <div className="text-green-500 text-center mb-4">Auto-saving...</div>
                        )}

                        <QuillEditor value={value} setValue={handleChange} />
                    </>
                )}
            </main>
        </div>
    );
}