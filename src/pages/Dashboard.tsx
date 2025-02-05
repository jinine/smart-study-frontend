import Header from "../components/Header";
// import AITextEditor from "../components/AITextEditor";
// import Chat from "../components/Chat";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import QuillEditor from "../components/QuillEditor";


export default function Dashboard() {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if(!isLoggedIn){
      navigate("/")
    }
  })
  return (
    <div>
      <Header />
      <main className="p-24 lg:flex">
        <div className="w-full">
          {/* <AITextEditor /> */}
          <QuillEditor />
        </div>

        {/* <div><Chat /></div> */}
      </main>
    </div>
  );
}
