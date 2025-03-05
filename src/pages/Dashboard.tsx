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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-cards`);
        setCueCards(response.data);
      } catch (error) {
        console.error("Error fetching cue cards:", error);
      }
    };

    fetchCueCards();
  }, []);

  const handleCreateDocument = async () => {
    try {
      const newDocument = {
        access_type: "restricted",
        users: user,
        content: "new document",
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/v1/documents/create_document`, newDocument);

      if (response.status === 201) {
        // setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  return (
    <div>
      <Header />
      <main className="p-8">
        <div className="w-full">
          <button
            onClick={handleCreateDocument}
            className="w-40 h-40 bg-blue-300 text-white flex justify-center items-center rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            <span className="text-4xl">+</span>
          </button>
          <DocumentList />
        </div>

        {/* Cue Cards Section */}
        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-4">Browse Cue Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cueCards.length > 0 ? (
              cueCards.map((card) => (
                <Link
                  to={`/cue-card/${card.id}`}
                  key={card.id}
                  className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2">{card.question}</h3>
                  {/* <p className="text-gray-600">{card.answer}</p> */}
                </Link>
              ))
            ) : (
              <p>No cue cards available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
