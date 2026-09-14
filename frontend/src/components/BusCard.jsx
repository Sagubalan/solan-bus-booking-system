import {
  MapPin,
  Clock,
  Star,
  Wifi,
  Zap,
  Wind,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './BusCard.css'

function BusCard({ bus, date }) {
  const navigate = useNavigate()

  // If bus data is missing, don't render the card
  if (!bus) {
    return null
  }

  /*
  =========================================================
  MONGODB BUS ID
  =========================================================
  MongoDB uses _id.
  Old frontend data may use id.
  Prefer MongoDB _id.
  */

  const mongoId = bus._id || bus.id

  /*
  =========================================================
  BUS DATA
  =========================================================
  Support both MongoDB field names and old frontend names.
  */

  const operator =
    bus.operator || 'KPN Travels'

  const type =
    bus.busType ||
    bus.type ||
    'AC Sleeper'

  const from =
    bus.from || 'Chennai'

  const to =
    bus.to || 'Madurai'

  const departure =
    bus.departureTime ||
    bus.departure ||
    '20:30'

  const arrival =
    bus.arrivalTime ||
    bus.arrival ||
    '05:30'

  const duration =
    bus.duration || '9h 00m'

  const price =
    Number(bus.price) || 650

  const totalSeats =
    Number(bus.totalSeats) || 40

  const availableSeats =
    Number(bus.availableSeats) || 0

  const rating =
    Number(bus.rating) || 4.7

  const amenities =
    Array.isArray(bus.amenities)
      ? bus.amenities
      : ['wifi', 'ac', 'usb']

  const journeyDate =
    date ||
    bus.date ||
    new Date()
      .toISOString()
      .split('T')[0]

  /*
  =========================================================
  AMENITY ICONS
  =========================================================
  */

  const amenityIcons = {
    wifi: {
      icon: <Wifi size={13} />,
      label: 'WiFi',
    },

    ac: {
      icon: <Wind size={13} />,
      label: 'AC',
    },

    usb: {
      icon: <Zap size={13} />,
      label: 'USB',
    },
  }

  /*
  =========================================================
  SELECT SEAT
  =========================================================
  */

  const handleSelectSeat = () => {
    // Make sure MongoDB ID exists
    if (!mongoId) {
      console.error(
        'Bus MongoDB ID is missing:',
        bus
      )

      return
    }

    /*
    ---------------------------------------------------------
    Preserve the COMPLETE MongoDB bus object.
    This is important because SeatSelection and Payment
    may need fields such as _id, seats, busType, etc.
    ---------------------------------------------------------
    */

    const selectedBusData = {
      ...bus,

      /*
      MongoDB ID
      */
      _id: bus._id || mongoId,

      /*
      Frontend-compatible ID
      */
      id: mongoId,

      /*
      Display fields
      */
      operator,
      type,
      from,
      to,
      departure,
      arrival,
      duration,
      price,
      totalSeats,
      availableSeats,
      rating,
      amenities,

      /*
      Journey date
      */
      date: journeyDate,

      /*
      Keep MongoDB field names too
      */
      busType:
        bus.busType || type,

      departureTime:
        bus.departureTime || departure,

      arrivalTime:
        bus.arrivalTime || arrival,
    }

    /*
    =======================================================
    DEBUG INFORMATION
    =======================================================
    */

    console.log(
      '========================================'
    )

    console.log(
      '[BUS SELECTED]'
    )

    console.log(
      'MongoDB Bus ID:',
      selectedBusData._id
    )

    console.log(
      'Operator:',
      selectedBusData.operator
    )

    console.log(
      'Route:',
      `${selectedBusData.from} → ${selectedBusData.to}`
    )

    console.log(
      'Bus:',
      selectedBusData
    )

    console.log(
      '========================================'
    )

    /*
    =======================================================
    SAVE SELECTED BUS
    =======================================================
    */

    sessionStorage.setItem(
      'selected_bus',
      JSON.stringify(selectedBusData)
    )

    /*
    =======================================================
    NAVIGATE TO SEAT SELECTION
    =======================================================
    */

    navigate('/seats', {
      state: {
        bus: selectedBusData,
        date: journeyDate,
      },
    })
  }

  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <div
      className="bus-card card"
      id={`bus-card-${mongoId}`}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bus-card__header">

        <div>

          <h3 className="bus-operator">
            {operator}
          </h3>

          <span className="bus-type badge badge-gold">
            {type}
          </span>

        </div>

        <div className="bus-rating">

          <Star
            size={14}
            fill="currentColor"
          />

          <span>
            {rating.toFixed(1)}
          </span>

        </div>

      </div>

      {/* =================================================
          ROUTE
      ================================================= */}

      <div className="bus-card__route">

        {/* Departure */}

        <div className="route-point">

          <span className="route-time">
            {departure}
          </span>

          <span className="route-city">
            {from}
          </span>

        </div>

        {/* Middle */}

        <div className="route-middle">

          <span className="route-duration">

            <Clock size={12} />

            {duration}

          </span>

          <div className="route-line">

            <span className="route-dot route-dot--start" />

            <span className="route-bar" />

            <span className="route-dot route-dot--end" />

          </div>

        </div>

        {/* Arrival */}

        <div className="route-point route-point--right">

          <span className="route-time">
            {arrival}
          </span>

          <span className="route-city">
            {to}
          </span>

        </div>

      </div>

      {/* =================================================
          AMENITIES & SEATS
      ================================================= */}

      <div className="bus-card__meta">

        <div className="bus-amenities">

          {amenities.map((a) => {

            const amenity =
              amenityIcons[
              String(a).toLowerCase()
              ]

            // Ignore unsupported amenities
            if (!amenity) {
              return null
            }

            return (
              <span
                key={a}
                className="amenity-tag"
                title={amenity.label}
              >

                {amenity.icon}

                {amenity.label}

              </span>
            )
          })}

        </div>

        <span className="seats-badge">

          <MapPin size={12} />

          {availableSeats} seats left

        </span>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="bus-card__footer">

        <div className="bus-price">

          <span className="price-from">
            Fare
          </span>

          <span className="price-amount">
            ₹{price}
          </span>

        </div>

        <button
          id={`select-seat-${mongoId}`}
          className="btn-primary"
          onClick={handleSelectSeat}
          disabled={!mongoId}
        >
          Select Seat
        </button>

      </div>

    </div>
  )
}

export default BusCard