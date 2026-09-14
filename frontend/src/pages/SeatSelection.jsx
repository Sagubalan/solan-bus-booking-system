import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Bus,
  Info,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react'
import SeatLayout from '../components/SeatLayout'
import toast from 'react-hot-toast'
import './SeatSelection.css'

function SeatSelection() {
  const navigate = useNavigate()
  const location = useLocation()

  /*
  =========================================================
  GET SELECTED BUS
  =========================================================
  Priority:
  1. React Router state
  2. sessionStorage
  3. null
  */

  const bus = useMemo(() => {
    // First check router state
    if (location.state?.bus) {
      return location.state.bus
    }

    // Then check sessionStorage
    const savedBus = sessionStorage.getItem('selected_bus')

    if (savedBus) {
      try {
        return JSON.parse(savedBus)
      } catch (error) {
        console.error(
          'Unable to parse selected bus:',
          error
        )

        sessionStorage.removeItem('selected_bus')
      }
    }

    return null
  }, [location.state])

  /*
  =========================================================
  NORMALIZE BUS DATA
  =========================================================
  Supports both MongoDB field names and frontend names.
  */

  const normalizedBus = useMemo(() => {
    if (!bus) return null

    return {
      ...bus,

      // MongoDB ID is the important one
      _id: bus._id || bus.id,

      // Frontend ID
      id: bus._id || bus.id,

      operator:
        bus.operator || 'KPN Travels',

      type:
        bus.busType ||
        bus.type ||
        'AC Sleeper',

      from:
        bus.from || 'Chennai',

      to:
        bus.to || 'Madurai',

      departure:
        bus.departureTime ||
        bus.departure ||
        '20:30',

      arrival:
        bus.arrivalTime ||
        bus.arrival ||
        '05:30',

      duration:
        bus.duration || '9h 00m',

      price:
        Number(bus.price) || 650,

      totalSeats:
        Number(bus.totalSeats) || 40,

      availableSeats:
        Number(bus.availableSeats) || 0,

      rating:
        Number(bus.rating) || 4.7,

      amenities:
        Array.isArray(bus.amenities)
          ? bus.amenities
          : [],

      date:
        location.state?.date ||
        bus.date ||
        new Date()
          .toISOString()
          .split('T')[0],
    }
  }, [bus, location.state])

  /*
  =========================================================
  SELECTED SEATS
  =========================================================
  */

  const [selectedSeats, setSelectedSeats] =
    useState([])

  /*
  =========================================================
  SEAT TOGGLE
  =========================================================
  */

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) => {
      // Remove seat
      if (prev.includes(seatId)) {
        return prev.filter(
          (seat) => seat !== seatId
        )
      }

      // Maximum 6 seats
      if (prev.length >= 6) {
        toast.error(
          'Maximum 6 seats can be selected per booking.'
        )

        return prev
      }

      // Add seat
      return [...prev, seatId]
    })
  }

  /*
  =========================================================
  PRICE CALCULATION
  =========================================================
  */

  const seatPrice =
    normalizedBus?.price || 650

  const totalPrice =
    selectedSeats.length * seatPrice

  /*
  =========================================================
  CONTINUE TO PASSENGER DETAILS
  =========================================================
  */

  const handleContinue = () => {
    if (!normalizedBus) {
      toast.error(
        'Selected bus not found. Please select a bus again.'
      )

      navigate('/buses')

      return
    }

    // Very important: MongoDB _id must exist
    if (!normalizedBus._id) {
      console.error(
        'MongoDB bus ID missing:',
        normalizedBus
      )

      toast.error(
        'Bus ID is missing. Please select the bus again.'
      )

      navigate('/buses')

      return
    }

    if (selectedSeats.length === 0) {
      toast.error(
        'Please select at least one seat to proceed.'
      )

      return
    }

    /*
    =======================================================
    BOOKING DRAFT
    =======================================================
    */

    const bookingDraft = {
      bus: normalizedBus,

      // MongoDB bus ID explicitly stored
      busId: normalizedBus._id,

      selectedSeats,

      totalPrice,

      journeyDate: normalizedBus.date,
    }

    console.log(
      '========================================'
    )

    console.log(
      '[SEAT SELECTION]'
    )

    console.log(
      'MongoDB Bus ID:',
      normalizedBus._id
    )

    console.log(
      'Selected Seats:',
      selectedSeats
    )

    console.log(
      'Total Price:',
      totalPrice
    )

    console.log(
      'Booking Draft:',
      bookingDraft
    )

    console.log(
      '========================================'
    )

    /*
    =======================================================
    SAVE BOOKING DRAFT
    =======================================================
    */

    sessionStorage.setItem(
      'booking_draft',
      JSON.stringify(bookingDraft)
    )

    /*
    =======================================================
    GO TO PASSENGER PAGE
    =======================================================
    */

    navigate('/passenger', {
      state: bookingDraft,
    })
  }

  /*
  =========================================================
  BUS NOT FOUND
  =========================================================
  */

  if (!normalizedBus) {
    return (
      <div className="page-container seat-selection-page">

        <div
          className="empty-state"
          style={{
            textAlign: 'center',
            padding: '80px 20px',
          }}
        >
          <Bus
            size={56}
            style={{
              marginBottom: '20px',
              opacity: 0.6,
            }}
          />

          <h2>
            Bus Selection Not Found
          </h2>

          <p
            style={{
              margin:
                '12px 0 24px',
            }}
          >
            The selected bus could not be found.
            Please return to bus selection and
            choose a bus again.
          </p>

          <button
            className="btn-primary"
            onClick={() =>
              navigate('/buses')
            }
          >
            <ChevronLeft size={18} />
            Back to Bus Selection
          </button>
        </div>

      </div>
    )
  }

  /*
  =========================================================
  PAGE UI
  =========================================================
  */

  return (
    <div className="page-container seat-selection-page">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="page-header">

        <div>
          <span className="eyebrow">
            SOLAN BUS BOOKING
          </span>

          <h1>
            Select Your Seats
          </h1>

          <p>
            Choose your preferred seats for the
            journey.
          </p>
        </div>

      </div>

      {/* ===================================================
          BUS INFORMATION CARD
      =================================================== */}

      <div className="seat-bus-info card">

        <div className="seat-bus-info__main">

          <div className="seat-bus-icon">
            <Bus size={26} />
          </div>

          <div>

            <h2>
              {normalizedBus.operator}
            </h2>

            <span className="bus-type badge badge-gold">
              {normalizedBus.type}
            </span>

          </div>

        </div>

        {/* Route */}

        <div className="seat-route">

          <div>
            <span className="route-time">
              {normalizedBus.departure}
            </span>

            <span className="route-city">
              {normalizedBus.from}
            </span>
          </div>

          <ArrowRight
            size={20}
          />

          <div>
            <span className="route-time">
              {normalizedBus.arrival}
            </span>

            <span className="route-city">
              {normalizedBus.to}
            </span>
          </div>

        </div>

        {/* Journey Details */}

        <div className="seat-bus-details">

          <span>
            <Calendar size={15} />

            {normalizedBus.date}
          </span>

          <span>
            <Clock size={15} />

            {normalizedBus.duration}
          </span>

          <span>
            <MapPin size={15} />

            {normalizedBus.availableSeats}
            {' '}seats available
          </span>

        </div>

      </div>

      {/* ===================================================
          SEAT SELECTION AREA
      =================================================== */}

      <div className="seat-selection-layout">

        {/* LEFT SIDE */}

        <div className="seat-layout-section">

          <div className="section-heading">

            <div>

              <h2>
                Choose Seats
              </h2>

              <p>
                Select up to 6 seats
              </p>

            </div>

            <div className="seat-price">
              ₹{seatPrice}
              <span>
                / seat
              </span>
            </div>

          </div>

          {/* Seat Layout */}

          <div className="card seat-layout-card">

            <SeatLayout
              selectedSeats={
                selectedSeats
              }
              onSeatToggle={
                toggleSeat
              }
              totalSeats={
                normalizedBus.totalSeats
              }
              availableSeats={
                normalizedBus.availableSeats
              }
              seats={
                normalizedBus.seats
              }
            />

          </div>

        </div>

        {/* RIGHT SIDE */}

        <aside className="booking-summary card">

          <div className="summary-header">

            <h2>
              Booking Summary
            </h2>

          </div>

          {/* Bus */}

          <div className="summary-bus">

            <strong>
              {normalizedBus.operator}
            </strong>

            <span>
              {normalizedBus.from}
              {' → '}
              {normalizedBus.to}
            </span>

          </div>

          {/* Date */}

          <div className="summary-row">

            <span>
              <Calendar size={15} />
              Date
            </span>

            <strong>
              {normalizedBus.date}
            </strong>

          </div>

          {/* Departure */}

          <div className="summary-row">

            <span>
              <Clock size={15} />
              Departure
            </span>

            <strong>
              {normalizedBus.departure}
            </strong>

          </div>

          {/* Selected Seats */}

          <div className="summary-row">

            <span>
              Seats
            </span>

            <strong>
              {selectedSeats.length > 0
                ? selectedSeats.join(', ')
                : 'None selected'}
            </strong>

          </div>

          {/* Divider */}

          <div className="summary-divider" />

          {/* Price */}

          <div className="summary-total">

            <span>
              Total Fare
            </span>

            <strong>
              ₹{totalPrice}
            </strong>

          </div>

          {/* Continue */}

          <button
            className="btn-primary btn-full"
            onClick={handleContinue}
            disabled={
              selectedSeats.length === 0
            }
          >
            Continue to Passenger Details
            <ArrowRight size={18} />
          </button>

          {/* Info */}

          <div className="summary-info">

            <Info size={16} />

            <span>
              You can select a maximum of
              6 seats per booking.
            </span>

          </div>

        </aside>

      </div>

    </div>
  )
}

export default SeatSelection