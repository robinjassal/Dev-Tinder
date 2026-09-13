import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, X, Inbox } from "lucide-react";
import { fetchRequests, reviewRequest } from "../features/requests/requestsSlice";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Requests() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleReview = (status, requestId) => {
    dispatch(reviewRequest({ status, requestId }));
  };

  return (
    <main className="page">
      <h1 className="page-title">Connection requests</h1>

      {loading && <Loader label="Loading requests..." />}

      {error && (
        <p className="status-text error">
          {typeof error === "string" ? error : "Something went wrong"}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No pending requests"
          subtitle="People who like your profile will show up here."
        />
      )}

      <ul className="list">
        {items.map((request) => (
          <li key={request._id} className="list-row">
            <div className="list-row-info">
              <span className="avatar-circle">
                {request.fromUserId.firstName[0]}
              </span>
              <span>
                {request.fromUserId.firstName} {request.fromUserId.lastName}
              </span>
            </div>

            <div className="list-row-actions">
              <button
                className="btn-icon btn-accept"
                onClick={() => handleReview("accepted", request._id)}
                aria-label="Accept"
              >
                <Check size={18} strokeWidth={3} />
              </button>
              <button
                className="btn-icon btn-reject"
                onClick={() => handleReview("rejected", request._id)}
                aria-label="Reject"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Requests;
