import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Calendar, ArrowRight, Shield, Clock, Star,
  Award, Headphones, ChevronRight, Bus, Sparkles
} from 'lucide-react'
import './Home.css'

/* ── South Indian Popular Routes ── */
const POPULAR_ROUTES = [
  { from: 'Chennai',   to: 'Madurai',    duration: '9h 00m',  price: 650, trips: 48, state: 'Tamil Nadu' },
  { from: 'Chennai',   to: 'Coimbatore', duration: '9h 00m',  price: 850, trips: 42, state: 'Tamil Nadu' },
  { from: 'Chennai',   to: 'Bangalore',  duration: '7h 30m',  price: 650, trips: 56, state: 'TN ⇄ KA' },
  { from: 'Chennai',   to: 'Kochi',      duration: '11h 00m', price: 950, trips: 28, state: 'TN ⇄ KL' },
  { from: 'Bangalore', to: 'Chennai',    duration: '7h 30m',  price: 650, trips: 54, state: 'KA ⇄ TN' },
  { from: 'Chennai',   to: 'Tirupati',   duration: '4h 00m',  price: 420, trips: 36, state: 'TN ⇄ AP' },
]

/* ── Featured South Indian Operators ── */
const OPERATORS = [
  'SETC', 'TNSTC', 'KPN Travels', 'SRM Transport', 'Parveen Travels',
  'KSRTC Kerala', 'Kallada Travels', 'KSRTC Karnataka', 'VRL Travels',
  'APSRTC', 'TSRTC', 'Orange Tours', 'Rathimeena', 'YBM Travels'
]

const WHY_US = [
  {
    icon: <Shield size={28} />,
    title: 'Verified South Indian Fleets',
    desc: 'Top state corporations and private operators with verified drivers and GPS-monitored routes.',
  },
  {
    icon: <Clock size={28} />,
    title: 'Punctual Departures',
    desc: 'Reliable overnight & daytime schedules across Chennai, Bengaluru, Kochi, and Hyderabad corridors.',
  },
  {
    icon: <Star size={28} />,
    title: 'Best Transparent Fares',
    desc: 'Clear demo pricing from ₹350 for express buses to ₹1,500 for luxury multi-axle AC sleepers.',
  },
  {
    icon: <Headphones size={28} />,
    title: '24/7 Regional Support',
    desc: 'Assistance available in Tamil, Malayalam, Kannada, Telugu, and English around the clock.',
  },
]

const STATS = [
  { value: '5 States',   label: 'TN • KL • KA • AP • TS' },
  { value: '30+ Routes', label: 'South India Express' },
  { value: '25+ Brands', label: 'Top Bus Operators' },
  { value: '4.8★',       label: 'Demo User Rating' },
]

function Home() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  const [search, setSearch] = useState({
    from: 'Chennai',
    to: 'Madurai',
    date: today,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/buses?from=${encodeURIComponent(search.from)}&to=${encodeURIComponent(search.to)}&date=${encodeURIComponent(search.date)}`)
  }

  const handleQuickRouteSelect = (from, to) => {
    setSearch(s => ({ ...s, from, to }))
    // Also scroll smoothly to search form if user clicked
    const form = document.getElementById('search-form')
    if (form) form.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content container fade-in-up">
          <div className="hero-badge">
            <Sparkles size={14} />
            South India's Premier Bus Network • Demo Portal
          </div>

          <h1 className="hero-title">
            Travel Across South India<br />
            <span className="hero-title-gold">With Comfort</span>
          </h1>

          <p className="hero-subtitle">
            Book buses across Tamil Nadu, Kerala, Karnataka and beyond.
          </p>

          {/* Search Card */}
          <form
            id="search-form"
            className="search-card"
            onSubmit={handleSearch}
            aria-label="Bus search form"
          >
            <div className="search-card__grid">
              {/* From */}
              <div className="search-field">
                <label htmlFor="search-from" className="search-field__label">
                  <MapPin size={13} /> FROM
                </label>
                <input
                  id="search-from"
                  type="text"
                  className="search-field__input"
                  placeholder="e.g. Chennai"
                  value={search.from}
                  onChange={e => setSearch(s => ({ ...s, from: e.target.value }))}
                  required
                />
              </div>

              {/* Swap button */}
              <button
                type="button"
                id="swap-cities-btn"
                className="swap-btn"
                onClick={() => setSearch(s => ({ ...s, from: s.to, to: s.from }))}
                title="Swap cities"
              >
                <ArrowRight size={18} />
              </button>

              {/* To */}
              <div className="search-field">
                <label htmlFor="search-to" className="search-field__label">
                  <MapPin size={13} /> TO
                </label>
                <input
                  id="search-to"
                  type="text"
                  className="search-field__input"
                  placeholder="e.g. Madurai"
                  value={search.to}
                  onChange={e => setSearch(s => ({ ...s, to: e.target.value }))}
                  required
                />
              </div>

              {/* Journey Date */}
              <div className="search-field">
                <label htmlFor="search-date" className="search-field__label">
                  <Calendar size={13} /> JOURNEY DATE
                </label>
                <input
                  id="search-date"
                  type="date"
                  className="search-field__input"
                  min={today}
                  value={search.date}
                  onChange={e => setSearch(s => ({ ...s, date: e.target.value }))}
                  required
                />
              </div>

              {/* Search Button */}
              <button
                id="search-buses-btn"
                type="submit"
                className="search-btn"
              >
                SEARCH BUSES
                <ArrowRight size={18} />
              </button>
            </div>
          </form>

          {/* Quick Demo Tag */}
          <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
            <span className="demo-pill">
              ⭐ Demo / Sample booking data — College Mini Project
            </span>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

      {/* ── OPERATORS STRIP ── */}
      <div className="operators-ticker">
        <div className="container ticker-container">
          <span className="ticker-label">FEATURED OPERATORS:</span>
          <div className="ticker-chips">
            {OPERATORS.map(op => (
              <span key={op} className="operator-chip">{op}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <section className="stats-strip">
        <div className="container stats-grid">
          {STATS.map(({ value, label }) => (
            <div key={label} className="stat-item">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR ROUTES ── */}
      <section className="section popular-routes">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="gold-divider" />
              <h2 className="section-title">Popular South Indian Routes</h2>
              <p className="section-subtitle">Click any route below to instantly load it into the search box</p>
            </div>
            <button
              id="view-all-routes-btn"
              className="btn-secondary"
              onClick={() => navigate('/buses')}
            >
              View All Buses <ChevronRight size={16} />
            </button>
          </div>

          <div className="routes-grid">
            {POPULAR_ROUTES.map(({ from, to, duration, price, trips, state }) => (
              <button
                key={`${from}-${to}`}
                id={`route-${from.toLowerCase()}-${to.toLowerCase()}`}
                className="route-card"
                onClick={() => handleQuickRouteSelect(from, to)}
                title={`Click to search ${from} to ${to}`}
              >
                <div className="route-card__top">
                  <span className="route-state-tag">{state}</span>
                </div>
                <div className="route-card__cities">
                  <span className="rc-city">{from}</span>
                  <span className="rc-arrow">
                    <ArrowRight size={14} />
                  </span>
                  <span className="rc-city">{to}</span>
                </div>
                <div className="route-card__meta">
                  <span><Clock size={12} /> {duration}</span>
                  <span>{trips} daily trips</span>
                </div>
                <div className="route-card__price">
                  <span className="rc-from">from</span>
                  <span className="rc-price">₹{price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE SOLAN BUS BOOKING ── */}
      <section className="section why-us">
        <div className="container">
          <div className="section-header section-header--center">
            <div className="gold-divider" style={{ margin: '0 auto 1rem' }} />
            <h2 className="section-title">Why Choose Solan Bus Booking?</h2>
            <p className="section-subtitle">Specially curated for intercity bus travel across Southern India</p>
          </div>

          <div className="why-grid">
            {WHY_US.map(({ icon, title, desc }) => (
              <div key={title} className="why-card card">
                <div className="why-card__icon">{icon}</div>
                <h3 className="why-card__title">{title}</h3>
                <p className="why-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2 className="cta-title">Ready to travel across South India?</h2>
            <p className="cta-sub">Reserve seats on Tamil Nadu, Kerala, and Karnataka express routes now.</p>
          </div>
          <div className="cta-actions">
            <button
              id="cta-search-btn"
              className="btn-primary"
              onClick={() => navigate('/buses')}
            >
              <Bus size={18} /> Search Buses
            </button>
            <button
              id="cta-bookings-btn"
              className="btn-secondary"
              onClick={() => navigate('/my-bookings')}
            >
              My Bookings
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

