import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import ResultCard from '../components/ResultCard';
import Loader from '../components/Loader';

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await API.get(`/results/${id}`);
        setResult(data);
      } catch (error) {
        toast.error('Failed to load result');
      }
      setLoading(false);
    };
    fetchResult();
  }, [id]);

  if (loading) return <Loader />;
  if (!result) return <div className="dashboard-wrapper"><p>Result not found.</p></div>;

  return (
    <div className="result-wrapper">
      <h2>Result — {result.test?.title}</h2>
      <ResultCard result={result} />
      <div className="result-details">
        <h3>Answer Review</h3>
        {result.response?.answers?.map((ans, i) => {
          const isWrong = ans.selectedOption !== ans.question?.correctAnswer;
          const studentAnsText = ans.selectedOption !== null && ans.selectedOption !== undefined ? ans.question?.options[ans.selectedOption] : 'Skipped';
          const correctAnsText = ans.question?.options[ans.question?.correctAnswer];

          return (
            <div
              key={i}
              className={`review-item ${!isWrong ? 'correct' : 'wrong'}`}
            >
              <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p><strong>Q{i + 1}.</strong> {ans.question?.questionText}</p>
              </div>
              <p>Your answer: {studentAnsText}</p>
              <p>Correct answer: {correctAnsText}</p>
            </div>
          );
        })}
      </div>
      <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ResultPage;