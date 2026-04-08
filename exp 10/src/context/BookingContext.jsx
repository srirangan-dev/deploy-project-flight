import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const BookingContext = createContext(null);

const reshapeBooking = (row) => ({
  bookingId:   row.booking_id,
  status:      row.status || "Confirmed",
  bookedAt:    row.booked_at || new Date().toISOString(),
  travelClass: row.travel_class,
  seat:        row.seat_number,
  totalAmount: Number(row.total_amount || row.paid_amount || 0),
  flight: {
    id:           row.flight_id,
    flightNumber: row.flight_number,
    airline:      row.airline,
    airlineCode:  row.airline_code,
    from:         row.from_code,
    to:           row.to_code,
    departure:    row.departure_time,
    arrival:      row.arrival_time,
    duration:     row.duration,
    stops:        row.stops,
    date:         row.flight_date,
  },
  passenger: {
    firstName: row.first_name,
    lastName:  row.last_name,
    email:     row.pax_email,
    phone:     row.pax_phone,
    gender:    row.gender,
  },
});

export function BookingProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("skybook_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [searchParams,   setSearchParams]   = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedClass,  setSelectedClass]  = useState("economy");
  const [passengerInfo,  setPassengerInfo]  = useState({
    firstName: "", lastName: "", email: "",
    phone: "", dob: "", gender: "", passportNo: "",
  });
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookings,     setBookings]     = useState([]);

  useEffect(() => {
    if (user) {
      api.getMyBookings()
        .then(data => { if (Array.isArray(data)) setBookings(data.map(reshapeBooking)); })
        .catch(() => {});
    } else {
      setBookings([]);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("skybook_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skybook_user");
    localStorage.removeItem("skybook_token");
    setBookings([]);
  };

  const addBooking = async (bookingData) => {
    const rawId    = bookingData.flight?.id ?? bookingData.flight?.flight_id ?? "";
    const flightId = parseInt(String(rawId).replace(/\D/g, ""), 10);
    const userId   = user?.id ?? user?.user_id ?? user?.userId;

    if (isNaN(flightId)) throw new Error("Invalid flight ID: " + rawId);
    if (!userId)         throw new Error("Missing user ID — please log in again");

    const payload = {
      flight_id:    flightId,
      flight:       bookingData.flight,      // ✅ full flight object — backend upserts it
      user_id:      userId,
      travel_class: bookingData.travelClass,
      seat_number:  bookingData.seat || null,
      total_amount: bookingData.totalAmount,
      passenger: {
        firstName:  bookingData.passenger?.firstName  || "",
        lastName:   bookingData.passenger?.lastName   || "",
        email:      bookingData.passenger?.email      || null,
        phone:      bookingData.passenger?.phone      || null,
        gender:     bookingData.passenger?.gender     || null,
        dob:        bookingData.passenger?.dob        || null,
        passportNo: bookingData.passenger?.passportNo || null,
      },
    };

    console.log("📦 PAYLOAD\n" + JSON.stringify(payload, null, 2));

    try {
      const bookingRes = await api.createBooking(payload);

      if (!bookingRes?.booking_row_id) {
        throw new Error("Server failed to return booking ID");
      }

      await api.processPayment({
        booking_id:     bookingRes.booking_row_id,
        amount:         bookingData.totalAmount,
        payment_method: bookingData.paymentMethod || "card",
      });

      const updated = await api.getMyBookings();
      if (Array.isArray(updated)) setBookings(updated.map(reshapeBooking));

      return {
        bookingId: bookingRes.booking_id,
        ...bookingData,
        status:   "Confirmed",
        bookedAt: new Date().toISOString(),
      };

    } catch (err) {
      console.error("Booking failed:", err.message);
      throw err;
    }
  };

  const resetBookingFlow = () => {
    setSelectedFlight(null);
    setSelectedClass("economy");
    setPassengerInfo({
      firstName: "", lastName: "", email: "",
      phone: "", dob: "", gender: "", passportNo: "",
    });
    setSelectedSeat(null);
  };

  return (
    <BookingContext.Provider value={{
      user, login, logout,
      searchParams,   setSearchParams,
      selectedFlight, setSelectedFlight,
      selectedClass,  setSelectedClass,
      passengerInfo,  setPassengerInfo,
      selectedSeat,   setSelectedSeat,
      bookings, addBooking,
      resetBookingFlow,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be inside BookingProvider");
  return ctx;
};