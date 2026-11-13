import './QuestionsClosedNotice.css';

export default function QuestionsClosedNotice({ onClose }) {
  return (
    <div className="questions-closed-overlay" onClick={onClose}>
      <div
        className="questions-closed-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="questions-closed-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="questions-closed-close" onClick={onClose} aria-label="Close">×</button>
        <div className="questions-closed-mark" aria-hidden="true">✓</div>
        <p className="questions-closed-eyebrow">CONNEXA 2026</p>
        <h2 id="questions-closed-title">Question submissions are closed.</h2>
        <p>We've received your questions and are getting ready for the Opportunity Playground.</p>
        <strong>See you at Connexa 2026!</strong>
        <button type="button" className="questions-closed-button" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
