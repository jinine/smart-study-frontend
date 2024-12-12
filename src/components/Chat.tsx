import React, { useState, useEffect, useRef } from 'react';

interface Message {
  user: string;
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [username, setUsername] = useState<string>('Anonymous');
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket('ws://localhost:10000');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to server');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    socket.onclose = () => {
      console.log('Disconnected from server');
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (socketRef.current && input.trim()) {
      const message = { user: username, text: input.trim() };
      socketRef.current.send(JSON.stringify(message)); // Send message to server
      setMessages([...messages, message]);
      setInput('');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 border border-gray-300 rounded-lg shadow-lg">
      <div className="mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
          placeholder="Enter your name"
        />
      </div>
      
      <div className="space-y-4 h-72 overflow-auto border-b-2 border-gray-300 mb-4 p-2">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-2">
            <span className="font-bold">{msg.user}:</span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full"
          placeholder="Type a message"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
