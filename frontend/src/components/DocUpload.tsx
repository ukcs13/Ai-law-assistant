import React, { useState } from 'react';
import api from '../api';
import { Upload, FileText, AlertCircle } from 'lucide-react';

const DocUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const res = await api.post('/analyze-doc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
    } catch (error) {
      console.error(error);
      alert('Error analyzing document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-upload-container">
      <h2>Document Analysis</h2>
      <div className="upload-box">
        <input type="file" accept=".pdf" onChange={handleFileChange} id="file-upload" hidden />
        <label htmlFor="file-upload" className="upload-label">
          <Upload size={40} />
          <span>{file ? file.name : "Click to upload PDF Contract/Legal Doc"}</span>
        </label>
        <button onClick={handleUpload} disabled={!file || loading} className="analyze-btn">
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          <div className="result-section">
            <h3><FileText size={18} /> Summary</h3>
            <p>{analysis.summary}</p>
          </div>
          
          <div className="result-section risks">
            <h3><AlertCircle size={18} /> Potential Risks</h3>
            <ul>
              {analysis.risks.map((risk: string, i: number) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>

          <div className="result-section preview">
             <h3>Text Preview</h3>
             <p className="text-muted">{analysis.text_preview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocUpload;
