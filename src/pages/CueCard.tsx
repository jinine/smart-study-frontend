import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

interface CueCard {
    id: number;
    question: string;
    answer: string;
}

const CueCard = () => {
    const [cueCards, setCueCards] = useState<CueCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });

    useEffect(() => {
        // Fetch cue cards from the backend
        axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-cards`)
            .then((response) => setCueCards(response.data))
            .catch((error) => console.error("Error fetching cue cards:", error));
    }, []);

    const handleNext = () => {
        setShowAnswer(false);
        if (currentIndex < cueCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        setShowAnswer(false);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleMarkCorrect = () => {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        handleNext();
    };

    const handleMarkIncorrect = () => {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        handleNext();
    };

    if (cueCards.length === 0) {
        return <p>Loading cue cards...</p>;
    }

    const currentCard = cueCards[currentIndex];

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center p-6">
                <h2 className="text-2xl font-bold mb-4">Cue Card Self-Test</h2>
                <div className="bg-white shadow-lg p-6 rounded-lg w-96 text-center">
                    <p className="text-lg font-semibold mb-4">
                        {showAnswer ? currentCard.answer : currentCard.question}
                    </p>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => setShowAnswer(!showAnswer)}
                    >
                        {showAnswer ? "Hide Answer" : "Show Answer"}
                    </button>
                </div>

                <div className="flex space-x-4 mt-4">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        onClick={handleMarkCorrect}
                    >
                        Correct ✅
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        onClick={handleMarkIncorrect}
                    >
                        Incorrect ❌
                    </button>
                </div>

                <div className="flex justify-between w-96 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                        onClick={handleNext}
                        disabled={currentIndex === cueCards.length - 1}
                    >
                        Next
                    </button>
                </div>

                <p className="mt-4 text-lg">
                    Progress: {currentIndex + 1}/{cueCards.length}
                </p>
                <p className="mt-2 text-green-500">Correct: {score.correct}</p>
                <p className="mt-2 text-red-500">Incorrect: {score.incorrect}</p>
            </div></div>
    );
};

export default CueCard;
