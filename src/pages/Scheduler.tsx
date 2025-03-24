import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { motion } from "framer-motion";

interface StudySession {
    id: number;
    subject: string;
    date: string;
    time: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const user = localStorage.getItem("user");
    const [sessions, setSessions] = useState<StudySession[]>([]);
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
    }, [navigate]);

    const addSession = () => {
        if (!subject || !date || !time) return;
        const newSession: StudySession = {
            id: Date.now(),
            subject,
            date,
            time,
        };
        setSessions([...sessions, newSession]);
        setSubject("");
        setDate("");
        setTime("");
    };

    const deleteSession = (id: number) => {
        setSessions(sessions.filter((session) => session.id !== id));
    };

    return (
    <main>
        <Header />
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">

            <h1 className="text-3xl font-bold mb-6">Study Scheduler</h1>
            <div className="flex gap-4 mb-6">
                <input
                    className="p-2 bg-gray-800 text-white rounded-md"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <input
                    className="p-2 bg-gray-800 text-white rounded-md"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input
                    className="p-2 bg-gray-800 text-white rounded-md"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
                <button
                    onClick={addSession}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                    Add
                </button>
            </div>
            <div className="w-full max-w-md space-y-4">
                {sessions.map((session) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gray-800 p-4 flex justify-between items-center rounded-md"
                    >
                        <div>
                            <p className="text-lg font-semibold">{session.subject}</p>
                            <p className="text-sm text-gray-400">{session.date} at {session.time}</p>
                        </div>
                        <button
                            onClick={() => deleteSession(session.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        >
                            Delete
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
        </main>
    );
}