import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';

const ManageQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await API.get('/questions');
        setQuestions(data);
      } catch (error) {
        toast.error('Failed to load questions');
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.options.some(o => o.trim() === '')) return toast.error('Please fill all options');
    try {
      if (editingId) {
        const { data } = await API.put(`/questions/${editingId}`, form);
        setQuestions(questions.map(q => q._id === editingId ? data : q));
        setEditingId(null);
        toast.success('Question updated successfully!');
      } else {
        const { data } = await API.post('/questions', form);
        setQuestions([...questions, data]);
        toast.success('Question added successfully!');
      }
      setForm({ questionText: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 });
    } catch (error) {
      toast.error(editingId ? 'Failed to update question' : 'Failed to add question');
    }
  };

  const handleEdit = (q) => {
    setForm({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks
    });
    setEditingId(q._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setForm({ questionText: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/questions/${id}`);
      setQuestions(questions.filter((q) => q._id !== id));
      toast.success('Question deleted!');
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="dashboard-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Manage Questions</h2>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/admin/tests')}
          style={{ background: '#28a745', borderColor: '#28a745' }}
        >
          Done (Go to Create Test)
        </button>
      </div>
      <div className="manage-layout">
        <div className="manage-form">
          <h3>{editingId ? 'Edit Question' : 'Add New Question'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Question Text</label>
              <textarea
                value={form.questionText}
                onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                required
              />
            </div>
            {form.options.map((opt, i) => (
              <div className="form-group" key={i}>
                <label>Option {String.fromCharCode(65 + i)}</label>
                <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} required />
              </div>
            ))}
            <div className="form-group">
              <label>Correct Answer</label>
              <select
                value={form.correctAnswer}
                onChange={(e) => setForm({ ...form, correctAnswer: Number(e.target.value) })}
              >
                {form.options.map((opt, i) => (
                  <option key={i} value={i}>
                    {String.fromCharCode(65 + i)} — {opt || `Option ${String.fromCharCode(65 + i)}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Marks</label>
              <input
                type="number"
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
                min="1"
              />
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Question' : 'Add Question'}
              </button>
              {editingId && (
                <button type="button" className="btn-danger" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
              {!editingId && (
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => navigate('/admin/tests')}
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                  Done Adding
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="manage-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>All Questions ({questions.length})</h3>
            <div className="search-box" style={{ width: '250px', marginBottom: 0 }}>
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px 12px 8px 35px', fontSize: '0.85rem' }}
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {filteredQuestions.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
              {searchTerm ? 'No questions match your search.' : 'No questions added yet.'}
            </p>
          ) : (
            <div className="questions-scroll" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
              {filteredQuestions.map((q, i) => (
                <div key={q._id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '100%', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '0.85rem' }}>QUESTION {i + 1}</span>
                      <span style={{ fontWeight: '600', color: '#64748b', fontSize: '0.8rem' }}>{q.marks} Marks</span>
                    </div>
                    <p style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.95rem', lineHeight: '1.5' }}>{q.questionText}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>
                      Correct: {String.fromCharCode(65 + q.correctAnswer)}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => handleEdit(q)}>Edit</button>
                      <button className="btn-danger" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => handleDelete(q._id)}>Delete</button>
                    </div>
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

export default ManageQuestions;