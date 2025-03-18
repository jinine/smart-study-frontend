import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

interface CueCard {
    id: number;
    title: string;
    question: string;
    answer: string;
    access_type: string;
    users: string;
    group_uuid: string;
}

interface Group {
    id: number;
    name: string;
    uuid: string;
}

const ManageCueCards = () => {
    const { group_uuid } = useParams<{ group_uuid: string }>();
    const [cueCards, setCueCards] = useState<CueCard[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const user = localStorage.getItem("user");
    const [newCueCard, setNewCueCard] = useState({
        title: '',
        question: '',
        answer: '',
        access_type: 'public',
        users: user,
        group_uuid: group_uuid || '',
    });
    const [loading, setLoading] = useState(false);
    const [editingCueCard, setEditingCueCard] = useState<CueCard | null>(null);

    useEffect(() => {
        fetchCueCards();
        fetchGroups();
    }, [user]);

    const fetchCueCards = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-cards-by-user/${user}`,
                { user: user }
            );
            setCueCards(response.data);
        } catch (error) {
            console.error('Error fetching cue cards', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-card-groups/${user}`,
                { user: user }
            );
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGroup: any = groups.find((group: any) => group.group_uuid === event.target.value);
        if (selectedGroup) {
            setNewCueCard((prev: any) => ({
                ...prev,
                group_uuid: selectedGroup.group_uuid,
                title: selectedGroup.title,
            }));
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editingCueCard) {
            setEditingCueCard({
                ...editingCueCard,
                [e.target.name]: e.target.value,
            });
        } else {
            setNewCueCard({
                ...newCueCard,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleCreateCueCard = async () => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-cards`, newCueCard);
            fetchCueCards();
            setNewCueCard({
                title: '',
                question: '',
                answer: '',
                access_type: 'public',
                users: user,
                group_uuid: group_uuid || '',
            });
        } catch (error) {
            console.error('Error creating cue card', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditCueCard = async () => {
        if (!editingCueCard) return;
        setLoading(true);
        try {
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-cards/${editingCueCard.id}`,
                editingCueCard
            );
            fetchCueCards();
            setEditingCueCard(null);
        } catch (error) {
            console.error('Error updating cue card', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCueCard = async (id: number) => {
        setLoading(true);
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-cards/${id}`);
            fetchCueCards();
        } catch (error) {
            console.error('Error deleting cue card', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Header />
            <h1 className="text-3xl font-bold text-center mb-8">Manage Your Cue Cards</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Add New Cue Card Section */}
                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">New Cue Card</h3>

                    {/* Group Selection */}
                    <select
                        id="group"
                        name="group"
                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-md text-sm mb-2"
                        onChange={handleGroupChange}
                        value={newCueCard.group_uuid}
                    >
                        <option value="" disabled>Select a group</option>
                        {groups.map((group: any) => (
                            <option key={group.group_uuid} value={group.group_uuid}>
                                {group.title}
                            </option>
                        ))}
                    </select>

                    {/* Question */}
                    <textarea
                        id="question"
                        name="question"
                        value={newCueCard.question}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-md text-sm mb-2"
                        placeholder="Question"
                        rows={2}
                    />

                    {/* Answer */}
                    <textarea
                        id="answer"
                        name="answer"
                        value={newCueCard.answer}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-md text-sm mb-2"
                        placeholder="Answer"
                        rows={2}
                    />

                    {/* Access Type & Submit Button */}
                    <div className="flex justify-between items-center">
                        <select
                            id="access_type"
                            name="access_type"
                            value={newCueCard.access_type}
                            onChange={() => handleInputChange}
                            className="p-2 bg-gray-700 text-gray-200 rounded-md text-sm"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>

                        <button
                            onClick={handleCreateCueCard}
                            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                        >
                            Add
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="text-center text-lg">Loading...</div>
                ) : (
                    cueCards.map((cueCard) => (
                        <div key={cueCard.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            {editingCueCard?.id === cueCard.id ? (
                                <>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editingCueCard.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-md text-sm mb-2"
                                    />
                                    <textarea
                                        name="question"
                                        value={editingCueCard.question}
                                        onChange={handleInputChange}
                                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-md text-sm mb-2"
                                    />
                                    <textarea
                                        name="answer"
                                        value={editingCueCard.answer}
                                        onChange={handleInputChange}
                                        className="w-full p-2 bg-gray-700 text-gray-200 rounded-md text-sm mb-2"
                                    />
                                    <button
                                        onClick={handleEditCueCard}
                                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold text-gray-200 mb-4">{cueCard.title}</h3>
                                    <p className="text-gray-400 mb-4">Question: {cueCard.question}</p>
                                    <p className="text-gray-400 mb-4">Answer: {cueCard.answer}</p>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setEditingCueCard(cueCard)}
                                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCueCard(cueCard.id)}
                                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageCueCards;
