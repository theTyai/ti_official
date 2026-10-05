export default function Stats() {
  const stats = [
    { value: 'MANIT', label: 'Premier NIT, Bhopal' },
    { value: '∞', label: 'Ideas & Dialogues' },
    { value: '🇮🇳', label: 'Nation First' },
  ];

  return (
    <div className="stats-bar" id="team">
      {stats.map((s) => (
        <div key={s.label} className="stat-item reveal">
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
