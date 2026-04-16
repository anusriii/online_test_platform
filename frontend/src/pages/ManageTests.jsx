import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';

const ManageTests = () => {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', duration: '', questions: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, questionsRes] = await Promise.all([
          API.get('/tests'),
          API.get('/questions')
        ]);
        setTests(testsRes.data);
        setQuestions(questionsRes.data);
      } catch (error) {
        toast.error('Failed to load data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleQuestionToggle = (id) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.includes(id)
        ? prev.questions.filter((q) => q !== id)
        : [...prev.questions, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.questions.length === 0) return toast.error('Please select at least one question');
    try {
      const { data } = await API.post('/tests', form);
      setTests([...tests, data]);
      setForm({ title: '', description: '', duration: '', questions: [] });
      toast.success('Test created successfully!');
    } catch (error) {
      toast.error('Failed to create test');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tests/${id}`);
      setTests(tests.filter((t) => t._id !== id));
      toast.success('Test deleted!');
    } catch (error) {
      toast.error('Failed to delete test');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-wrapper">
      <h2>Manage Tests</h2>
      <div className="manage-layout">
        <div className="manage-form">
          <h3>Create New Test</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input name="description" value={form.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Select Questions ({form.questions.length} selected)</label>
              <div className="question-checklist">
                {questions.length === 0 ? (
                  <p style={{ padding: '8px', color: '#888', fontSize: '0.85rem' }}>
                    No questions yet. Add questions first.
                  </p>
                ) : (
                  questions.map((q) => (
                    <label key={q._id} className="check-item">
                      <input
                        type="checkbox"
                        checked={form.questions.includes(q._id)}
                        onChange={() => handleQuestionToggle(q._id)}
                      />
                      {q.questionText}
                    </label>
                  ))
                )}
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Test</button>
          </form>
        </div>
        <div className="manage-list">
          <h3>All Tests ({tests.length})</h3>
          {tests.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No tests created yet.</p>
          ) : (
            tests.map((test) => (
              <div key={test._id} className="list-item">
                <div>
                  <strong>{test.title}</strong>
                  <span style={{ color: '#888', fontSize: '0.85rem' }}> — {test.duration} mins — {test.questions.length} Qs</span>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(test._id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTests;