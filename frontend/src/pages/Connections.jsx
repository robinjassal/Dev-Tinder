import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users } from "lucide-react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Connections() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.connections);

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  return (
    <main className="page">
      <h1 className="page-title">Your connections</h1>

      {loading && <Loader label="Loading connections..." />}

      {error && (
        <p className="status-text error">
          {typeof error === "string" ? error : "Something went wrong"}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={Users}
          title="No connections yet"
          subtitle="Go match with someone in the feed!"
        />
      )}

      <div className="connections-grid">
        {items.map((person) => (
          <div key={person._id} className="connection-card">
            <span className="avatar-circle big">{person.firstName[0]}</span>
            <p>
              {person.firstName} {person.lastName}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Connections;
