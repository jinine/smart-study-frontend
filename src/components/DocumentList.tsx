import React, { useEffect, useState } from "react";
import axios from "axios";
import { LockClosed20Regular, Globe20Regular, DocumentText20Regular } from "@fluentui/react-icons";
import { Link } from "react-router-dom";

interface Document {
  uuid: string;
  modified_date: string;
  access_type: "public" | "restricted";
  users: string;
  content: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentListType, setDocumentListType] = useState("personal");
  const user = localStorage.getItem("user");
  const backendUri = process.env.REACT_APP_BACKEND_URI;

  // Fetch documents based on user and documentListType
  useEffect(() => {
    const fetchDocuments = () => {
      setLoading(true);
      setError(null);

      if (documentListType === "personal" && user) {
        axios
          .post<{ documents: Document[] }>(
            `${backendUri}/api/v1/authorized_documents`,
            { users: user }
          )
          .then((res) => {
            setDocuments(res.data.documents);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to fetch authorized documents.");
            setLoading(false);
          });
      } else if (documentListType === "public") {
        axios
          .get<{ documents: Document[] }>(`${backendUri}/api/v1/documents`)
          .then((res) => {
            setDocuments(res.data.documents);
            setLoading(false);
          })
          .catch(() => {
            setError("Failed to fetch public documents.");
            setLoading(false);
          });
      } else {
        setError("No user found.");
        setLoading(false);
      }
    };

    // Initial fetch
    fetchDocuments();

    // Set an interval to refresh documents every 30 seconds
    const intervalId = setInterval(fetchDocuments, 600000); // 30 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [documentListType, user]);

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="w-full mx-auto p-8 text-white">
      <div className="flex mb-4">
        <button
          onClick={() => setDocumentListType("personal")}
          className={`text-2xl font-semibold mb-4 ${documentListType === "personal" ? 'underline text-white' : 'text-blue-500'}`}
        >
          My Documents
        </button>
        <button
          onClick={() => setDocumentListType("public")}
          className={`text-2xl font-semibold mb-4 pl-4 ${documentListType === "public" ? 'underline text-white' : 'text-blue-500'}`}
        >
          All Documents
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Link
              to={`/document/${doc.uuid}`}
              key={doc.uuid}
              className="group flex flex-col p-4 border border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer bg-gray-900 overflow-hidden"
            >
              {/* Icon and Header */}
              <div className="flex items-center space-x-2 text-white">
                <DocumentText20Regular className="text-blue-500" />
                <h3 className="font-semibold text-white truncate w-full">{doc.uuid}</h3>
              </div>

              {/* Date */}
              <p className="text-sm text-gray-400">{new Date(doc.modified_date).toLocaleString()}</p>

              {/* Content (Prevents Overflow) */}
              <div className="mt-2 p-2 border rounded bg-gray-800 text-sm text-gray-400 w-full max-h-32 overflow-auto">
                {doc.content || "No content available"}
              </div>

              {/* Access Type */}
              <div className="mt-2 text-sm font-medium text-white">
                {doc.access_type === "public" ? (
                  <span className="flex items-center text-green-500">
                    <Globe20Regular className="mr-1" /> Public
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <LockClosed20Regular className="mr-1" /> Restricted
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="text-gray-500">No documents found.</div>
        )}
      </div>
    </div>
  );
}
