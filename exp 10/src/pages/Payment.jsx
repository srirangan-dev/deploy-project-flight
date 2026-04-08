import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const {
    selectedFlight, selectedClass, passengerInfo,
    selectedSeat, addBooking, resetBookingFlow, user,
  } = useBooking();

  const [method,     setMethod]     = useState("card");
  const [card,       setCard]       = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId,      setUpiId]      = useState("");
  const [processing, setProcessing] = useState(false);
  const [done,       setDone]       = useState(false);
  const [newBooking, setNewBooking] = useState(null);
  const [error,      setError]      = useState("");

  useEffect(() => {
    if (!selectedFlight || !user) navigate("/");
  }, []);

  if (!selectedFlight) return null;

  const base    = selectedFlight.prices[selectedClass];
  const seatFee = selectedSeat?.price || 0;
  const tax     = Math.floor(base * 0.12);
  const total   = base + seatFee + tax;

  // ✅ Clear error on any input interaction
  const clearError = () => { if (error) setError(""); };

  const setC = (k, v) => { setCard((c) => ({ ...c, [k]: v })); clearError(); };

  const formatCard = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v) => {
    const n = v.replace(/\D/g, "").slice(0, 4);
    return n.length >= 3 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
  };

  // ✅ Clear error when switching payment method
  const handleMethodChange = (v) => {
    setMethod(v);
    setError("");
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    try {
      const booking = await addBooking({
        flight:        selectedFlight,
        passenger:     passengerInfo,
        seat:          selectedSeat?.id,
        travelClass:   selectedClass,
        totalAmount:   total,
        paymentMethod: method,
      });
      setNewBooking(booking);
      setDone(true);
      resetBookingFlow();
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────
  if (done && newBooking) {
    return (
      <div className="page-wrapper">
        <div className="container success-page fade-up">
          <div className="success-icon">✓</div>
          <h1>Booking <span className="gold">Confirmed!</span></h1>
          <p className="muted">Your flight has been booked successfully.</p>
          <div className="card success-detail">
            <div className="success-row">
              <span>Booking ID</span>
              <strong className="gold">{newBooking.bookingId}</strong>
            </div>
            <div className="success-row">
              <span>Flight</span>
              <strong>{newBooking.flight.from} → {newBooking.flight.to}</strong>
            </div>
            <div className="success-row">
              <span>Date</span>
              <strong>{newBooking.flight.date}</strong>
            </div>
            <div className="success-row">
              <span>Passenger</span>
              <strong>{newBooking.passenger?.firstName} {newBooking.passenger?.lastName}</strong>
            </div>
            <div className="success-row">
              <span>Class</span>
              <strong style={{ textTransform: "capitalize" }}>{newBooking.travelClass}</strong>
            </div>
            {newBooking.seat && (
              <div className="success-row">
                <span>Seat</span>
                <strong>{newBooking.seat}</strong>
              </div>
            )}
            <div className="success-row">
              <span>Amount Paid</span>
              <strong className="gold">₹{total.toLocaleString("en-IN")}</strong>
            </div>
          </div>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate("/history")}>View Ticket</button>
            <button className="btn-outline" onClick={() => navigate("/")}>Book Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container payment-page fade-up">
        <div className="booking-header">
          <button className="btn-ghost back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h1>Secure <span className="gold">Payment</span></h1>
        </div>

        <div className="payment-layout">
          <div className="payment-form card">

            {/* ── Method tabs ── */}
            <div className="method-tabs">
              {[
                { v: "card",       l: "💳 Card" },
                { v: "upi",        l: "📱 UPI" },
                { v: "netbanking", l: "🏦 Net Banking" },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  className={`method-tab ${method === v ? "active" : ""}`}
                  onClick={() => handleMethodChange(v)}   // ✅ clears error
                  type="button"
                >
                  {l}
                </button>
              ))}
            </div>

            <form onSubmit={handlePay}>

              {/* ── Card ── */}
              {method === "card" && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      value={card.number}
                      onChange={(e) => setC("number", formatCard(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      value={card.name}
                      onChange={(e) => setC("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="card-row">
                    <div className="form-group">
                      <label>Expiry</label>
                      <input
                        value={card.expiry}
                        onChange={(e) => setC("expiry", formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        value={card.cvv}
                        onChange={(e) => setC("cvv", e.target.value.slice(0, 3))}
                        placeholder="•••"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── UPI ── */}
              {method === "upi" && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); clearError(); }}  // ✅
                    placeholder="yourname@paytm"
                    required
                  />
                </div>
              )}

              {/* ── Net Banking ── */}
              {method === "netbanking" && (
                <div className="netbanking-grid">
                  {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map((b) => (
                    <label key={b} className="bank-option">
                      <input
                        type="radio"
                        name="bank"
                        value={b}
                        onChange={clearError}   // ✅
                        required
                      />
                      <span className="bank-name">{b}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* ── Error ── */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  background: "#2d1414", border: "1px solid #e74c3c",
                  borderRadius: 6, padding: "8px 12px", marginTop: 8,
                }}>
                  <p style={{ color: "#e74c3c", margin: 0, fontSize: 14 }}>
                    ⚠ {error}
                  </p>
                  {/* ✅ Manual dismiss button */}
                  <button
                    type="button"
                    onClick={() => setError("")}
                    style={{
                      background: "none", border: "none",
                      color: "#e74c3c", cursor: "pointer",
                      fontSize: 16, lineHeight: 1, padding: "0 4px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary pay-btn"
                disabled={processing}
              >
                {processing ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")}`}
              </button>
            </form>

            <div className="secure-badge">🔒 256-bit SSL Secured · PCI DSS Compliant</div>
          </div>

          {/* ── Order summary ── */}
          <div className="payment-summary card">
            <h3>Order Summary</h3>
            <div className="divider" />
            <div className="sum-flight">
              <div className="sf-route">{selectedFlight.from} → {selectedFlight.to}</div>
              <div className="sf-meta muted">{selectedFlight.airline} · {selectedFlight.flightNumber}</div>
              <div className="sf-meta muted">
                {selectedFlight.date} · {selectedFlight.departure} – {selectedFlight.arrival}
              </div>
              <div className="sf-meta muted">
                Passenger: {passengerInfo.firstName} {passengerInfo.lastName}
              </div>
              <div className="sf-meta muted" style={{ textTransform: "capitalize" }}>
                Class: {selectedClass}
              </div>
              {selectedSeat && (
                <div className="sf-meta muted">Seat: {selectedSeat.id}</div>
              )}
            </div>
            <div className="divider" />
            <div className="price-row"><span>Base Fare</span><span>₹{base.toLocaleString("en-IN")}</span></div>
            {seatFee > 0 && (
              <div className="price-row"><span>Seat Fee</span><span>₹{seatFee}</span></div>
            )}
            <div className="price-row"><span>Tax (12%)</span><span>₹{tax.toLocaleString("en-IN")}</span></div>
            <div className="divider" />
            <div className="price-row total">
              <span>Total</span>
              <span className="gold">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}