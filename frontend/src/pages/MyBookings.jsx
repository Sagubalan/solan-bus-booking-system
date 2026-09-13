import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, MapPin, Clock, CheckCircle, Search, Bus, Sparkles, CreditCard } from 'lucide-react'
import './MyBookings.css'

/**
 * DEFAULT SOUTH INDIAN DEMO BOOKINGS
 * Structure is ready for future Axios API integration:
 * Later, replace this initial list with:
 * const { data } = await bookingAPI.getAll()
 */
const DEFAULT_SOUTH_INDIAN_BOOKINGS = [
  {
    id: 'SB20260913001',
    operator: 'KPN Travels',
    from: 'Chennai',
    to: 'Madurai',
    route: 'Chennai → Madurai',
    date: '15 Sep 2026',
    departure: '20:30',
    arrival: '05:30',
    seats: ['A2'],
    seat: 'A2',
    price: 650,
    amount: 650,
    paymentStatus: 'PAID',
    paymentMethod: 'Google Pay',
    busType: 'AC Sleeper',
    status: 'confirmed',
  },
  {
    id: 'SB20260910042',
    operator: 'SETC',
    from: 'Chennai',
    to: 'Coimbatore',
    route: 'Chennai → Coimbatore',
    date: '10 Sep 2026',
    departure: '21:30',
    arrival: '06:30',
    seats: ['B3'],
    seat: 'B3',
    price: 380,
    amount: 380,
    paymentStatus: 'PAID',
    paymentMethod: 'PhonePe',
    busType: 'Express',
    status: 'completed',
  },
  {
    id: 'SB20260905018',
    operator: 'KSRTC Kerala',
    from: 'Bangalore',
    to: 'Kochi',
    route: 'Bangalore → Kochi',
    date: '05 Sep 2026',
    departure: '21:00',
    arrival: '06:00',
    seats: ['C1', 'C2'],
    seat: 'C1, C2',
    price: 1800,
    amount: 1800,
    paymentStatus: 'PAID',
    paymentMethod: 'Paytm',
    busType: 'Volvo AC',
    status: 'completed',
  },
]

const STATUS_MAP = {
  confirmed: { label: 'Confirmed', color: '#15803d', bg: 'rgba(34,197,94,0.1)' },
  completed: { label: 'Completed', color: '#1a3a6b',  bg: 'rgba(26,58,107,0.08)' },
  cancelled: { label: 'Cancelled', color: '#b91c1c',  bg: 'rgba(220,38,38,0.08)' },
}

function MyBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    // Load bookings from localStorage, or populate with default South Indian demos
    try {
      const stored = localStorage.getItem('solan_bookings')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge newly booked items with the default list (avoiding duplicate IDs)
          const merged = [...parsed]
          DEFAULT_SOUTH_INDIAN_BOOKINGS.forEach(item => {
            if (!merged.some(b => b.id === item.id)) {
              merged.push(item)
            }
          })
          setBookings(merged)
          return
        }
      }
    } catch (e) {
      console.error('Error reading localStorage', e)
    }
    // Fallback to default demo list
    setBookings(DEFAULT_SOUTH_INDIAN_BOOKINGS)
  }, [])

  return (
    <div className="mybookings-page-wrapper">
      <div className="page-header">
        <div className="container">
          <div className="demo-pill" style={{ marginBottom: '0.6rem', background: 'rgba(201,168,76,0.15)', borderColor: 'var(--gold)', color: 'var(--gold-light)' }}>
            <Sparkles size={13} /> South India Express • Travel History
          </div>
          <h1>
            <Ticket size={26} style={{ display:'inline', marginRight:'0.5rem', verticalAlign:'middle' }} />
            My Bookings
          </h1>
          <p>Review and download all your South Indian bus booking tickets</p>
        </div>
      </div>

      <div className="container mybookings-page">
        {/* Backend Ready Banner */}
        <div className="backend-ready-notice card">
          <div className="brn-left">
            <Bus size={18} className="brn-icon" />
            <div>
              <strong>Frontend Local State &amp; LocalStorage Active</strong>
              <p>Demo booking records are saved locally in your browser. Clean data structure is ready for Axios + Express + MongoDB integration.</p>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings card">
            <Search size={52} className="no-bookings__icon" />
            <h3>No bookings found</h3>
            <p>You haven't made any bus bookings yet.</p>
            <button
              id="search-buses-empty-btn"
              type="button"
              className="btn-primary"
              onClick={() => navigate('/buses')}
            >
              Search South Indian Buses
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(b => {
              const s = STATUS_MAP[b.status] || STATUS_MAP.confirmed
              const seatText = b.seat || (Array.isArray(b.seats) ? b.seats.join(', ') : (b.seats || 'A2'))
              const displayAmount = b.amount || b.price || 650
              const displayRoute = b.route || `${b.from || 'Chennai'} → ${b.to || 'Madurai'}`

              return (
                <div key={b.id} className="booking-card card" id={`booking-${b.id}`}>
                  {/* Header */}
                  <div className="booking-card__head">
                    <div>
                      <span className="bc-id-badge">ID: {b.id}</span>
                      <h3 className="bc-operator">{b.operator}</h3>
                      <span className="bc-bus-type">{b.busType || 'Express Bus'}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <span
                        className="badge"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label === 'Confirmed' && <CheckCircle size={12} style={{ display:'inline', marginRight:'3px', verticalAlign:'middle' }} />}
                        {s.label}
                      </span>
                      <span className="badge-paid-pill">
                        PAYMENT: {b.paymentStatus || 'PAID'}
                      </span>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="booking-card__route">
                    <div className="bc-stop">
                      <p className="bc-time">{b.departure || '20:30'}</p>
                      <p className="bc-city">{b.from || 'Chennai'}</p>
                    </div>
                    <div className="bc-line">
                      <span />
                      <span className="bc-line-label">
                        <Clock size={11} /> {displayRoute}
                      </span>
                      <span />
                    </div>
                    <div className="bc-stop bc-stop--right">
                      <p className="bc-time">{b.arrival || '05:30'}</p>
                      <p className="bc-city">{b.to || 'Madurai'}</p>
                    </div>
                  </div>

                  {/* Detailed Meta Strip */}
                  <div className="booking-card__meta">
                    <div className="bc-meta-item">
                      <MapPin size={13} />
                      <span>Date: <strong>{b.date || '15 Sep 2026'}</strong></span>
                    </div>

                    <div className="bc-meta-item">
                      <Ticket size={13} />
                      <span>Seat: <strong className="seat-highlight">{seatText}</strong></span>
                    </div>

                    <div className="bc-meta-item">
                      <CreditCard size={13} />
                      <span>Method: <strong>{b.paymentMethod || 'Google Pay'}</strong></span>
                    </div>

                    <div className="bc-meta-price">
                      <span className="bc-price-label">Amount Paid:</span>
                      <strong className="bc-price">₹{displayAmount}</strong>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            id="book-another-btn"
            type="button"
            className="btn-primary"
            onClick={() => navigate('/buses')}
          >
            Book Another South Indian Bus
          </button>
          <button
            id="go-home-btn"
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyBookings

