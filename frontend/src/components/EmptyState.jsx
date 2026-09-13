// Shared "nothing here yet" block, used on Feed, Requests and Connections
// so every empty state looks the same instead of a lone line of text.
function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={40} strokeWidth={1.5} />}
      <p className="empty-title">{title}</p>
      {subtitle && <p className="empty-subtitle">{subtitle}</p>}
    </div>
  );
}

export default EmptyState;
