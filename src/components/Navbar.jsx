import { useState } from "react";
import { Link } from "react-router";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .mobile-menu-open {
    animation: slideDown 0.25s ease both;
  }

  .nav-link-active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1px;
    background: #2e2420;
  }

  .hamburger-line {
    display: block;
    width: 22px;
    height: 1.5px;
    background: #2e2420;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  .ham-open .hamburger-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .ham-open .hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .ham-open .hamburger-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  input::placeholder { color: #cbbdb8; }
`;

const NAV_LINKS = ["Shop All", "Cleansers", "Serums", "Moisturizers", "Rituals"];

export default function Navbar() {
  const [active, setActive] = useState("Shop All");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{styles}</style>

      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-50 w-full border-b"
        style={{
          background: "#f9ece6",
          borderColor: "#edddd7",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-base tracking-[0.22em] uppercase cursor-pointer shrink-0"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: "500",
              color: "#2e2420",
            }}
          >
            Glowify
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1 list-none">
            {NAV_LINKS.map((link) => {
              const isActive = active === link;
              return (
                <li key={link}>
                  <Link
                    to="/shop"
                    onClick={() => setActive(link)}
                    className={`relative px-3.5 py-1.5 text-[13.5px] tracking-wide bg-transparent border-0 cursor-pointer transition-colors duration-200 ${isActive ? "nav-link-active" : ""}`}
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: isActive ? "400" : "300",
                      color: isActive ? "#2e2420" : "#9e8a85",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {link}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right: Icons + Hamburger */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors duration-200 hover:bg-black/5"
              style={{ color: "#2e2420" }}
              aria-label="Search"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Cart */}
            <button
              className="relative w-9 h-9 rounded-full flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors duration-200 hover:bg-black/5"
              style={{ color: "#2e2420" }}
              aria-label="Cart"
            >
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#a89088" }}
              />
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>

            {/* Account */}
            <Link
              to="/auth/login"
              className="w-9 h-9 rounded-full flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors duration-200 hover:bg-black/5"
              style={{ color: "#2e2420" }}
              aria-label="Account"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`md:hidden flex flex-col gap-1.25 justify-center items-center w-9 h-9 rounded-full bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-black/5 ${menuOpen ? "ham-open" : ""}`}
              aria-label="Menu"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* ── MOBILE DROPDOWN ── */}
        {menuOpen && (
          <div
            className="mobile-menu-open md:hidden flex flex-col px-4 pb-4 border-t"
            style={{
              background: "#fdf0ee",
              borderColor: "#edddd7",
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = active === link;
              return (
                <Link
                  key={link}
                  to="/shop"
                  onClick={() => { setActive(link); setMenuOpen(false); }}
                  className="text-left px-4 py-3 text-sm rounded-xl border-0 cursor-pointer transition-all duration-150"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: isActive ? "400" : "300",
                    color: isActive ? "#2e2420" : "#9e8a85",
                    letterSpacing: "0.04em",
                    background: isActive ? "rgba(168,144,136,0.1)" : "transparent",
                  }}
                >
                  {link}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 md:hidden"
          style={{ background: "rgba(46,36,32,0.15)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}