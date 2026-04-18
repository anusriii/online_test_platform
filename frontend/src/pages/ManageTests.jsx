import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';

const ManageTests = () => {
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', duration: '', questions: [] });
  const [editingId, setEditingId] = useState(null);
  const [qSearch, setQSearch] = useState('');
  const navigate = useNavigate();

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

  const selectAllQuestions = () => {
    setForm(prev => ({ ...prev, questions: questions.map(q => q._id) }));
  };

  const clearQuestions = () => {
    setForm(prev => ({ ...prev, questions: [] }));
  };

  const filteredQuestionsList = questions.filter(q => 
    q.questionText.toLowerCase().includes(qSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.questions.length === 0) return toast.error('Please select at least one question');
    try {
      if (editingId) {
        const { data } = await API.put(`/tests/${editingId}`, form);
        setTests(tests.map(t => t._id === editingId ? data : t));
        setEditingId(null);
        toast.success('Test updated successfully!');
      } else {
        const { data } = await API.post('/tests', form);
        setTests([...tests, data]);
        toast.success('Test created successfully!');
      }
      setForm({ title: '', description: '', duration: '', questions: [] });
    } catch (error) {
      toast.error(editingId ? 'Failed to update test' : 'Failed to create test');
    }
  };

  const handleEdit = (test) => {
    setForm({
      title: test.title,
      description: test.description,
      duration: test.duration,
      questions: test.questions.map(q => typeof q === 'object' ? q._id : q)
    });
    setEditingId(test._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setForm({ title: '', description: '', duration: '', questions: [] });
    setEditingId(null);
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
          <h3>{editingId ? 'Edit Test' : 'Create New Test'}</h3>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Select Questions ({form.questions.length} selected)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={selectAllQuestions}>Select All</button>
                  <button type="button" className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={clearQuestions}>Clear</button>
                </div>
              </div>
              <div className="q-search-box" style={{ marginBottom: '8px', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Filter questions..." 
                  value={qSearch} 
                  onChange={(e) => setQSearch(e.target.value)}
                  style={{ padding: '8px 12px 8px 35px', fontSize: '0.85rem' }}
                />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="question-checklist">
                {questions.length === 0 ? (
                  <p style={{ padding: '8px', color: '#888', fontSize: '0.85rem' }}>
                    No questions yet. <span style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/admin/questions')}>Add questions first</span>.
                  </p>
                ) : filteredQuestionsList.length === 0 ? (
                  <p style={{ padding: '8px', color: '#888', fontSize: '0.85rem' }}>
                    No matching questions found.
                  </p>
                ) : (
                  filteredQuestionsList.map((q) => (
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
            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Test' : 'Create Test'}
              </button>
              {editingId && (
                <button type="button" className="btn-danger" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="manage-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>All Tests ({tests.length})</h3>
          </div>
          
          {tests.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No tests created yet.</p>
          ) : (
            <div className="tests-scroll" style={{ maxHeight: '700px', overflowY: 'auto', paddingRight: '10px' }}>
              {tests.map((test) => (
                <div key={test._id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '100%', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>{test.title}</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge duration" style={{ fontSize: '0.7rem' }}>{test.duration}m</span>
                        <span className="badge questions" style={{ fontSize: '0.7rem' }}>{test.questions.length} Qs</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineUint: '1.4' }}>{test.description || 'No description'}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => handleEdit(test)}>Edit</button>
                    <button className="btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => handleDelete(test._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTests;