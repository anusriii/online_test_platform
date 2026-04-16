const ResultCard = ({ result }) => {
  return (
    <div className={`result-card ${result.passed ? 'result-pass' : 'result-fail'}`}>
      <h2>{result.passed ? 'Passed' : 'Failed'}</h2>
      <div className="result-score">{result.scoredMarks} / {result.totalMarks}</div>
      <div className="result-percentage">{result.percentage}%</div>
      <div className="result-stats">
        <div className="stat correct">Correct: {result.correctCount}</div>
        <div className="stat wrong">Wrong: {result.wrongCount}</div>
        <div className="stat skipped">Skipped: {result.skippedCount}</div>
      </div>
    </div>
  );
};

export default ResultCard;