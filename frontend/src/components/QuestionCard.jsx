const QuestionCard = ({ question, index, selectedOption, onSelect }) => {
  return (
    <div className="question-card">
      <h3 className="question-text">Q{index + 1}. {question.questionText}</h3>
      <div className="options-list">
        {question.options.map((option, i) => (
          <div
            key={i}
            className={`option ${selectedOption === i ? 'option-selected' : ''}`}
            onClick={() => onSelect(question._id, i)}
          >
            <span className="option-label">{String.fromCharCode(65 + i)}.</span>
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;