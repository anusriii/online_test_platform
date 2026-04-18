import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import QuestionNav from '../components/QuestionNav';
import Loader from '../components/Loader';
import useFullscreen from '../hooks/useFullscreen';

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [violations, setViolations] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const formattedAnswers = test.questions.map((q) => ({
        question: q._id,
        selectedOption: answers[q._id] !== undefined ? answers[q._id] : null
      }));
      const { data } = await API.post('/results/submit', { testId: id, answers: formattedAnswers });
      toast.success('Test submitted successfully!');
      navigate(`/result/${data._id}`);
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      setSubmitting(false);
    }
  }, [submitting, test, answers, id, navigate]);

  const handleViolation = useCallback((message) => {
    setViolations((prev) => {
      const newCount = prev + 1;
      toast.warn(`${message} Warning ${newCount}/3`);
      if (newCount >= 3) handleSubmit();
      return newCount;
    });
  }, [handleSubmit]);

  useFullscreen(hasStarted, handleViolation);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await API.get(`/tests/${id}`);
        setTest(data);
      } catch (error) {
        toast.error('Failed to load test');
      }
      setLoading(false);
    };
    fetchTest();
  }, [id]);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  if (loading) return <Loader />;
  if (!test) return <div className="dashboard-wrapper"><p>Test not found.</p></div>;

  const question = test.questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  if (!hasStarted) {
    return (
      <div className="dashboard-wrapper">
        <div style={{ maxWidth: '600px', margin: '40px auto', background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text)' }}>{test.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{test.description || 'Welcome to the assessment.'}</p>
          
          <div style={{ background: 'rgba(255, 60, 60, 0.1)', borderLeft: '4px solid #ff4d4d', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
            <h4 style={{ color: '#ff4d4d', marginTop: 0 }}>Professional Exam Environment Rules</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text)' }}>
              <li>This test will open in <strong>Full Screen Mode</strong>.</li>
              <li>Exiting Full Screen or switching tabs will result in a warning.</li>
              <li>After 3 warnings, your test will be automatically submitted.</li>
              <li>Keyboard shortcuts like copy/pasting are disabled.</li>
              <li>Time duration: <strong>{test.duration} minutes</strong>.</li>
            </ul>
          </div>
          
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}
            onClick={() => setHasStarted(true)}
          >
            Start Test Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-wrapper">
      <div className="test-header">
        <h2>{test.title}</h2>
        <div className="test-header-right">
          <span className="answered-count">{answeredCount}/{test.questions.length} answered</span>
          <Timer duration={test.duration} onExpire={handleSubmit} />
        </div>
      </div>
      <div className="test-body">
        <div className="test-main">
          <QuestionCard
            question={question}
            index={currentQ}
            selectedOption={answers[question._id]}
            onSelect={handleSelect}
          />
          <div className="test-navigation">
            <button className="btn-secondary" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
              Previous
            </button>
            <button
              className="btn-secondary"
              disabled={currentQ === test.questions.length - 1}
              onClick={() => setCurrentQ(currentQ + 1)}
            >
              Next
            </button>
            <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'End Test'}
            </button>
          </div>
        </div>
        <QuestionNav
          total={test.questions.length}
          current={currentQ}
          answers={test.questions.map((q) => answers[q._id])}
          onJump={setCurrentQ}
        />
      </div>
    </div>
  );
};

export default TestPage;