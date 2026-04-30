import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import TicketCard from "../components/TicketCard";
import "./History.css";

export default function History() {
  const { bookings, user } = useBooking();

  
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
          <h2>Please <span className="gold">Login</span> to view bookings</h2>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container history-page fade-up">
        <h1>My <span className="gold">Bookings</span></h1>
        <p className="muted" style={{ marginTop: 4 }}>{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
        {bookings.length === 0 ? (
          <div className="card empty-state" style={{ marginTop: 32, textAlign: "center", padding: "60px 40px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✈</div>
            <h3>No bookings yet</h3>
            <p className="muted" style={{ margin: "8px 0 20px" }}>Start by searching for flights</p>
            <button className="btn-primary" onClick={() => navigate("/")}>Search Flights</button>
          </div>
        ) : (
          <div className="tickets-grid">
            {bookings.map((b) => <TicketCard key={b.bookingId} booking={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
