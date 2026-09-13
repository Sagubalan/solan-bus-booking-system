import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, Download, Home, Ticket, Bus, Calendar, MapPin, User, ShieldCheck, CreditCard } from 'lucide-react'
import './BookingConfirmation.css'

const DEFAULT_CONFIRMED = {
  id: 'SB20260913001',
  paymentStatus: 'PAID',
  passenger: 'Arun',
  operator: 'KPN Travels',
  from: 'Chennai',
  to: 'Madurai',
  route: 'Chennai → Madurai',
  date: '15 September 2026',
  seat: 'A2',
  seats: ['A2'],
  amount: 650,
  paymentMethod: 'Google Pay',
  busType: 'AC Sleeper',
  departure: '20:30',
  arrival: '05:30',
}

function BookingConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()

  const booking = useMemo(() => {
    if (location.state?.booking) return location.state.booking
    const saved = sessionStorage.getItem('last_confirmed_booking')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { /* fallback */ }
    }
    return DEFAULT_CONFIRMED
  }, [location.state])

  const bookingId = booking.id || 'SB20260913001'
  const paymentStatus = booking.paymentStatus || 'PAID'
  const passengerName = booking.passenger || 'Arun'
  const busOperator = booking.operator || 'KPN Travels'
  const busRoute = booking.route || `${booking.from || 'Chennai'} → ${booking.to || 'Madurai'}`
  const journeyDate = booking.date || '15 September 2026'
  const seatDisplay = booking.seat || (booking.seats ? booking.seats.join(', ') : 'A2')
  const amountPaid = booking.amount || 650
  const paymentMethod = booking.paymentMethod || 'Google Pay'
  const departure = booking.departure || '20:30'
  const arrival = booking.arrival || '05:30'
  const busType = booking.busType || 'AC Sleeper'

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="confirmation-page">
      {/* Success hero */}
      <div className="confirm-hero">
        <div className="confirm-icon-ring">
          <CheckCircle size={54} />
        </div>
        <h1 className="confirm-title">✓ Booking Confirmed</h1>
        <p className="confirm-sub">Your South Indian bus ticket has been successfully booked!</p>
        <div className="confirm-booking-id">
          Booking ID: <strong>{bookingId}</strong>
        </div>
      </div>

      {/* Ticket card */}
      <div className="container ticket-wrapper">
        <div className="ticket-card" id="ticket-card">
          <div className="ticket-notch ticket-notch--left" />
          <div className="ticket-notch ticket-notch--right" />

          {/* Header */}
          <div className="ticket-header">
            <div>
              <p className="ticket-label">Bus Operator</p>
              <h3 className="ticket-operator-name">{busOperator}</h3>
              <span className="ticket-bus-type">{busType}</span>
            </div>
            <div className="ticket-header__status">
              <span className="badge badge-paid">
                PAYMENT STATUS: {paymentStatus}
              </span>
            </div>
          </div>

          {/* Route & Timings */}
          <div className="ticket-route">
            <div className="ticket-stop">
              <p className="ticket-time">{departure}</p>
              <p className="ticket-city">{booking.from || 'Chennai'}</p>
              <p className="ticket-date">{journeyDate}</p>
            </div>
            <div className="ticket-route-line">
              <span />
              <span className="ticket-duration">Direct Express</span>
              <span />
            </div>
            <div className="ticket-stop ticket-stop--right">
              <p className="ticket-time">{arrival}</p>
              <p className="ticket-city">{booking.to || 'Madurai'}</p>
              <p className="ticket-date">Next Morning</p>
            </div>
          </div>

          {/* Divider with Dashed Line */}
          <div className="ticket-divider">
            <div className="divider-line" />
          </div>

          {/* Required Fields Grid */}
          <div className="ticket-grid-details">
            <div className="ticket-field-item">
              <span className="tf-label">Booking ID</span>
              <strong className="tf-value tf-id">{bookingId}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Payment Status</span>
              <strong className="tf-value tf-status">{paymentStatus}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Passenger</span>
              <strong className="tf-value">{passengerName}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Bus</span>
              <strong className="tf-value">{busOperator}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Route</span>
              <strong className="tf-value">{busRoute}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Journey Date</span>
              <strong className="tf-value">{journeyDate}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Seat</span>
              <strong className="tf-value highlight-seat">{seatDisplay}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Amount</span>
              <strong className="tf-value tf-amount">₹{amountPaid}</strong>
            </div>

            <div className="ticket-field-item">
              <span className="tf-label">Payment Method</span>
              <strong className="tf-value tf-method">{paymentMethod}</strong>
            </div>
          </div>

          {/* Bottom Security Notice */}
          <div className="ticket-footer-note">
            <ShieldCheck size={16} />
            <span>Show this digital voucher or SMS at boarding point. Boarding terminal: CMBT / Mattuthavani.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirm-actions">
          <button
            id="view-bookings-btn"
            type="button"
            className="btn-primary"
            onClick={() => navigate('/my-bookings')}
          >
            <Ticket size={18} /> View My Bookings
          </button>

          <button
            id="go-home-btn"
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            <Home size={18} /> Back to Home
          </button>

          <button
            id="download-ticket-btn"
            type="button"
            className="btn-navy"
            onClick={handlePrint}
            title="Print or save as PDF"
          >
            <Download size={18} /> Download / Print Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation

