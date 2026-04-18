import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const [tests, setTests] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, resultsRes] = await Promise.all([
          API.get('/tests'),
          API.get('/results/my')
        ]);
        setTests(testsRes.data);
        setMyResults(resultsRes.data);
      } catch (error) {
        toast.error('Failed to load tests data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredTests = useMemo(() => {
    return tests.filter(test => 
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      test.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tests, searchQuery]);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome back, {userInfo?.name?.split(' ')[0] || 'Student'}! 👋</h1>
          <p>Ready to push your limits? Choose an assessment below to continue your journey.</p>
        </div>
        <div className="hero-stats">
          <div className="stat-badge">
            <span className="stat-val">{tests.length}</span>
            <span className="stat-label">Total Tests Available</span>
          </div>
        </div>
      </div>

      <div className="dashboard-controls">
        <h2>Available Assessments</h2>
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for a test..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>No tests found matching your criteria. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="tests-grid">
          {filteredTests.map((test) => (
            <div key={test._id} className="test-card">
              <div className="test-card-content">
                <h3>{test.title}</h3>
                <p>{test.description}</p>
                <div className="test-meta">
                  <span className="badge duration">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    {test.duration} mins
                  </span>
                  <span className="badge questions">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                    {test.questions.length} Qs
                  </span>
                  {(() => {
                    const attempts = myResults.filter(r => r.test && r.test._id === test._id).length;
                    return attempts > 0 ? (
                      <span className="badge attempted">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Attempted ({attempts})
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
              {(() => {
                const attempts = myResults.filter(r => r.test && r.test._id === test._id).length;
                return (
                  <button 
                    className={`btn-primary start-btn ${attempts > 0 ? 'retake-btn' : ''}`} 
                    onClick={() => navigate(`/test/${test._id}`)}
                  >
                    {attempts > 0 ? (
                      <>
                        Retake Assessment
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Start Assessment
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {myResults.length > 0 && (
        <div className="dashboard-results" style={{ marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>My Recent Submissions</h2>
          <div className="results-list" style={{ background: '#fff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {myResults.slice().reverse().map((res) => (
              <div key={res._id} className="list-item" style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: '#0f172a' }}>{res.test?.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0' }}>
                    Submitted on {new Date(res.createdAt).toLocaleDateString()} at {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: '800', color: res.passed ? '#10b981' : '#ef4444' }}>{res.percentage}%</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>{res.passed ? 'PASSED' : 'FAILED'}</span>
                  </div>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    onClick={() => navigate(`/result/${res._id}`)}
                  >
                    Review Exam
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;