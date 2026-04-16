import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Loader from '../components/Loader';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1
  });

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
      const { data } = await API.post('/questions', form);
      setQuestions([...questions, data]);
      setForm({ questionText: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 });
      toast.success('Question added successfully!');
    } catch (error) {
      toast.error('Failed to add question');
    }
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

  if (loading) return <Loader />;

  return (
    <div className="dashboard-wrapper">
      <h2>Manage Questions</h2>
      <div className="manage-layout">
        <div className="manage-form">
          <h3>Add New Question</h3>
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
            <button type="submit" className="btn-primary">Add Question</button>
          </form>
        </div>
        <div className="manage-list">
          <h3>All Questions ({questions.length})</h3>
          {questions.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No questions added yet.</p>
          ) : (
            questions.map((q, i) => (
              <div key={q._id} className="list-item">
                <span style={{ fontSize: '0.9rem' }}>Q{i + 1}. {q.questionText}</span>
                <button className="btn-danger" onClick={() => handleDelete(q._id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageQuestions;