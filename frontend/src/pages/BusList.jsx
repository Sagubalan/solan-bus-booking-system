import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SlidersHorizontal,
  Bus,
  RotateCcw,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react'
import { BUS_TYPES } from '../data/busData'
import { busAPI } from '../services/api'
import BusCard from '../components/BusCard'
import Loading from '../components/Loading'
import './BusList.css'

function BusList() {
  const [searchParams] = useSearchParams()

  const initialFrom =
    searchParams.get('from') || 'Chennai'

  const initialTo =
    searchParams.get('to') || 'Madurai'

  const initialDate =
    searchParams.get('date') ||
    new Date().toISOString().split('T')[0]

  const [fromCity, setFromCity] =
    useState(initialFrom)

  const [toCity, setToCity] =
    useState(initialTo)

  const [travelDate, setTravelDate] =
    useState(initialDate)

  const [buses, setBuses] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [selectedTypes, setSelectedTypes] =
    useState([])

  const [timeFilter, setTimeFilter] =
    useState('all')

  const [maxPrice, setMaxPrice] =
    useState(1600)

  const [sortBy, setSortBy] =
    useState('cheapest')

  /* =====================================================
     LOAD BUSES FROM MONGODB
  ===================================================== */

  useEffect(() => {
    const loadBuses = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await busAPI.getAll()

        console.log(
          '[BUS API RESPONSE]',
          response
        )

        const mongoBuses =
          response?.data ||
          response?.buses ||
          response ||
          []

        console.log(
          '[MONGODB BUSES]',
          mongoBuses
        )

        setBuses(
          Array.isArray(mongoBuses)
            ? mongoBuses
            : []
        )
      } catch (err) {
        console.error(
          '[LOAD BUSES ERROR]',
          err
        )

        setError(
          err.message ||
          'Unable to load buses from server.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadBuses()
  }, [])

  /* =====================================================
     TOGGLE BUS TYPE
  ===================================================== */

  const toggleBusType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const resetFilters = () => {
    setFromCity('')
    setToCity('')
    setSelectedTypes([])
    setTimeFilter('all')
    setMaxPrice(1600)
    setSortBy('cheapest')
  }

  /* =====================================================
     FILTER + SORT MONGODB BUSES
  ===================================================== */

  const filteredBuses = useMemo(() => {
    return buses
      .filter(bus => {

        const busFrom =
          bus.from || ''

        const busTo =
          bus.to || ''

        const busType =
          bus.busType ||
          bus.type ||
          ''

        const busPrice =
          Number(bus.price || 0)

        const departure =
          bus.departureTime ||
          bus.departure ||
          '00:00'

        /* From city */

        if (
          fromCity &&
          !busFrom
            .toLowerCase()
            .includes(
              fromCity.toLowerCase()
            )
        ) {
          return false
        }

        /* To city */

        if (
          toCity &&
          !busTo
            .toLowerCase()
            .includes(
              toCity.toLowerCase()
            )
        ) {
          return false
        }

        /* Bus type */

        if (
          selectedTypes.length > 0 &&
          !selectedTypes.includes(busType)
        ) {
          return false
        }

        /* Price */

        if (busPrice > maxPrice) {
          return false
        }

        /* Departure */

        const hour =
          parseInt(
            departure.split(':')[0],
            10
          )

        if (
          timeFilter === 'morning' &&
          (hour < 5 || hour >= 12)
        ) {
          return false
        }

        if (
          timeFilter === 'afternoon' &&
          (hour < 12 || hour >= 17)
        ) {
          return false
        }

        if (
          timeFilter === 'evening' &&
          (hour < 17 || hour >= 21)
        ) {
          return false
        }

        if (
          timeFilter === 'night' &&
          (hour < 21 && hour >= 5)
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => {

        const priceA =
          Number(a.price || 0)

        const priceB =
          Number(b.price || 0)

        const departureA =
          a.departureTime ||
          a.departure ||
          '00:00'

        const departureB =
          b.departureTime ||
          b.departure ||
          '00:00'

        const ratingA =
          Number(a.rating || 0)

        const ratingB =
          Number(b.rating || 0)

        if (
          sortBy === 'cheapest'
        ) {
          return priceA - priceB
        }

        if (
          sortBy === 'earliest'
        ) {
          return departureA.localeCompare(
            departureB
          )
        }

        if (
          sortBy === 'latest'
        ) {
          return departureB.localeCompare(
            departureA
          )
        }

        if (
          sortBy === 'rating'
        ) {
          return ratingB - ratingA
        }

        return 0
      })
  }, [
    buses,
    fromCity,
    toCity,
    selectedTypes,
    timeFilter,
    maxPrice,
    sortBy
  ])

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="buslist-page">
        <div className="container">
          <Loading />
        </div>
      </div>
    )
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="buslist-page">
        <div className="container">
          <div className="card">
            <Bus size={48} />

            <h2>
              Unable to load buses
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="buslist-page">

      {/* PAGE HEADER */}

      <div className="page-header">
        <div className="container">

          <div
            className="demo-pill"
            style={{
              marginBottom: '0.6rem',
              background:
                'rgba(201,168,76,0.15)',
              borderColor:
                'var(--gold)',
              color:
                'var(--gold-light)'
            }}
          >
            <Sparkles size={13} />

            South Indian Bus Services
          </div>

          <h1>
            <Bus
              size={28}
              style={{
                display: 'inline',
                marginRight: '0.5rem',
                verticalAlign: 'middle'
              }}
            />

            Available South Indian Buses
          </h1>

          <p>
            {fromCity ||
              'All Origin Cities'}

            {' → '}

            {toCity ||
              'All Destinations'}

            &nbsp;|&nbsp;

            Date: {travelDate}

            &nbsp;|&nbsp;

            <span
              style={{
                color:
                  'var(--gold-light)',
                fontWeight: 600
              }}
            >
              {filteredBuses.length}
              {' '}
              buses found
            </span>
          </p>

        </div>
      </div>

      <div className="container buslist-layout">

        {/* SIDEBAR */}

        <aside className="buslist-sidebar">

          <div className="filter-card">

            <div className="filter-card__header">

              <h3 className="filter-heading">
                <SlidersHorizontal
                  size={16}
                />

                Filters
              </h3>

              <button
                type="button"
                className="filter-reset-btn"
                onClick={resetFilters}
              >
                <RotateCcw
                  size={13}
                />

                Reset
              </button>

            </div>

            {/* FROM */}

            <div className="filter-group">

              <label
                htmlFor="filter-from-input"
                className="filter-label"
              >
                <MapPin size={12} />

                From City
              </label>

              <input
                id="filter-from-input"
                type="text"
                className="filter-text-input"
                placeholder="Type or clear city"
                value={fromCity}
                onChange={e =>
                  setFromCity(
                    e.target.value
                  )
                }
              />

            </div>

            {/* TO */}

            <div className="filter-group">

              <label
                htmlFor="filter-to-input"
                className="filter-label"
              >
                <MapPin size={12} />

                To City
              </label>

              <input
                id="filter-to-input"
                type="text"
                className="filter-text-input"
                placeholder="Type or clear city"
                value={toCity}
                onChange={e =>
                  setToCity(
                    e.target.value
                  )
                }
              />

            </div>

            {/* DATE */}

            <div className="filter-group">

              <label
                htmlFor="filter-date-input"
                className="filter-label"
              >
                <Calendar size={12} />

                Journey Date
              </label>

              <input
                id="filter-date-input"
                type="date"
                className="filter-text-input"
                value={travelDate}
                onChange={e =>
                  setTravelDate(
                    e.target.value
                  )
                }
              />

            </div>

            {/* PRICE */}

            <div className="filter-group">

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center'
                }}
              >

                <label
                  htmlFor="filter-price-slider"
                  className="filter-label"
                >
                  Max Price
                </label>

                <span className="filter-price-val">
                  ₹{maxPrice}
                </span>

              </div>

              <input
                id="filter-price-slider"
                type="range"
                min="350"
                max="1600"
                step="50"
                value={maxPrice}
                onChange={e =>
                  setMaxPrice(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="filter-range"
              />

              <div className="filter-range-labels">
                <span>₹350</span>
                <span>₹1,600</span>
              </div>

            </div>

            {/* TIME */}

            <div className="filter-group">

              <label className="filter-label">
                Departure Time
              </label>

              <div className="time-filter-pills">

                {[
                  {
                    id: 'all',
                    label: 'Anytime'
                  },
                  {
                    id: 'morning',
                    label:
                      'Morning (5AM-12PM)'
                  },
                  {
                    id: 'afternoon',
                    label:
                      'Afternoon (12PM-5PM)'
                  },
                  {
                    id: 'evening',
                    label:
                      'Evening (5PM-9PM)'
                  },
                  {
                    id: 'night',
                    label:
                      'Night (9PM-5AM)'
                  }
                ].map(t => (

                  <label
                    key={t.id}
                    className={
                      `time-pill ${timeFilter === t.id
                        ? 'time-pill--active'
                        : ''
                      }`
                    }
                  >

                    <input
                      type="radio"
                      name="timeFilter"
                      value={t.id}
                      checked={
                        timeFilter === t.id
                      }
                      onChange={() =>
                        setTimeFilter(
                          t.id
                        )
                      }
                      style={{
                        display: 'none'
                      }}
                    />

                    {t.label}

                  </label>

                ))}

              </div>

            </div>

            {/* BUS TYPES */}

            <div className="filter-group">

              <label className="filter-label">
                Bus Types
              </label>

              <div className="checkbox-scroll-list">

                {BUS_TYPES.map(type => (

                  <label
                    key={type}
                    className="filter-checkbox"
                  >

                    <input
                      type="checkbox"
                      checked={
                        selectedTypes.includes(
                          type
                        )
                      }
                      onChange={() =>
                        toggleBusType(
                          type
                        )
                      }
                    />

                    <span>
                      {type}
                    </span>

                  </label>

                ))}

              </div>

            </div>

          </div>

        </aside>

        {/* RESULTS */}

        <section className="buslist-results">

          <div className="buslist-toolbar">

            <span className="buslist-count">
              Showing
              {' '}
              <strong>
                {filteredBuses.length}
              </strong>
              {' '}
              South Indian Buses
            </span>

            <div className="sort-group">

              <label
                htmlFor="sort-select"
                className="sort-label"
              >
                Sort by:
              </label>

              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={e =>
                  setSortBy(
                    e.target.value
                  )
                }
              >

                <option value="cheapest">
                  Cheapest (Price Low to High)
                </option>

                <option value="earliest">
                  Earliest Departure
                </option>

                <option value="latest">
                  Latest Departure
                </option>

                <option value="rating">
                  Highest Customer Rating
                </option>

              </select>

            </div>

          </div>

          {/* NO BUSES */}

          {filteredBuses.length === 0 ? (

            <div className="no-buses-found card">

              <Bus
                size={48}
                className="no-buses-icon"
              />

              <h3>
                No buses match your filters
              </h3>

              <p>
                Try clearing your city
                filters or broadening
                the price range.
              </p>

              <button
                type="button"
                className="btn-primary"
                style={{
                  marginTop: '1rem'
                }}
                onClick={resetFilters}
              >
                Show All South Indian Buses
              </button>

            </div>

          ) : (

            <div className="bus-cards-list">

              {filteredBuses.map(bus => (

                <BusCard
                  key={bus._id}
                  bus={{
                    ...bus,

                    // MongoDB → Frontend mapping
                    id: bus._id,
                    type:
                      bus.busType,
                    departure:
                      bus.departureTime,
                    arrival:
                      bus.arrivalTime
                  }}
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