import React, { useState } from 'react';
import api from '../api';
import { Search, Book } from 'lucide-react';

interface LawSection {
  _id: string;
  act: string;
  section_number: string;
  title: string;
  description: string;
}

const LawSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LawSection[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/laws/search?query=${query}`);
      setResults(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="law-search-container">
      <h2>Search Indian Laws</h2>
      <div className="search-bar">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Theft, Murder, Section 378..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          <Search size={20} />
        </button>
      </div>

      <div className="results-area">
        {loading ? <p>Searching...</p> : (
          results.map((law) => (
            <div key={law._id} className="law-card">
              <div className="law-header">
                <Book size={16} />
                <span className="law-act">{law.act} Section {law.section_number}</span>
              </div>
              <h3>{law.title}</h3>
              <p>{law.description}</p>
            </div>
          ))
        )}
        {results.length === 0 && !loading && query && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default LawSearch;
