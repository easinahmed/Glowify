'use client';

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../api/api';
import { useAuth } from '../context/AuthContext';

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
`;

const NAV_LINKS = [
  { label: "Shop All", category: null },
  { label: "Cleansers", category: "CLEANSER" },
  { label: "Serums", category: "SERUM" },
  { label: "Moisturizers", category: "MOISTURIZER" },
  { label: "Rituals", category: "RITUAL" }
];

export default function Navbar() {
  const [active, setActive] = useState("Shop All");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const isAuthenticated = Boolean(user);
  const cartCount = cartData?.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleCategoryClick = (label, category) => {
    setActive(label);
    setMenuOpen(false);

    if (category) {
      // Go to shop with category filter
      const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : `/shop?category=${category}`;
      navigate(dashboardPath, { replace: true });
    } else {
      // "Shop All" - clear all filters
      navigate('/shop', { replace: true });
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/cart');
      }
    } else {
      navigate('/auth/login');
    }
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(dashboardPath);
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <>
      <style>{styles}</style>

      <nav className="sticky top-0 z-50 w-full border-b" style={{ background: "#f9ece6", borderColor: "#edddd7" }}>
        <div className="mx-auto max-w-7xl px-5 md:px-10 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-base tracking-[0.22em] uppercase font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2e2420" }}>
            Glowify
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, category }) => (
              <li key={label}>
                <button
                  onClick={() => handleCategoryClick(label, category)}
                  className={`relative px-4 py-2 text-[13.5px] tracking-wide transition-colors ${active === label ? "nav-link-active" : ""}`}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: active === label ? "400" : "300",
                    color: active === label ? "#2e2420" : "#9e8a85",
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button className="w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full" style={{ color: "#2e2420" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Cart */}
            <button onClick={handleCartClick} className="relative w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full" style={{ color: "#2e2420" }}>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#a89088] text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
            </button>

            {/* Account */}
            <button onClick={handleAccountClick} className="w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full" style={{ color: "#2e2420" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 ${menuOpen ? "ham-open" : ""}`}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mobile-menu-open border-t px-5 py-4" style={{ background: "#fdf0ee" }}>
            {NAV_LINKS.map(({ label, category }) => (
              <button
                key={label}
                onClick={() => handleCategoryClick(label, category)}
                className="w-full text-left py-3 px-4 rounded-xl text-sm"
                style={{
                  fontWeight: active === label ? "500" : "400",
                  color: active === label ? "#2e2420" : "#9e8a85",
                }}
              >
                {label}
              </button>
            ))}

            {/* Mobile Auth Links */}
            <div className="border-t mt-4 pt-4 space-y-2">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => { navigate('/auth/login'); setMenuOpen(false); }}
                    className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium"
                    style={{ color: "#2e2420" }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate('/auth/signup'); setMenuOpen(false); }}
                    className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium"
                    style={{ color: "#2e2420" }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { handleCartClick(); setMenuOpen(false); }}
                    className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-between"
                    style={{ color: "#2e2420" }}
                  >
                    Cart {cartCount > 0 && <span className="bg-[#a89088] text-white px-2 py-1 rounded-full text-xs">{cartCount}</span>}
                  </button>
                  <button
                    onClick={() => { handleAccountClick(); setMenuOpen(false); }}
                    className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium"
                    style={{ color: "#2e2420" }}
                  >
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {menuOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setMenuOpen(false)} />}
    </>
  );
}