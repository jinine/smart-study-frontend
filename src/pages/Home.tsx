import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-blue-900 text-white text-center py-32 flex-1 flex flex-col justify-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Organize Your Notes, Supercharge Your Study
        </h2>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Leverage AI to make your studying more efficient, with personalized
          study tools and automatic note organization.
        </p>
        <button className="bg-blue-500 text-white py-3 px-6 rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-all">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                AI-Powered Organization
              </h3>
              <p>
                Automatically categorize and organize your notes with AI, saving
                you time and effort.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Custom Study Plans</h3>
              <p>
                Create personalized study plans based on your goals and
                preferences, guided by AI insights.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Interactive Flashcards
              </h3>
              <p>
                Transform your notes into interactive flashcards for better
                memorization and active recall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-blue-500">About</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Our Smart Study Assistant is designed to make studying easier and
            more efficient by organizing your notes, creating customized study
            plans, and providing interactive tools to help you retain
            information better.
          </p>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-full font-semibold shadow-lg hover:bg-blue-500 transition-all">
            Learn More
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>&copy; 2024 Smart Study Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}
