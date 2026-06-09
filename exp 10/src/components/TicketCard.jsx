import "./TicketCard.css";




export default function TicketCard({ booking }) {
  const {
    bookingId, flight, passenger, seat, travelClass,
    totalAmount, bookedAt, status,
  } = booking;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const statusColor = status === "Confirmed" ? "badge-green" : "badge-blue";

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <div className="ticket-brand">◈ SkyBook</div>
        <div className="ticket-status">
          <span className={`badge ${statusColor}`}>{status}</span>
        </div>
      </div>

      <div className="ticket-route">
        <div className="ticket-airport">
          <div className="ticket-code">{flight.from}</div>
          <div className="ticket-city">{flight.departure}</div>
        </div>
        <div className="ticket-line">
          <div className="ticket-duration">{flight.duration}</div>
          <div className="ticket-arrow">
            <div className="t-line" />
            <span>✈</span>
          </div>
          <div className="ticket-stops">
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
          </div>
        </div>
        <div className="ticket-airport" style={{ textAlign: "right" }}>
          <div className="ticket-code">{flight.to}</div>
          <div className="ticket-city">{flight.arrival}</div>
        </div>
      </div>

      <div className="ticket-divider">
        <div className="notch left" />
        <div className="dots" />
        <div className="notch right" />
      </div>

      <div className="ticket-details">
        <div className="ticket-detail">
          <span className="detail-label">Passenger</span>
          <span className="detail-value">{passenger.firstName} {passenger.lastName}</span>
        </div>
        <div className="ticket-detail">
          <span className="detail-label">Flight</span>
          <span className="detail-value">{flight.flightNumber}</span>
        </div>
        <div className="ticket-detail">
          <span className="detail-label">Date</span>
          <span className="detail-value">{flight.date}</span>
        </div>
        <div className="ticket-detail">
          <span className="detail-label">Seat</span>
          <span className="detail-value">{seat || "Any"}</span>
        </div>
        <div className="ticket-detail">
          <span className="detail-label">Class</span>
          <span className="detail-value" style={{ textTransform: "capitalize" }}>{travelClass}</span>
        </div>
        <div className="ticket-detail">
          <span className="detail-label">Airline</span>
          <span className="detail-value">{flight.airline}</span>
        </div>
      </div>

      <div className="ticket-footer">
        <div>
          <div className="booking-id">Booking ID: <strong>{bookingId}</strong></div>
          <div className="booked-on">Booked on {formatDate(bookedAt)}</div>
        </div>
        <div className="ticket-amount">₹{totalAmount?.toLocaleString("en-IN")}</div>
      </div>

      <div className="barcode">
        <div className="barcode-bars">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="bar" style={{ height: `${Math.random() * 24 + 16}px` }} />
          ))}
        </div>
        <div className="barcode-label">{bookingId}</div>
      </div>
    </div>
  );
}
