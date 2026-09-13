import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  User,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import './PassengerDetails.css'

const GENDERS = ['Male', 'Female', 'Other']

const DEFAULT_BOOKING = {
  bus: {
    id: 'bus-001',
    operator: 'KPN Travels',
    from: 'Chennai',
    to: 'Madurai',
    departure: '20:30',
    arrival: '05:30',
    duration: '9h 00m',
    price: 650,
    type: 'AC Sleeper',
    date: '2026-09-13',
  },
  selectedSeats: ['A2'],
  totalPrice: 650,
  journeyDate: '2026-09-13',
}

function PassengerDetails() {
  const navigate = useNavigate()
  const location = useLocation()

  /* =========================================================
     GET BOOKING DATA
  ========================================================= */

  const booking = useMemo(() => {
    if (location.state?.bus) {
      return location.state
    }

    const saved = sessionStorage.getItem('booking_draft')

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Invalid booking draft:', error)
      }
    }

    return DEFAULT_BOOKING
  }, [location.state])

  /* =========================================================
     PASSENGER FORM
  ========================================================= */

  const [form, setForm] = useState({
    name: 'Arun',
    age: '28',
    gender: 'Male',
    phone: '9840123456',
    email: 'arun.traveler@example.com',
  })

  const set = (key) => (e) => {
    setForm((previous) => ({
      ...previous,
      [key]: e.target.value,
    }))
  }

  /* =========================================================
     CONTINUE TO PAYMENT
  ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Please enter passenger name.')
      return
    }

    if (!form.age) {
      toast.error('Please enter passenger age.')
      return
    }

    if (!form.gender) {
      toast.error('Please select gender.')
      return
    }

    if (!form.phone || form.phone.length < 10) {
      toast.error('Please enter a valid mobile number.')
      return
    }

    const completeDraft = {
      ...booking,
      passenger: {
        ...form,
        name: form.name.trim(),
        age: Number(form.age),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
    }

    /* Save temporary booking */
    sessionStorage.setItem(
      'booking_draft',
      JSON.stringify(completeDraft)
    )

    toast.success(
      'Passenger details confirmed! Proceeding to Payment...'
    )

    navigate('/payment', {
      state: completeDraft,
    })
  }

  const bus = booking.bus || DEFAULT_BOOKING.bus

  const seats =
    booking.selectedSeats?.length > 0
      ? booking.selectedSeats
      : ['A2']

  const amount =
    booking.totalPrice ||
    seats.length * (bus.price || 650)

  const journeyDate =
    booking.journeyDate ||
    bus.date ||
    '2026-09-13'

  return (
    <div className="passenger-details-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-header">
        <div className="container">

          <div
            className="demo-pill"
            style={{
              marginBottom: '0.6rem',
              background: 'rgba(201,168,76,0.15)',
              borderColor: 'var(--gold)',
              color: 'var(--gold-light)',
            }}
          >
            Step 3: Passenger Information
          </div>

          <h1>Traveler Details</h1>

          <p>
            {bus.operator} — {bus.from} → {bus.to}
            &nbsp;|&nbsp;
            Seat(s): {seats.join(', ')}
            &nbsp;|&nbsp;
            Total: ₹{amount}
          </p>

        </div>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="container passenger-page">

        <form
          id="passenger-form"
          className="passenger-form card"
          onSubmit={handleSubmit}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 className="form-section-title">
              <User size={20} />
              Traveler Information
            </h2>

            <span className="demo-pill">
              Demo Info Pre-filled
            </span>
          </div>

          {/* NAME / AGE / GENDER */}

          <div className="form-row">

            <div className="form-group">

              <label
                htmlFor="passenger-name"
                className="form-label"
              >
                Full Name <span style={{ color: 'red' }}>*</span>
              </label>

              <input
                id="passenger-name"
                type="text"
                className="form-control"
                placeholder="e.g. Arun Kumar"
                value={form.name}
                onChange={set('name')}
                required
              />

            </div>

            <div className="form-group">

              <label
                htmlFor="passenger-age"
                className="form-label"
              >
                Age <span style={{ color: 'red' }}>*</span>
              </label>

              <input
                id="passenger-age"
                type="number"
                className="form-control"
                placeholder="e.g. 28"
                min="1"
                max="120"
                value={form.age}
                onChange={set('age')}
                required
              />

            </div>

            <div className="form-group">

              <label
                htmlFor="passenger-gender"
                className="form-label"
              >
                Gender <span style={{ color: 'red' }}>*</span>
              </label>

              <div className="select-wrapper">

                <select
                  id="passenger-gender"
                  className="form-control"
                  value={form.gender}
                  onChange={set('gender')}
                  required
                >
                  <option value="">
                    Select gender
                  </option>

                  {GENDERS.map((gender) => (
                    <option
                      key={gender}
                      value={gender}
                    >
                      {gender}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="select-chevron"
                />

              </div>

            </div>

          </div>

          {/* CONTACT */}

          <h3
            className="form-section-title"
            style={{ marginTop: '1.5rem' }}
          >
            <Phone size={18} />
            Contact Information
          </h3>

          <div className="form-row">

            <div className="form-group">

              <label
                htmlFor="passenger-phone"
                className="form-label"
              >
                Mobile Number
                <span style={{ color: 'red' }}>*</span>
              </label>

              <input
                id="passenger-phone"
                type="tel"
                className="form-control"
                placeholder="e.g. 9840123456"
                value={form.phone}
                onChange={set('phone')}
                maxLength="10"
                required
              />

            </div>

            <div className="form-group">

              <label
                htmlFor="passenger-email"
                className="form-label"
              >
                Email Address
              </label>

              <input
                id="passenger-email"
                type="email"
                className="form-control"
                placeholder="arun@example.com"
                value={form.email}
                onChange={set('email')}
              />

            </div>

          </div>

          {/* =================================================
              JOURNEY SUMMARY
          ================================================= */}

          <div className="journey-summary">

            <div className="js-row">
              <span>Bus Operator</span>
              <strong>
                {bus.operator} ({bus.type || bus.busType})
              </strong>
            </div>

            <div className="js-row">
              <span>Route</span>
              <strong>
                {bus.from} → {bus.to}
              </strong>
            </div>

            <div className="js-row">
              <span>Departure Time</span>
              <strong>
                {bus.departure || bus.departureTime}
                {' '}
                ({bus.duration})
              </strong>
            </div>

            <div className="js-row">
              <span>Journey Date</span>
              <strong>
                {journeyDate}
              </strong>
            </div>

            <div className="js-row">
              <span>Seat(s) Selected</span>
              <strong>
                {seats.join(', ')}
              </strong>
            </div>

            <div
              className="js-row"
              style={{
                paddingTop: '0.6rem',
                borderTop: '1px solid var(--cream-dark)',
                marginTop: '0.4rem',
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: 'var(--navy)',
                }}
              >
                Total Payable
              </span>

              <strong
                className="js-total"
                style={{
                  color: 'var(--maroon)',
                  fontSize: '1.25rem',
                }}
              >
                ₹{amount}
              </strong>
            </div>

          </div>

          {/* SECURITY */}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-mid)',
              fontSize: '0.8rem',
              margin: '0.5rem 0 1.2rem',
            }}
          >
            <ShieldCheck
              size={16}
              style={{ color: '#16a34a' }}
            />

            <span>
              Passenger information is securely stored
              with your booking.
            </span>
          </div>

          {/* SUBMIT */}

          <button
            id="confirm-passenger-btn"
            type="submit"
            className="btn-primary"
            style={{
              justifyContent: 'center',
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
            }}
          >
            Continue to Payment
            <ArrowRight size={18} />
          </button>

        </form>

      </div>
    </div>
  )
}

export default PassengerDetails