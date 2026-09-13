import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bus, Menu, X, MapPin, Ticket } from 'lucide-react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/buses', label: 'Find Buses' },
    { to: '/my-bookings', label: 'My Bookings' },
  ]

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><Bus size={22} /></span>
          <span className="logo-text">
            <span className="logo-main">SOLAN</span>
            <span className="logo-sub">BUS BOOKING • SOUTH INDIA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' nav-link--active' : '')
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar-actions">
          <Link to="/my-bookings" className="navbar-cta">
            <Ticket size={16} />
            My Tickets
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          id="mobile-menu-toggle"
          className="mobile-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-drawer">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'mobile-link' + (isActive ? ' mobile-link--active' : '')
              }
              onClick={() => setMenuOpen(false)}
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar
