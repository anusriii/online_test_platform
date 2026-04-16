const QuestionNav = ({ total, current, answers, onJump }) => {
  return (
    <div className="card" style={{ position: 'sticky', top: '20px' }}>
      <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Questions</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {Array.from({ length: total }, (_, i) => {
          const answered = answers[i] !== null && answers[i] !== undefined;
          return (
            <button key={i} onClick={() => onJump(i)}
              style={{
                width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                background: current === i ? '#4f46e5' : answered ? '#22c55e' : '#e5e7eb',
                color: current === i || answered ? '#fff' : '#333',
                transition: 'all 0.15s'
              }}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
        <span><span style={{ background: '#22c55e', borderRadius: '4px', padding: '2px 8px', color: '#fff' }}>■</span> Answered</span>
        <span><span style={{ background: '#e5e7eb', borderRadius: '4px', padding: '2px 8px' }}>■</span> Not answered</span>
        <span><span style={{ background: '#4f46e5', borderRadius: '4px', padding: '2px 8px', color: '#fff' }}>■</span> Current</span>
      </div>
    </div>
  );
};

export default QuestionNav;