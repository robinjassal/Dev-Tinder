// A single profile card in the feed.
// dragX is how far the card has been dragged horizontally (0 when idle).
// dragHandlers are the pointer events (only passed in for the top card by Feed.jsx).
function UserCard({ user, className = "", style, dragX = 0, dragHandlers = {} }) {
  const { firstName, lastName, age, gender, about, photoUrl, skills } = user;

  // Fallback avatar if the user hasn't set a photoUrl yet
  const photo =
    photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`;

  // Fade in a "LIKE" stamp as the card is dragged right, "NOPE" as it's dragged left
  const likeOpacity = Math.max(0, Math.min(dragX / 100, 1));
  const nopeOpacity = Math.max(0, Math.min(-dragX / 100, 1));

  return (
    <div className={`swipe-card ${className}`} style={style} {...dragHandlers}>
      <div
        className="swipe-card-photo"
        style={{ backgroundImage: `url(${photo})` }}
      >
        {likeOpacity > 0 && (
          <span className="stamp stamp-like" style={{ opacity: likeOpacity }}>
            LIKE
          </span>
        )}
        {nopeOpacity > 0 && (
          <span className="stamp stamp-nope" style={{ opacity: nopeOpacity }}>
            NOPE
          </span>
        )}

        <div className="swipe-card-info">
          <h2>
            {firstName} {lastName}
            {age ? `, ${age}` : ""}
          </h2>
          {gender && <p className="gender-tag">{gender}</p>}
        </div>
      </div>

      <div className="swipe-card-body">
        <p className="about-text">{about}</p>
        {skills?.length > 0 && (
          <div className="skills-list">
            {skills.map((skill) => (
              <span key={skill} className="skill-chip">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCard;
