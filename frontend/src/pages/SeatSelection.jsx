import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bus, Info, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'
import SeatLayout from '../components/SeatLayout'
import toast from 'react-hot-toast'
import './SeatSelection.css'

const DEFAULT_BUS = {
  id: 'bus-001',
  operator: 'KPN Travels',
  from: 'Chennai',
  to: 'Madurai',
  departure: '20:30',
  arrival: '05:30',
  duration: '9h 00m',
  price: 650,
  type: 'AC Sleeper',
  date: '15 September 2026',
}

function SeatSelection() {
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve bus details from navigation state or sessionStorage
  const bus = useMemo(() => {
    if (location.state?.bus) return location.state.bus
    const saved = sessionStorage.getItem('selected_bus')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { /* use default */ }
    }
    return DEFAULT_BUS
  }, [location.state])

  // Default select A2 as per the prompt example
  const [selectedSeats, setSelectedSeats] = useState(['A2'])

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId)
      } else {
        if (prev.length >= 6) {
          toast.error('Maximum 6 seats can be selected per booking.')
          return prev
        }
        return [...prev, seatId]
      }
    })
  }

  const seatPrice = bus.price || 650
  const totalPrice = selectedSeats.length * seatPrice

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to proceed.')
      return
    }

    const bookingDraft = {
      bus,
      selectedSeats,
      totalPrice,
      journeyDate: bus.date || '15 September 2026',
    }

    sessionStorage.setItem('booking_draft', JSON.stringify(bookingDraft))
    navigate('/passenger', { state: bookingDraft })
  }

  return (
    <div className="seat-selection-page">
      <div className="page-header">
        <div className="container">
          <div className="demo-pill" style={{ marginBottom: '0.6rem', background: 'rgba(201,168,76,0.15)', borderColor: 'var(--gold)', color: 'var(--gold-light)' }}>
            Step 2: Select Your Preferred Seat
          </div>
          <h1>Choose Your Bus Seats</h1>
          <p>
            {bus.operator} — {bus.from} → {bus.to} &nbsp;|&nbsp;
            Departure: {bus.departure} &nbsp;|&nbsp;
            {bus.type}
          </p>
        </div>
      </div>

      <div className="container seat-page">
        {/* Layout */}
        <div className="seat-page__layout">
          <SeatLayout
            selectedSeats={selectedSeats}
            onSeatToggle={toggleSeat}
          />
        </div>

        {/* Info Panel */}
        <aside className="seat-page__info">
          <div className="seat-info-card card">
            <h3 className="seat-info-title">
              <Bus size={18} /> Journey Summary
            </h3>

            <div className="seat-info-row">
              <span>Bus Operator</span>
              <strong>{bus.operator}</strong>
            </div>
            <div className="seat-info-row">
              <span>Route</span>
              <strong>{bus.from} → {bus.to}</strong>
            </div>
            <div className="seat-info-row">
              <span>Journey Date</span>
              <strong>{bus.date || '15 September 2026'}</strong>
            </div>
            <div className="seat-info-row">
              <span>Departure</span>
              <strong>{bus.departure}</strong>
            </div>
            <div className="seat-info-row">
              <span>Arrival</span>
              <strong>{bus.arrival}</strong>
            </div>
            <div className="seat-info-row">
              <span>Bus Type</span>
              <strong>{bus.type}</strong>
            </div>

            <hr className="seat-info-hr" />

            <div className="seat-info-row">
              <span>Selected Seat</span>
              <strong style={{ color: 'var(--gold-dark)', fontSize: '1.05rem' }}>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
              </strong>
            </div>

            <div className="seat-info-row">
              <span>Ticket Price</span>
              <strong>₹{seatPrice}</strong>
            </div>

            <div className="seat-info-row seat-price-row">
              <span>Total Amount</span>
              <strong className="seat-total">₹{totalPrice}</strong>
            </div>

            <button
              id="proceed-to-passenger-btn"
              type="button"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1.2rem' }}
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
            >
              Continue to Passenger Details <ArrowRight size={16} />
            </button>
          </div>

          <div className="seat-tip card">
            <Info size={16} style={{ color: 'var(--gold-dark)', flexShrink: 0 }} />
            <span>2+2 classical arrangement. Click any seat to select or unselect. Grey seats are already booked.</span>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default SeatSelection

