import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import DocumentList from "../components/DocumentList";
import axios from "axios";

// Cue Card Type for TypeScript
interface CueCard {
  id: number;
  question: string;
  answer: string;
  title: string;
  group_uuid: string;
}

export default function Dashboard() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const [cueCards, setCueCards] = useState<CueCard[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Fetch cue cards from the backend
  useEffect(() => {
    const fetchCueCards = async () => {
      try {
        if (!user) return;
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/api/v1/get-cue-cards`,
          { users: Array.isArray(user) ? user : [user] }
        );
        setCueCards(response.data);
      } catch (error) {
        console.error("Error fetching cue cards:", error);
      }
    };

    fetchCueCards();
  }, [user]);

  const handleCreateDocument = async () => {
    try {
      const newDocument = {
        access_type: "restricted",
        users: user,
        content: "new document",
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/api/v1/documents/create_document`,
        newDocument
      );

      if (response.status === 201 && response.data.document[0].uuid) {
        navigate(`/document/${response.data.document[0].uuid}`);
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />
      <main className="p-8">
        <div className="flex justify-center">
          <button
            onClick={handleCreateDocument}
            id="new-document"
            className="w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 text-white flex justify-center items-center rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <span className="text-5xl font-bold">+</span>
            <span className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
          </button>
        </div>

        <DocumentList />

        {/* Cue Cards Section */}
        <div className="w-full mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4">Browse Cue Cards</h2>
            <button id="manage-cue-cards" className="text-sm text-blue-400 hover:underline" onClick={()=>navigate('/cue-card')}>Manage Cue Cards</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cueCards.length > 0 ? (
              cueCards.map((card) => (
                <Link
                  to={`/cue-card/${card.group_uuid}`}
                  key={card.id}
                  className="bg-gray-800 p-6 shadow-lg rounded-lg hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  {/* <p className="text-gray-400">{card.answer}</p> */}
                </Link>
              ))
            ) : (
              <p className="text-gray-400">No cue cards available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
