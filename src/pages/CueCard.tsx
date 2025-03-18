import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

interface CueCard {
  id: number;
  question: string;
  answer: string;
}

const CueCard = () => {
  const { group_uuid } = useParams<{ group_uuid: string }>();
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
      setIsCompleted(true);
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
    return <p className="text-white">Loading cue cards...</p>;
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-800">
      <Header />
      <div className="flex flex-col items-center p-6 text-white">
        
        <h2 className="text-3xl font-bold mb-4">Test Completed 🎉</h2>
        <p className="text-lg mb-4">Great job! Here are your results:</p>
        <p className="mt-4 text-green-400 text-lg">✅ Correct: {score.correct}</p>
        <p className="mt-2 text-red-500 text-lg">❌ Incorrect: {score.incorrect}</p>
        <p className="mt-4 text-xl font-semibold">
          Final Score: {((score.correct / cueCards.length) * 100).toFixed(1)}%
        </p>
        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={handleRestart}
        >
          Restart Quiz 🔄
        </button>
        <button
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/dashboard')}
        >
          Return Home 🏠
        </button>
      </div></div>
    );
  }

  const currentCard = cueCards[currentIndex];

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header />
      <div className="flex flex-col items-center p-6 text-white">
        <h2 className="text-3xl font-bold mb-4">Cue Card Self-Test</h2>
        <div className="bg-gray-800 shadow-lg p-6 rounded-lg w-96 text-center">
          <p className="text-lg font-semibold mb-4">
            {showAnswer ? currentCard.answer : currentCard.question}
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={handleMarkCorrect}
          >
            Correct ✅
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={handleMarkIncorrect}
          >
            Incorrect ❌
          </button>
        </div>

        <p className="mt-4 text-lg">Progress: {currentIndex + 1}/{cueCards.length}</p>
      </div>
    </div>
  );
};

export default CueCard;
