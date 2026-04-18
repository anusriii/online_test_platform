import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, results: [], tests: 0, questions: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, resultsRes, testsRes, questionsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/results'),
          API.get('/tests'),
          API.get('/questions')
        ]);
        setStats({ 
          users: usersRes.data.length, 
          results: resultsRes.data,
          tests: testsRes.data.length,
          questions: questionsRes.data.length
        });
      } catch (error) {
        toast.error('Failed to load admin data');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Admin Command Center 🛡️</h1>
          <p>Monitor student performance, manage assessments, and keep the platform running smoothly.</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Total Students</p>
        </div>
        <div className="stat-card">
          <h3>{stats.tests}</h3>
          <p>Total Tests</p>
        </div>
        <div className="stat-card">
          <h3>{stats.questions}</h3>
          <p>Total Questions</p>
        </div>
        <div className="stat-card">
          <h3>{stats.results.length}</h3>
          <p>Total Submissions</p>
        </div>
      </div>

      <div className="dashboard-controls">
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/admin/questions')}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Manage Questions
          </button>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }} onClick={() => navigate('/admin/tests')}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Manage Tests
          </button>
        </div>
      </div>
      <div className="results-table-wrapper">
        <h3 style={{ marginBottom: '1rem' }}>Recent Submissions</h3>
        {stats.results.length === 0 ? (
          <p style={{ color: '#888' }}>No submissions yet.</p>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Test</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.results.map((r) => (
                <tr key={r._id}>
                  <td>{r.student?.name || <span style={{ color: '#888' }}>Unknown User</span>}</td>
                  <td>{r.test?.title || 'N/A'}</td>
                  <td>{r.scoredMarks}/{r.totalMarks}</td>
                  <td>{r.percentage}%</td>
                  <td className={r.passed ? 'pass' : 'fail'}>{r.passed ? 'Pass' : 'Fail'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;