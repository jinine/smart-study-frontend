// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Document from './pages/Document';
import NotFound from './pages/404';
import CueCard from './pages/CueCard';
import ManageCueCards from './pages/ManageCueCards';
import Scheduler from './pages/Scheduler';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/document/:uuid' element={<Document />} />
        <Route path='/cue-card/:group_uuid' element={<CueCard />} />
        <Route path='/cue-card' element={<ManageCueCards />} />
        <Route path='/schedule' element={<Scheduler />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
