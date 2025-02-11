import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import QuillEditor from "../components/QuillEditor";


export default function Dashboard() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const user = localStorage.getItem("user")

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  });

  
  return (
    <div>
      <Header />
      <main className="p-8 lg:flex">
        <QuillEditor />
      </main>
    </div>
  );
}