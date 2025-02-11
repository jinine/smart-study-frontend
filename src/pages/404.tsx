export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="mt-2 text-lg text-gray-600">Page Not Found</p>
            <a
                href="/"
                className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
                Go Home
            </a>
        </div>
    );
}
