import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import QuillEditor from "../components/QuillEditor";

export default function Dashboard() {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [value, setValue] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        if (!uuid) return;

        setLoading(true);
        axios.get(`http://localhost:8991/api/v1/document/${uuid}`)
            .then((response) => {
                setDocument(response.data);
                setError("");
            })
            .catch((err) => {
                console.error("Error fetching document:", err);
                setError("Document not found.");
            })
            .finally(() => setLoading(false));
    }, [uuid]);

    useEffect(() => {
        if (document) {
            setValue(document.document.content); // Ensure document is available before setting value
        }
    }, [document]);

    return (
        <div>
            <Header />
            <main className="p-8 lg:flex">
                {loading ? (
                    <p>Loading document...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <QuillEditor value={value} setValue={setValue} />
                )}
            </main>
        </div>
    );
}
