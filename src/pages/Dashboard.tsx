import Header from "../components/Header";
// import AITextEditor from "../components/AITextEditor";
// import Chat from "../components/Chat";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DocumentList from "../components/DocumentList";
import axios from "axios";


export default function Dashboard() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const user = localStorage.getItem("user")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  });

  const handleCreateDocument = async () => {
    try {
      const newDocument = {
        access_type: "restricted",
        users: user,
        content: "new document",
      };
  
      const response = await axios.post("http://localhost:8991/api/v1/documents/create_document", newDocument);
      
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
      <main className="p-8 lg:flex">
        <div className="w-full">
            <button onClick={handleCreateDocument} className="w-40 h-40 bg-blue-300 text-white flex justify-center items-center rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
              <span className="text-4xl">+</span>
            </button>
          <DocumentList />
        </div>
      </main>
    </div>
  );
}
