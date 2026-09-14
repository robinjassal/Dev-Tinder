import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Inbox, Users, User, LogOut, DollarSign } from "lucide-react";
import { logoutUser } from "../features/auth/authSlice";

// One source of truth for the nav items, used by both the desktop
// top links and the mobile bottom tab bar so they never go out of sync.
const NAV_ITEMS = [
  { to: "/", label: "Feed", icon: Heart, end: true },
  { to: "/requests", label: "Requests", icon: Inbox },
  { to: "/connections", label: "Matches", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/premium", label: "Premium", icon: DollarSign },
];

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  // Logged-out users (on /login or /signup) just see the logo
  if (!user) {
    return (
      <header className="navbar">
        <NavLink to="/login" className="logo">
          Dev<span>Tinder</span>
        </NavLink>
      </header>
    );
  }

  return (
    <>
      {/* Top bar: logo + links on desktop, just the logo on mobile */}
      <header className="navbar">
        <NavLink to="/" className="logo">
          Dev<span>Tinder</span>
        </NavLink>

        <nav className="nav-links">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </header>

      {/* Bottom tab bar: hidden on desktop, shown on small screens (see index.css) */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="bottom-nav-item">
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button className="bottom-nav-item bottom-nav-logout" onClick={handleLogout}>
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;
