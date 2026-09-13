import './SeatLayout.css'

const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

// Realistic demo booked seats for South Indian bus
const DEFAULT_BOOKED_SEATS = ['A3', 'B1', 'C4', 'D2', 'F3', 'G1', 'H4', 'I2']

function SeatLayout({ selectedSeats = [], onSeatToggle }) {
  const getStatus = (seatNumber) => {
    if (DEFAULT_BOOKED_SEATS.includes(seatNumber)) return 'booked'
    if (selectedSeats.includes(seatNumber)) return 'selected'
    return 'available'
  }

  return (
    <div className="seat-layout">
      {/* Legend */}
      <div className="seat-legend">
        {[
          { cls: 'available', label: 'Available' },
          { cls: 'selected',  label: 'Selected'  },
          { cls: 'booked',    label: 'Booked'    },
        ].map(({ cls, label }) => (
          <span key={cls} className="legend-item">
            <span className={`legend-dot legend-dot--${cls}`} />
            {label}
          </span>
        ))}
      </div>

      {/* Bus body */}
      <div className="seat-bus">
        <div className="seat-bus__front">
          <span className="driver-label">🚌 Driver Cabin</span>
          <span className="door-label">Entry 🚪</span>
        </div>

        <div className="seat-grid">
          {ROW_LETTERS.map((letter) => {
            const leftWindow = `${letter}1`
            const leftAisle  = `${letter}2`
            const rightAisle = `${letter}3`
            const rightWindow = `${letter}4`

            const rowSeats = [leftWindow, leftAisle, null, rightAisle, rightWindow]

            return (
              <div key={letter} className="seat-row">
                <span className="row-letter-badge">{letter}</span>
                {rowSeats.map((seatNum, idx) =>
                  seatNum === null ? (
                    <span key="aisle" className="seat-aisle" title="Aisle" />
                  ) : (
                    <button
                      key={seatNum}
                      id={`seat-${seatNum}`}
                      type="button"
                      className={`seat seat--${getStatus(seatNum)}`}
                      disabled={getStatus(seatNum) === 'booked'}
                      onClick={() => onSeatToggle && onSeatToggle(seatNum)}
                      title={`Seat ${seatNum} – ${getStatus(seatNum)}`}
                    >
                      {seatNum}
                    </button>
                  )
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SeatLayout

