// Small reusable loading indicator, used instead of plain "Loading..." text
// on the Feed, Requests and Connections pages.
function Loader({ label = "Loading..." }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export default Loader;
