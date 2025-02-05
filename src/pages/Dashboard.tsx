import React from "react";
import Header from "../components/Header";
import AITextEditor from "../components/AITextEditor";
import Chat from "../components/Chat";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");
  }, []);
  return (
    <div>
      <Header />
      <main className="p-24 lg:flex">
        <div className="w-2/3 m-4"><AITextEditor /></div>
        
        <div><Chat /></div>
      </main>
    </div>
  );
}
