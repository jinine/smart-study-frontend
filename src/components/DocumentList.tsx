import React, { useEffect, useState } from "react";
import axios from "axios";
import { LockClosed20Regular, Globe20Regular, DocumentText20Regular } from "@fluentui/react-icons";

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

  useEffect(() => {
    axios
      .get<{ documents: Document[] }>("http://localhost:8991/api/v1/documents")
      .then((res) => {
        setDocuments(res.data.documents);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch documents.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">My Documents</h1>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.uuid}
              className="group flex flex-col p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer bg-white overflow-hidden"
            >
              {/* Icon and Header */}
              <div className="flex items-center space-x-2">
                <DocumentText20Regular className="text-blue-500" />
                <h3 className="font-semibold text-gray-800 truncate w-full">{doc.uuid}</h3>
              </div>

              {/* Date */}
              <p className="text-sm text-gray-500">{new Date(doc.modified_date).toLocaleString()}</p>

              {/* Content (Prevents Overflow) */}
              <div className="mt-2 p-2 border rounded bg-gray-100 text-sm text-gray-700 w-full max-h-32 overflow-auto">
                {doc.content || "No content available"}
              </div>

              {/* Access Type */}
              <div className="mt-2 text-sm font-medium">
                {doc.access_type === "public" ? (
                  <span className="flex items-center text-green-600">
                    <Globe20Regular className="mr-1" /> Public
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <LockClosed20Regular className="mr-1" /> Restricted
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No documents found.</div>
        )}
      </div>
    </div>
  );
}
