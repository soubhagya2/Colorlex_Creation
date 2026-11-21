import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Printer,
  User,
  Menu,
  X,
  Shield,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ANNOUNCEMENTS = [
  '🎉 Bulk Printing Special — Get 15% OFF with code COLORLEX15',
  '🚀 Express Same-Day Dispatch Available — Order Before 12 PM',
  '🖨️ Ultra 300 DPI CMYK Printing — True-to-File Color Precision',
  '✅ Free Digital Proof Approval Before Every Print Run',
  '📦 Free Shipping on Orders Above ₹2,000',
];

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/catalog', label: 'Print Catalog' },
  { to: '/custom-design', label: 'Custom Design', highlight: true },
  { to: '/contact', label: 'Contact' },
];

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

/** CSS infinite-scroll announcement marquee */
function MarqueeBar() {
  return (
    <div
      role="marquee"
      aria-label="Site announcements"
      className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 py-1.5 text-white"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-purple-700 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-pink-600 to-transparent" />

      <div className="flex whitespace-nowrap">
        {[0, 1].map((copy) => (
          <span
            key={copy}
            aria-hidden={copy === 1}
            style={{ animation: 'marquee 35s linear infinite' }}
            className="inline-flex shrink-0 items-center gap-3 px-4 text-[11px] font-semibold tracking-wide sm:text-xs"
          >
            {ANNOUNCEMENTS.map((msg, i) => (
              <React.Fragment key={i}>
                <span className="opacity-60">•</span>
                <span>{msg}</span>
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Desktop nav link */
function NavLink({ to, label, currentPath }) {
  // Exact match for "/" so it doesn't fire on every route
  const isActive =
    to === '/'
      ? currentPath === '/'
      : currentPath === to || currentPath.startsWith(to + '/');

  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center text-sm font-semibold transition-colors ${
        isActive ? 'text-purple-600' : 'text-slate-700 hover:text-purple-600'
      }`}
    >
      {label}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Navbar
───────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { cartItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountLabel = totalCartCount > 99 ? '99+' : totalCartCount;
  const cartAriaLabel = `Shopping cart, ${totalCartCount} item${totalCartCount !== 1 ? 's' : ''}`;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/catalog?search=${encodeURIComponent(q)}`);
    setSearchQuery('');
  };

  /** Close drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /** Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Marquee keyframe injected once */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <header className="sticky top-0 z-40 w-full" role="banner">

        {/* ── 1. Marquee Announcement Bar ── */}
        <MarqueeBar />

        {/* ── 2. Main Navbar ── */}
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md"
        >
          {/* ── Row 1: Logo / Nav / Actions ── */}
          <div className="mx-0 flex items-center justify-between gap-2 px-2 sm:mx-4 sm:px-6 lg:px-8">

            {/* Logo */}
            <Link
              to="/"
              aria-label="ColorLex Creation – Home"
              className="group flex shrink-0 items-center py-1"
            >
              <img
                src="/images/logo a.png"
                alt="ColorLex Creation"
                width={160}
                height={64}
                className="my-2 h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:h-14 md:h-16"
              />
            </Link>

            {/* Desktop nav links */}
            <div
              role="menubar"
              aria-label="Primary navigation links"
              className="hidden items-center space-x-7 lg:flex"
            >
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} {...link} currentPath={location.pathname} />
              ))}
            </div>

            {/* Desktop inline search */}
            <form
              role="search"
              aria-label="Search products"
              onSubmit={handleSearch}
              className="hidden flex-1 items-center lg:flex lg:max-w-xs lg:mx-6"
            >
              <label htmlFor="header-search" className="sr-only">Search products</label>
              <div className="relative flex-1">
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
                <input
                  id="header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

              {/* Admin badge – desktop only */}
              {user && isAdmin && (
                <Link
                  to="/admin/dashboard"
                  aria-label="Open admin panel"
                  className="hidden items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 transition-all hover:bg-purple-100 lg:flex"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User / Sign-In – desktop only (mobile uses the row below) */}
              {user ? (
                <Link
                  to="/account"
                  aria-label={`My account: ${user.name}`}
                  className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition-all hover:border-slate-300 lg:flex"
                >
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="max-w-[88px] truncate">{user.name}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  aria-label="Sign in to your account"
                  className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900 lg:flex"
                >
                  <User className="h-4 w-4 text-slate-600" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Cart – desktop only (mobile uses the row below) */}
              <Link
                to="/cart"
                aria-label={cartAriaLabel}
                className="hidden items-center gap-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 px-3 py-2 text-white shadow-md shadow-purple-600/25 transition-transform hover:scale-105 active:scale-95 lg:flex"
              >
                <Printer className="h-4 w-4" />
                <span className="text-xs font-bold">
                  Cart{totalCartCount > 0 ? ` (${cartCountLabel})` : ''}
                </span>
              </Link>

              {/* Hamburger – mobile only */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="rounded-xl p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* ── Row 2: Mobile search bar (below logo row, hidden on desktop) ── */}
          <div className="border-t border-slate-100 px-3 py-2 sm:px-6 lg:hidden">
            <form
              role="search"
              aria-label="Search products"
              onSubmit={handleSearch}
            >
              <label htmlFor="mobile-header-search" className="sr-only">Search products</label>
              <div className="relative">
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
                <input
                  id="mobile-header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </form>
          </div>

        </nav>


        {/* ── 3. Mobile Drawer ── */}

        {/* Backdrop */}
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            background: 'rgba(2,6,23,0.5)',
            backdropFilter: 'blur(4px)',
            transition: 'opacity 0.3s ease',
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
          }}
        />

        {/* Drawer */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="lg:hidden"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            width: '18rem',
            maxWidth: '85vw',
            background: '#fff',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,.25)',
            overflowY: 'auto',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <Link to="/" onClick={() => setMobileOpen(false)} aria-label="ColorLex Creation – Home">
              <img src="/images/logo a.png" alt="ColorLex Creation" className="h-9 w-auto object-contain" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav aria-label="Mobile primary navigation" className="px-5 py-3">
            <ul role="list" className="space-y-1">
              {NAV_LINKS.map(({ to, label }) => {
                const isActive =
                  to === '/'
                    ? location.pathname === '/'
                    : location.pathname === to || location.pathname.startsWith(to + '/');
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-purple-600'
                      }`}
                    >
                      <span>{label}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Admin link (mobile) */}
          {user && isAdmin && (
            <div className="border-t border-slate-100 px-5 py-3">
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700 transition-colors hover:bg-purple-100"
              >
                <Shield className="h-4 w-4" />
                Admin Panel Console
                <ChevronRight className="ml-auto h-4 w-4 text-purple-400" />
              </Link>
            </div>
          )}

          {/* Sign In + Cart in one row */}
          <div className="border-t border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  aria-label={`My account: ${user.name}`}
                  className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-300"
                >
                  <User className="h-4 w-4 shrink-0 text-purple-600" />
                  <span className="truncate">{user.name}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Sign in to your account"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
                >
                  <User className="h-4 w-4 text-slate-600" />
                  <span>Sign In</span>
                </Link>
              )}

              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                aria-label={cartAriaLabel}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 px-3 py-3 text-white shadow-md shadow-purple-600/25 transition-transform active:scale-95"
              >
                <Printer className="h-4 w-4" />
                <span className="text-xs font-bold">
                  Cart{totalCartCount > 0 ? ` (${cartCountLabel})` : ''}
                </span>
              </Link>
            </div>

            {user && (
              <button
                type="button"
                onClick={() => { logout(); setMobileOpen(false); }}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

      </header>
    </>
  );
}