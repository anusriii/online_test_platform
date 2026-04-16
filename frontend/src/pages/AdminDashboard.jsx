import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, results: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, resultsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/admin/results')
        ]);
        setStats({ users: usersRes.data.length, results: resultsRes.data });
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
      <h2>Admin Dashboard</h2>
      <div className="admin-stats">
        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Total Students</p>
        </div>
        <div className="stat-card">
          <h3>{stats.results.length}</h3>
          <p>Total Submissions</p>
        </div>
      </div>
      <div className="admin-actions">
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/admin/questions')}>
          Manage Questions
        </button>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/admin/tests')}>
          Manage Tests
        </button>
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
                  <td>{r.student?.name}</td>
                  <td>{r.test?.title}</td>
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