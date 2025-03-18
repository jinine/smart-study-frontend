import { useState, useEffect } from 'react';
import axios from 'axios';

const Share = ({ documentUuid }: { documentUuid: any }) => {
    const [accessType, setAccessType] = useState('public');
    const [users, setUsers] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchDocumentData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URI}/api/v1/document/${documentUuid}`
                );
                const document = response.data.document;
                setAccessType(document.access_type);
                const cleansedUsers = document.users.replace(/[{}"]/g, "").split(",").map((user: any) => user.trim());
                setUsers(cleansedUsers.join(', '));
            } catch (err) {
                setError('Failed to fetch document data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentData();
    }, [documentUuid]);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URI}/api/v1/documents/update_document/${documentUuid}`,
                {
                    access_type: accessType,
                    users: users,
                }
            );

            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (err) {
            setError('Failed to update document. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsers(e.target.value);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">Share Document</h2>

            {success && <p className="text-green-400 mb-4">Document updated successfully!</p>}
            {error && <p className="text-red-400 mb-4">{error}</p>}

            <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Access Type:</label>
                <div className="flex space-x-6">
                    <label className="inline-flex items-center text-gray-300">
                        <input
                            type="radio"
                            value="public"
                            checked={accessType === 'public'}
                            onChange={(e) => setAccessType(e.target.value)}
                            className="form-radio text-blue-500"
                        />
                        <span className="ml-2">Public</span>
                    </label>
                    <label className="inline-flex items-center text-gray-300">
                        <input
                            type="radio"
                            value="restricted"
                            checked={accessType === 'restricted'}
                            onChange={(e) => setAccessType(e.target.value)}
                            className="form-radio text-blue-500"
                        />
                        <span className="ml-2">Restricted</span>
                    </label>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Users with Access:</label>
                <ul className="list-disc pl-6">
                    {users ? (
                        users.split(',').map((user, index) => (
                            <li key={index} className="text-gray-200">{user.trim()}</li>
                        ))
                    ) : (
                        <li className="text-gray-500">No users have access to this document.</li>
                    )}
                </ul>
            </div>

            <div className="mb-6">
                <label className="block text-gray-300 font-medium mb-2">Add Users (comma separated):</label>
                <input
                    type="text"
                    value={users}
                    onChange={handleUserChange}
                    placeholder="Enter users (comma separated)"
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 px-4 text-white font-semibold rounded-lg focus:outline-none ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {loading ? 'Updating...' : 'Update Document'}
            </button>
        </div>
    );
};

export default Share;
