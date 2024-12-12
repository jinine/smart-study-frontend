import React from "react";
import Header from "../components/Header";
import AITextEditor from "../components/AITextEditor";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <main className="p-24">
        <AITextEditor />
      </main>
    </div>
  );
}
