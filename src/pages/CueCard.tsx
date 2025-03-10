import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import to get URL params
import axios from "axios";
import Header from "../components/Header";

interface CueCard {
  id: number;
  question: string;
  answer: string;
}

const CueCard = () => {
  const { group_uuid } = useParams<{ group_uuid: string }>(); // Get group_uuid from URL
  const [cueCards, setCueCards] = useState<CueCard[] | any>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!group_uuid) return;

    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/api/v1/cue-cards-by-group/${group_uuid}`)
      .then((response) => {
        setCueCards(response.data);
        // Check if user exists in cue card group
        if (response.data[0] && !response.data[0].users.includes(user)) {
          navigate('/dashboard');
        }
      })
      .catch((error) => console.error("Error fetching cue cards:", error));
  }, [group_uuid]);

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < cueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true); // Mark as completed when all cards are done
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

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setIsCompleted(false);
  };

  if (cueCards.length === 0) {
    return <p>Loading cue cards...</p>;
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center p-6">
        <Header />
        <h2 className="text-2xl font-bold mb-4">Test Completed 🎉</h2>
        <p className="text-lg">Great job! Here are your results:</p>
        <p className="mt-4 text-green-500 text-lg">✅ Correct: {score.correct}</p>
        <p className="mt-2 text-red-500 text-lg">❌ Incorrect: {score.incorrect}</p>
        <p className="mt-4 text-xl font-semibold">
          Final Score: {((score.correct / cueCards.length) * 100).toFixed(1)}%
        </p>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={handleRestart}
        >
          Restart Quiz 🔄
        </button>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate('/dashboard')}
        >
          Return Home 🏠
        </button>
      </div>
    );
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            onClick={handleMarkCorrect}
          >
            Correct ✅
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={handleMarkIncorrect}
          >
            Incorrect ❌
          </button>
        </div>

        <p className="mt-4 text-lg">
          Progress: {currentIndex + 1}/{cueCards.length}
        </p>
      </div>
    </div>
  );
};

export default CueCard;
