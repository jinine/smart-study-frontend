import React from "react";
import Header from "../components/Header";
import TextEditor from "../components/TextEditor";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <main className="p-24">
        <TextEditor />
      </main>
    </div>
  );
}
