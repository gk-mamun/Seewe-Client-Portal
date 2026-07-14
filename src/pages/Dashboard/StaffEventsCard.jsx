import Card from '../../components/Card/Card.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import './upcoming-cards.css';

/**
 * Tabular widget grouping employees by life-cycle event:
 *   Onboarding · Probation · Resigning · Terminated · Never Onboard
 * Each group is one coloured section header followed by 1+ rows.
 */
const SECTIONS = [
  { key: 'onboarding', label: '👥 Onboarding', tone: 'onboard', subLabel: (e) => `Start: ${e.startDate}`, pill: 'New' },
  { key: 'probation',  label: '⏱ Probation',   tone: 'amber',   subLabel: (e) => `Until: ${e.until || '—'}`, pill: 'Probation' },
  { key: 'resigning',  label: '📅 Resigning',  tone: 'danger',  subLabel: (e) => `Last Day: ${e.lastDay}`, pill: 'Notice Period' },
];

export default function StaffEventsCard({ buckets }) {
  const activeSections = SECTIONS.filter((s) => (buckets[s.key] || []).length > 0);

  return (
    <Card title="👤 Staff Events" bodyPadding={false}>
      {activeSections.length === 0 ? (
        <div className="appr-empty">No events this period</div>
      ) : (
        activeSections.map((s) => (
          <div key={s.key}>
            <div className={`se-section se-section--${s.tone}`}>{s.label}</div>
            {buckets[s.key].map((e) => (
              <div key={e.id} className="up-row">
                <Avatar initials={e.initials} color={e.color} photo={e.photo} alt={e.name} size={30} />
                <div className="up-flex">
                  <div className="up-name">{e.name}</div>
                  <div className={`up-meta up-meta--${s.tone}`}>{s.subLabel(e)}</div>
                </div>
                <span className={`se-pill se-pill--${s.tone}`}>{s.pill}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </Card>
  );
}
