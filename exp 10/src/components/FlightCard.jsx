import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import "./FlightCard.css";






export default function FlightCard({ flight }) {
  const navigate = useNavigate();
  const { setSelectedFlight, setSelectedClass } = useBooking();

  const handleSelect = (cls) => {
    setSelectedFlight(flight);
    setSelectedClass(cls);
    navigate(`/booking/${flight.id}`);
  };

  const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;

  return (
    <div className="flight-card fade-up">
      <div className="flight-main">
        <div className="airline-info">
          <div className="airline-logo">{flight.airlineCode}</div>
          <div>
            <div className="airline-name">{flight.airline}</div>
            <div className="flight-num">{flight.flightNumber}</div>
          </div>
        </div>



        
        <div className="flight-route">
          <div className="route-time">
            <div className="time">{flight.departure}</div>
            <div className="airport-code">{flight.from}</div>
          </div>
          <div className="route-middle">
            <div className="route-duration">{flight.duration}</div>
            <div className="route-line">
              <span className="dot" />
              <div className="line" />
              {flight.stops > 0 && <div className="stop-dot" />}
              <div className="line" />
              <span className="plane-icon">✈</span>
            </div>
            <div className="route-stops">
              {flight.stops === 0 ? (
                <span className="badge badge-green">Non-stop</span>
              ) : (
                <span className="badge badge-blue">{flight.stops} Stop</span>
              )}
            </div>
          </div>
          <div className="route-time">
            <div className="time">{flight.arrival}</div>
            <div className="airport-code">{flight.to}</div>
          </div>
        </div>

        <div className="flight-amenities">
          {flight.amenities.map((a) => (
            <span key={a} className="amenity">{a}</span>
          ))}
          <span className="seats-left">{flight.seatsLeft} seats left</span>
        </div>
      </div>

      <div className="flight-classes">
        {[
          { key: "economy", label: "Economy" },
          { key: "business", label: "Business" },
          { key: "first", label: "First" },
        ].map(({ key, label }) => (
          <div key={key} className="class-option">
            <div className="class-label">{label}</div>
            <div className="class-price">{formatPrice(flight.prices[key])}</div>
            <button className="btn-primary select-btn" onClick={() => handleSelect(key)}>
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
