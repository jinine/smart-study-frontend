import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Rocket24Regular, Lightbulb24Regular, BookOpen24Regular } from "@fluentui/react-icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="text-center py-24 px-6 flex-1 flex flex-col justify-center">
        <h2 className="text-5xl font-extrabold mb-4 text-white">
          Organize Your Notes, Supercharge Your Study
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
          Leverage AI to streamline your studying with personalized tools and smart note organization.
        </p>
        <Link
          to="/signup"
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-white">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Lightbulb24Regular className="text-blue-600 w-10 h-10" />}
              title="AI-Powered Organization"
              description="Automatically categorize and organize your notes with AI, saving you time and effort."
            />
            <FeatureCard
              icon={<Rocket24Regular className="text-blue-600 w-10 h-10" />}
              title="Custom Study Plans"
              description="Create personalized study plans based on your goals and preferences, guided by AI insights."
            />
            <FeatureCard
              icon={<BookOpen24Regular className="text-blue-600 w-10 h-10" />}
              title="Interactive Flashcards"
              description="Transform your notes into interactive flashcards for better memorization and active recall."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-600">About</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
            Our Smart Study Assistant is designed to make studying easier by organizing your notes, creating customized study plans, and providing interactive tools to improve retention.
          </p>
          <Link
            to="/about"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4">
        <p>&copy; 2024 Smart Study Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: JSX.Element; title: string; description: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
