import './TodayHighlights.css';

/**
 * Dark-navy banner at the top of the dashboard:
 *   ┌────────────────────────────────────────────────┐
 *   │ 🔔 ✨ Today Highlights  [N actions needed]     │  ← dark header
 *   ├──────────┬──────────┬──────────┬──────────────┤
 *   │ Holiday  │ On Leave │ On Leave │ Last Day…    │  ← white tiles
 *   └──────────┴──────────┴──────────┴──────────────┘
 */
export default function TodayHighlights({
  holidays = [],
  onLeave = [],
  onboarding = [],
  resigning = [],
  actionsNeeded = 0,
}) {
  const tiles = [
    ...holidays.map((h)   => <HolidayTile   key={`h-${h.name}`}    holiday={h} />),
    ...onLeave.map((a)    => <PersonTile    key={`l-${a.id ?? a.name}`} tone="leave"       person={a} subLabel={`📅 On Leave — ${a.type}`} />),
    ...onboarding.map((e) => <PersonTile    key={`o-${e.id ?? e.name}`} tone="onboard"     person={e} subLabel={`👥 Onboarding — ${e.startDate}`} />),
    ...resigning.map((e)  => <PersonTile    key={`r-${e.id ?? e.name}`} tone="resign"      person={e} subLabel={`📅 Last Day: ${e.lastDay}`} />),
  ];

  if (tiles.length === 0) return null;

  return (
    <section className="today-highlights">
      <header className="th-hd">
        <span aria-hidden="true">🔔</span>
        <span className="th-title">✨ Today Highlights</span>
        {actionsNeeded > 0 && (
          <span className="th-actions-badge">
            {actionsNeeded} action{actionsNeeded > 1 ? 's' : ''} needed
          </span>
        )}
      </header>
      <div className="th-tiles">{tiles}</div>
    </section>
  );
}

function HolidayTile({ holiday }) {
  return (
    <div className="th-tile">
      <span className="th-flag" aria-hidden="true">🎌</span>
      <div>
        <div className="th-tile-title">{holiday.name}</div>
        <span
          className="th-pill"
          style={{
            background: `${holiday.col}20`,
            color: holiday.col,
            borderColor: `${holiday.col}40`,
          }}
        >
          {holiday.tag} Holiday
        </span>
      </div>
    </div>
  );
}

function PersonTile({ person, subLabel, tone }) {
  return (
    <div className="th-tile">
      <span className="th-avatar" style={{ background: person.color }}>{person.initials}</span>
      <div>
        <div className="th-tile-title">{person.name}</div>
        <span className={`th-subline th-subline--${tone}`}>{subLabel}</span>
      </div>
    </div>
  );
}
