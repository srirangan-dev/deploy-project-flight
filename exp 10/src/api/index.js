const BASE = "https://skybook-backend-uf11.onrender.com/api";

const getToken = () => localStorage.getItem("skybook_token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ✅ Improved to handle HTTP errors properly
const req = (url, opts = {}) =>
  fetch(`${BASE}${url}`, { ...opts, headers: headers() }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || `Error ${r.status}: Server issue`);
    return data;
  });

export const api = {
  // Auth
  register: (data) => req("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login:    (data) => req("/auth/login",    { method: "POST", body: JSON.stringify(data) }),
  getMe:    ()     => req("/auth/me"),

  // Flights
  searchFlights: (from, to, date) => req(`/flights?from=${from}&to=${to}&date=${date}`),
  getFlightById: (id)             => req(`/flights/${id}`),

  // Bookings
  createBooking:  (data)      => req("/bookings",            { method: "POST",  body: JSON.stringify(data) }),
  getMyBookings:  ()          => req("/bookings/my"),
  cancelBooking:  (bookingId) => req(`/bookings/${bookingId}/cancel`, { method: "PATCH" }),

  // Payments
  processPayment: (data) => req("/payments", { method: "POST", body: JSON.stringify(data) }),
};
