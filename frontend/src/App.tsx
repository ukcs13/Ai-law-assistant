import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './components/Chat';
import LawSearch from './components/LawSearch';
import DocUpload from './components/DocUpload';
import { MessageSquare, Search, FileText, Scale } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo">
            <Scale size={32} />
            <h1>AI Law Assist</h1>
          </div>
          <div className="nav-links">
            <Link to="/" className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}>
              <MessageSquare size={20} /> Chat Assistant
            </Link>
            <Link to="/search" className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>
              <Search size={20} /> Law Search
            </Link>
            <Link to="/upload" className={activeTab === 'upload' ? 'active' : ''} onClick={() => setActiveTab('upload')}>
              <FileText size={20} /> Doc Analysis
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/search" element={<LawSearch />} />
            <Route path="/upload" element={<DocUpload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
