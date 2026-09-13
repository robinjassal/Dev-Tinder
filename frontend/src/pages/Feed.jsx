import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, X, PartyPopper } from "lucide-react";
import { fetchFeed, sendConnectionRequest } from "../features/feed/feedSlice";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

// How far (in pixels) the card must be dragged before it counts as a swipe
const SWIPE_THRESHOLD = 100;

function Feed() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.feed);
  const { user } = useSelector((state) => state.auth);

  const [leaving, setLeaving] = useState(null); // "left" | "right" | null
  const [dragX, setDragX] = useState(0); // live drag offset of the top card
  const dragStartX = useRef(null); // pointer X when the drag started, null when not dragging

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Send the request and animate the card fully off screen
  const handleAction = (status) => {
    if (leaving || users.length === 0) return; // ignore clicks mid-animation

    const topUser = users[0];
    setDragX(0);
    setLeaving(status === "interested" ? "right" : "left");

    setTimeout(() => {
      dispatch(sendConnectionRequest({ status, userId: topUser._id }));
      setLeaving(null);
    }, 250);
  };

  // ---- Drag-to-swipe (works for both mouse and touch, no extra library) ----
  const handlePointerDown = (e) => {
    if (leaving) return;
    dragStartX.current = e.clientX;
    // keeps receiving move/up events even if the finger moves fast
    // and briefly leaves the card's bounds
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (dragStartX.current === null) return;
    setDragX(e.clientX - dragStartX.current);
  };

  const handlePointerUp = () => {
    if (dragStartX.current === null) return;
    dragStartX.current = null;

    if (dragX > SWIPE_THRESHOLD) {
      handleAction("interested");
    } else if (dragX < -SWIPE_THRESHOLD) {
      handleAction("ignored");
    } else {
      setDragX(0); // didn't drag far enough, snap back to center
    }
  };

  // While dragging, the card should follow the pointer with no transition delay.
  // Once released (or during the fly-off animation), let CSS transitions take over.
  const topCardStyle = leaving
    ? undefined
    : {
        transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`,
        transition: dragStartX.current !== null ? "none" : "transform 0.25s ease",
      };

  return (
    <main className="page feed-page">
      <h1 className="page-title">
        {user ? `Hey ${user.firstName} 👋` : "Discover developers"}
      </h1>
      <p className="page-subtitle">Drag the card, or use the buttons below</p>

      {loading && <Loader label="Finding developers for you..." />}

      {error && (
        <p className="status-text error">
          {typeof error === "string" ? error : "Something went wrong"}
        </p>
      )}

      {!loading && !error && users.length === 0 && (
        <EmptyState
          icon={PartyPopper}
          title="You're all caught up!"
          subtitle="Check back later for new developers."
        />
      )}

      {users.length > 0 && (
        <div className="card-stack">
          {/* Two cards peek out behind the top one, for real depth */}
          {users[2] && <UserCard user={users[2]} className="swipe-card-back" />}
          {users[1] && <UserCard user={users[1]} className="swipe-card-behind" />}
          <UserCard
            user={users[0]}
            className={leaving ? `leaving-${leaving}` : ""}
            style={topCardStyle}
            dragX={dragX}
            dragHandlers={{
              onPointerDown: handlePointerDown,
              onPointerMove: handlePointerMove,
              onPointerUp: handlePointerUp,
              onPointerCancel: handlePointerUp,
            }}
          />
        </div>
      )}

      {users.length > 0 && (
        <div className="action-buttons">
          <button
            className="btn-round btn-pass"
            onClick={() => handleAction("ignored")}
            aria-label="Not interested"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
          <button
            className="btn-round btn-like"
            onClick={() => handleAction("interested")}
            aria-label="Interested"
          >
            <Heart size={26} strokeWidth={2.5} fill="currentColor" />
          </button>
        </div>
      )}
    </main>
  );
}

export default Feed;
