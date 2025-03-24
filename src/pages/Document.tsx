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

export default function Document() {
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
    const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
    // const [rewrittenText, setRewrittenText] = useState("");
    const [tone, setTone] = useState("professional");
    // const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

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


    const handleGrammarCheck = async () => {
        if (!value) return alert("Document is empty!");

        setIsCheckingGrammar(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URI}/api/v1/ai/grammar-check`,
                { text: value }
            );

            if (!response.data || !response.data.data) {
                alert("No changes suggested.");
                return;
            }
            const cleanedResponse = response.data.data.replace(/```json|```/g, "").trim();

            const result = JSON.parse(cleanedResponse);
            const previousText = result["previous-text"];
            const correctedText = result["new-text"];

            if (previousText === correctedText) {
                alert("No grammar mistakes found.");
                return;
            }

            const applyChanges = window.confirm(
                "Grammar suggestions found. Do you want to apply the changes?"
            );

            if (applyChanges) {
                setValue(correctedText);
                alert("Grammar corrections applied!");
            }
        } catch (error) {
            console.error("Error checking grammar:", error);
            alert("Failed to check grammar.");
        } finally {
            setIsCheckingGrammar(false);
        }
    };

    const handleRewrite = async () => {
        if (!value) return alert("Document is empty!");

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/v1/ai/rewrite`, {
                text: value,
                tone: tone,
            });

            if (response.data && response.data.data) {
                const cleanedResponse = response.data.data.replace(/```json|```/g, "").trim();
                const result = JSON.parse(cleanedResponse);
                const rewrite = result["rewrite"];
                setValue(rewrite);
                alert("Text rewritten successfully!");
            } else {
                alert("No rewritten text returned.");
            }
        } catch (error) {
            console.error("Error rewriting text:", error);
            alert("Failed to rewrite text.");
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
                                className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 focus:outline-none transition duration-300 ease-in-out"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 focus:outline-none transition duration-300 ease-in-out"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setcuecardmodal(true)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none transition duration-300 ease-in-out"
                            >
                                Generate Cue Cards
                            </button>
                            <button
                                onClick={handleGrammarCheck}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:outline-none transition duration-300 ease-in-out"
                                disabled={isCheckingGrammar}
                            >
                                {isCheckingGrammar ? "Checking..." : "Check Grammar"}
                            </button>

                            <button
                                onClick={() => setShare(true)}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 focus:outline-none transition duration-300 ease-in-out"
                            >
                                Share
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <label className="text-gray-300">Select Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="bg-gray-800 text-white border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            >
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                            </select>
                            <button
                                onClick={handleRewrite}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none transition duration-300 ease-in-out"
                            >
                                Rewrite Text
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <label className="text-gray-300">Enable Auto-save</label>
                            <input
                                type="checkbox"
                                checked={autoSaveEnabled}
                                onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                                className="h-5 w-5 bg-gray-700 border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-600"
                            />
                        </div>

                        {/* <div className="mt-4 p-4 bg-gray-800 rounded-md">
                            <h3 className="text-lg font-semibold">Users in this document:</h3>
                            <ul className="list-disc list-inside">
                                {connectedUsers.length > 0 ? (
                                    connectedUsers.map((u, index) => <li key={index}>{u}</li>)
                                ) : (
                                    <li>No active users</li>
                                )}
                            </ul>
                        </div> */}



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