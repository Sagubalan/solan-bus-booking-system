import './SeatLayout.css'

const ROW_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
]

// Fallback demo booked seats
// Used only when MongoDB seat data is not available
const DEFAULT_BOOKED_SEATS = [
  'A3',
  'B1',
  'C4',
  'D2',
  'F3',
  'G1',
  'H4',
  'I2',
]

function SeatLayout({
  selectedSeats = [],
  onSeatToggle,
  seats = [],
  totalSeats = 40,
  availableSeats = 0,
}) {

  /*
  =========================================================
  CHECK WHETHER MONGODB SEAT DATA EXISTS
  =========================================================
  */

  const hasMongoSeats =
    Array.isArray(seats) &&
    seats.length > 0

  /*
  =========================================================
  GET SEAT STATUS
  =========================================================
  */

  const getStatus = (seatNumber) => {

    // Selected seat has highest priority
    if (selectedSeats.includes(seatNumber)) {
      return 'selected'
    }

    /*
    ---------------------------------------------------------
    If MongoDB has seat information,
    use that information.
    ---------------------------------------------------------
    */

    if (hasMongoSeats) {

      const mongoSeat = seats.find(
        (seat) =>
          seat.seatNumber === seatNumber
      )

      if (mongoSeat) {
        return mongoSeat.isBooked
          ? 'booked'
          : 'available'
      }

      return 'available'
    }

    /*
    ---------------------------------------------------------
    Fallback for old/demo buses
    ---------------------------------------------------------
    */

    if (
      DEFAULT_BOOKED_SEATS.includes(
        seatNumber
      )
    ) {
      return 'booked'
    }

    return 'available'
  }

  /*
  =========================================================
  HANDLE SEAT CLICK
  =========================================================
  */

  const handleSeatClick = (seatNumber) => {

    const status =
      getStatus(seatNumber)

    if (status === 'booked') {
      return
    }

    if (onSeatToggle) {
      onSeatToggle(seatNumber)
    }
  }

  /*
  =========================================================
  CREATE SEAT GRID
  =========================================================
  */

  return (
    <div className="seat-layout">

      {/* =================================================
          LEGEND
      ================================================= */}

      <div className="seat-legend">

        {[
          {
            cls: 'available',
            label: 'Available',
          },
          {
            cls: 'selected',
            label: 'Selected',
          },
          {
            cls: 'booked',
            label: 'Booked',
          },
        ].map(
          ({ cls, label }) => (
            <span
              key={cls}
              className="legend-item"
            >
              <span
                className={`legend-dot legend-dot--${cls}`}
              />

              {label}
            </span>
          )
        )}

      </div>

      {/* =================================================
          BUS BODY
      ================================================= */}

      <div className="seat-bus">

        {/* =================================================
            DRIVER / FRONT
        ================================================= */}

        <div className="seat-bus__front">

          <span className="driver-label">
            🚌 Driver Cabin
          </span>

          <span className="door-label">
            Entry 🚪
          </span>

        </div>

        {/* =================================================
            SEAT GRID
        ================================================= */}

        <div className="seat-grid">

          {ROW_LETTERS.map(
            (letter) => {

              const leftWindow =
                `${letter}1`

              const leftAisle =
                `${letter}2`

              const rightAisle =
                `${letter}3`

              const rightWindow =
                `${letter}4`

              /*
              2 + 2 seat layout

              A1 A2 | A3 A4
              B1 B2 | B3 B4
              ...
              */

              const rowSeats = [
                leftWindow,
                leftAisle,
                null,
                rightAisle,
                rightWindow,
              ]

              return (
                <div
                  key={letter}
                  className="seat-row"
                >

                  {/* Row Letter */}

                  <span className="row-letter-badge">
                    {letter}
                  </span>

                  {/* Seats */}

                  {rowSeats.map(
                    (
                      seatNum,
                      idx
                    ) =>
                      seatNum === null ? (

                        /* Aisle */

                        <span
                          key={`aisle-${letter}`}
                          className="seat-aisle"
                          title="Aisle"
                        />

                      ) : (

                        /* Seat */

                        <button
                          key={seatNum}
                          id={`seat-${seatNum}`}
                          type="button"
                          className={`seat seat--${getStatus(
                            seatNum
                          )}`}
                          disabled={
                            getStatus(
                              seatNum
                            ) === 'booked'
                          }
                          onClick={() =>
                            handleSeatClick(
                              seatNum
                            )
                          }
                          title={`Seat ${seatNum} – ${getStatus(
                            seatNum
                          )}`}
                        >
                          {seatNum}
                        </button>

                      )
                  )}

                </div>
              )
            }
          )}

        </div>

      </div>

      {/* =================================================
          SEAT INFORMATION
      ================================================= */}

      <div
        className="seat-layout-info"
        style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '13px',
          opacity: 0.75,
        }}
      >
        <span>
          {totalSeats} total seats
        </span>

        {' • '}

        <span>
          {availableSeats} seats available
        </span>

      </div>

    </div>
  )
}

export default SeatLayout