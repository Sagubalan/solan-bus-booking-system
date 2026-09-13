import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Bus, RotateCcw, Calendar, MapPin, IndianRupee, Sparkles } from 'lucide-react'
import { SOUTH_INDIAN_BUSES, BUS_TYPES, CITIES } from '../data/busData'
import BusCard from '../components/BusCard'
import Loading from '../components/Loading'
import './BusList.css'

function BusList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialFrom = searchParams.get('from') || 'Chennai'
  const initialTo   = searchParams.get('to')   || 'Madurai'
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0]

  const [fromCity, setFromCity] = useState(initialFrom)
  const [toCity, setToCity]     = useState(initialTo)
  const [travelDate, setTravelDate] = useState(initialDate)

  const [selectedTypes, setSelectedTypes] = useState([])
  const [timeFilter, setTimeFilter]       = useState('all') // all, morning, afternoon, evening, night
  const [maxPrice, setMaxPrice]           = useState(1600)
  const [sortBy, setSortBy]               = useState('cheapest') // cheapest, earliest, latest, rating

  // Handle bus type checkbox
  const toggleBusType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  // Reset filters
  const resetFilters = () => {
    setFromCity('')
    setToCity('')
    setSelectedTypes([])
    setTimeFilter('all')
    setMaxPrice(1600)
    setSortBy('cheapest')
  }

  // Filtered and sorted buses
  const filteredBuses = useMemo(() => {
    return SOUTH_INDIAN_BUSES.filter(bus => {
      // From city filter
      if (fromCity && !bus.from.toLowerCase().includes(fromCity.toLowerCase())) {
        return false
      }
      // To city filter
      if (toCity && !bus.to.toLowerCase().includes(toCity.toLowerCase())) {
        return false
      }
      // Bus type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(bus.type)) {
        return false
      }
      // Price filter
      if (bus.price > maxPrice) {
        return false
      }
      // Departure time filter
      const hour = parseInt(bus.departure.split(':')[0], 10)
      if (timeFilter === 'morning' && (hour < 5 || hour >= 12)) return false
      if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) return false
      if (timeFilter === 'evening' && (hour < 17 || hour >= 21)) return false
      if (timeFilter === 'night' && (hour < 21 && hour >= 5)) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'cheapest') return a.price - b.price
      if (sortBy === 'earliest') return a.departure.localeCompare(b.departure)
      if (sortBy === 'latest')   return b.departure.localeCompare(a.departure)
      if (sortBy === 'rating')   return b.rating - a.rating
      return 0
    })
  }, [fromCity, toCity, selectedTypes, timeFilter, maxPrice, sortBy])

  return (
    <div className="buslist-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="demo-pill" style={{ marginBottom: '0.6rem', background: 'rgba(201,168,76,0.15)', borderColor: 'var(--gold)', color: 'var(--gold-light)' }}>
            <Sparkles size={13} /> South Indian Bus Services • Demo Data
          </div>
          <h1>
            <Bus size={28} style={{ display:'inline', marginRight:'0.5rem', verticalAlign:'middle' }} />
            Available South Indian Buses
          </h1>
          <p>
            {fromCity || 'All Origin Cities'} → {toCity || 'All Destinations'} &nbsp;|&nbsp;
            Date: {travelDate} &nbsp;|&nbsp;
            <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}> {filteredBuses.length} buses found</span>
          </p>
        </div>
      </div>

      <div className="container buslist-layout">
        {/* Sidebar Filters */}
        <aside className="buslist-sidebar">
          <div className="filter-card">
            <div className="filter-card__header">
              <h3 className="filter-heading">
                <SlidersHorizontal size={16} /> Filters
              </h3>
              <button
                type="button"
                className="filter-reset-btn"
                onClick={resetFilters}
                title="Reset all filters"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            {/* From City */}
            <div className="filter-group">
              <label htmlFor="filter-from-input" className="filter-label">
                <MapPin size={12} /> From City
              </label>
              <input
                id="filter-from-input"
                type="text"
                className="filter-text-input"
                placeholder="Type or clear city"
                value={fromCity}
                onChange={e => setFromCity(e.target.value)}
              />
            </div>

            {/* To City */}
            <div className="filter-group">
              <label htmlFor="filter-to-input" className="filter-label">
                <MapPin size={12} /> To City
              </label>
              <input
                id="filter-to-input"
                type="text"
                className="filter-text-input"
                placeholder="Type or clear city"
                value={toCity}
                onChange={e => setToCity(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="filter-group">
              <label htmlFor="filter-date-input" className="filter-label">
                <Calendar size={12} /> Journey Date
              </label>
              <input
                id="filter-date-input"
                type="date"
                className="filter-text-input"
                value={travelDate}
                onChange={e => setTravelDate(e.target.value)}
              />
            </div>

            {/* Max Price Range Slider */}
            <div className="filter-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="filter-price-slider" className="filter-label">Max Price</label>
                <span className="filter-price-val">₹{maxPrice}</span>
              </div>
              <input
                id="filter-price-slider"
                type="range"
                min="350"
                max="1600"
                step="50"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="filter-range"
              />
              <div className="filter-range-labels">
                <span>₹350</span>
                <span>₹1,600</span>
              </div>
            </div>

            {/* Departure Time */}
            <div className="filter-group">
              <label className="filter-label">Departure Time</label>
              <div className="time-filter-pills">
                {[
                  { id: 'all',       label: 'Anytime' },
                  { id: 'morning',   label: 'Morning (5AM-12PM)' },
                  { id: 'afternoon', label: 'Afternoon (12PM-5PM)' },
                  { id: 'evening',   label: 'Evening (5PM-9PM)' },
                  { id: 'night',     label: 'Night (9PM-5AM)' },
                ].map(t => (
                  <label key={t.id} className={`time-pill ${timeFilter === t.id ? 'time-pill--active' : ''}`}>
                    <input
                      type="radio"
                      name="timeFilter"
                      value={t.id}
                      checked={timeFilter === t.id}
                      onChange={() => setTimeFilter(t.id)}
                      style={{ display: 'none' }}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Bus Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Bus Types</label>
              <div className="checkbox-scroll-list">
                {BUS_TYPES.map(type => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      id={`filter-type-${type.replace(/\s+/g, '-').toLowerCase()}`}
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleBusType(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="buslist-results">
          {/* Toolbar */}
          <div className="buslist-toolbar">
            <span className="buslist-count">
              Showing <strong>{filteredBuses.length}</strong> South Indian Buses
            </span>

            <div className="sort-group">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="cheapest">Cheapest (Price Low to High)</option>
                <option value="earliest">Earliest Departure</option>
                <option value="latest">Latest Departure</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Bus Cards List */}
          {filteredBuses.length === 0 ? (
            <div className="no-buses-found card">
              <Bus size={48} className="no-buses-icon" />
              <h3>No buses match your filters</h3>
              <p>Try clearing your city filters or broadening the price range to view South Indian routes.</p>
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={resetFilters}
              >
                Show All South Indian Buses
              </button>
            </div>
          ) : (
            <div className="bus-cards-list">
              {filteredBuses.map(bus => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  date={travelDate}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default BusList

