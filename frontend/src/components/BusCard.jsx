import { MapPin, Clock, Star, Wifi, Zap, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './BusCard.css'

function BusCard({ bus, date }) {
  const navigate = useNavigate()

  const {
    id = 'bus-001',
    operator = 'KPN Travels',
    type = 'AC Sleeper',
    from = 'Chennai',
    to = 'Madurai',
    departure = '20:30',
    arrival = '05:30',
    duration = '9h 00m',
    price = 650,
    totalSeats = 40,
    availableSeats = 14,
    rating = 4.7,
    amenities = ['wifi', 'ac', 'usb'],
  } = bus || {}

  const amenityIcons = {
    wifi: { icon: <Wifi size={13} />,  label: 'WiFi' },
    ac:   { icon: <Wind size={13} />,  label: 'AC'   },
    usb:  { icon: <Zap  size={13} />,  label: 'USB'  },
  }

  const handleSelectSeat = () => {
    const selectedBusData = {
      id,
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
      date: date || new Date().toISOString().split('T')[0],
    }
    sessionStorage.setItem('selected_bus', JSON.stringify(selectedBusData))
    navigate('/seats', { state: { bus: selectedBusData, date } })
  }

  return (
    <div className="bus-card card" id={`bus-card-${id}`}>
      {/* Header */}
      <div className="bus-card__header">
        <div>
          <h3 className="bus-operator">{operator}</h3>
          <span className="bus-type badge badge-gold">{type}</span>
        </div>
        <div className="bus-rating">
          <Star size={14} fill="currentColor" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Route */}
      <div className="bus-card__route">
        <div className="route-point">
          <span className="route-time">{departure}</span>
          <span className="route-city">{from}</span>
        </div>
        <div className="route-middle">
          <span className="route-duration"><Clock size={12} /> {duration}</span>
          <div className="route-line">
            <span className="route-dot route-dot--start" />
            <span className="route-bar" />
            <span className="route-dot route-dot--end" />
          </div>
        </div>
        <div className="route-point route-point--right">
          <span className="route-time">{arrival}</span>
          <span className="route-city">{to}</span>
        </div>
      </div>

      {/* Amenities & Seats */}
      <div className="bus-card__meta">
        <div className="bus-amenities">
          {amenities.map(a => amenityIcons[a] && (
            <span key={a} className="amenity-tag" title={amenityIcons[a].label}>
              {amenityIcons[a].icon}
              {amenityIcons[a].label}
            </span>
          ))}
        </div>
        <span className="seats-badge">
          <MapPin size={12} /> {availableSeats} seats left
        </span>
      </div>

      {/* Footer */}
      <div className="bus-card__footer">
        <div className="bus-price">
          <span className="price-from">Fare</span>
          <span className="price-amount">₹{price}</span>
        </div>
        <button
          id={`select-seat-${id}`}
          className="btn-primary"
          onClick={handleSelectSeat}
        >
          Select Seat
        </button>
      </div>
    </div>
  )
}

export default BusCard
