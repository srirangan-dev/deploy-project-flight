export const airports = [
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi International" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International" },
  { code: "MAA", city: "Chennai", name: "Chennai International" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International" },
  { code: "COK", city: "Kochi", name: "Cochin International" },
  { code: "PNQ", city: "Pune", name: "Pune International" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International" },
  { code: "GOI", city: "Goa", name: "Goa International" },
];



export const airlines = [
  { code: "AI", name: "Air India", logo: "✈" },
  { code: "6E", name: "IndiGo", logo: "✈" },
  { code: "SG", name: "SpiceJet", logo: "✈" },
  { code: "UK", name: "Vistara", logo: "✈" },
  { code: "G8", name: "Go First", logo: "✈" },
];



const randomDuration = (min, max) =>
  `${Math.floor(Math.random() * (max - min + 1)) + min}h ${[0, 15, 30, 45][Math.floor(Math.random() * 4)]}m`;

const randomTime = (baseHour) => {
  const h = String(baseHour % 24).padStart(2, "0");
  const m = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)];
  return `${h}:${m}`;
};

let flightId = 1;

const generateFlight = (from, to, date) => {
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const depHour = Math.floor(Math.random() * 20) + 4;
  const durationHours = Math.floor(Math.random() * 3) + 1;
  const dep = randomTime(depHour);
  const arr = randomTime(depHour + durationHours);
  const price = Math.floor(Math.random() * 8000) + 2500;
  const stops = Math.random() > 0.6 ? 0 : 1;
  const classes = {
    economy: price,
    business: Math.floor(price * 2.8),
    first: Math.floor(price * 5.2),
  };
  return {
    id: `FL${String(flightId++).padStart(4, "0")}`,
    airline: airline.name,
    airlineCode: airline.code,
    flightNumber: `${airline.code}${Math.floor(Math.random() * 900) + 100}`,
    from,
    to,
    departure: dep,
    arrival: arr,
    duration: `${durationHours}h ${[0, 15, 30, 45][Math.floor(Math.random() * 4)]}m`,
    stops,
    date,
    prices: classes,
    seatsLeft: Math.floor(Math.random() * 20) + 1,
    amenities: ["WiFi", "Meals", "Entertainment"].slice(0, Math.floor(Math.random() * 3) + 1),
  };
};

export const generateFlights = (from, to, date) => {
  const count = Math.floor(Math.random() * 4) + 4;
  return Array.from({ length: count }, () => generateFlight(from, to, date)).sort(
    (a, b) => a.departure.localeCompare(b.departure)
  );
};

export const seatLayout = () => {
  const rows = 28;
  const cols = ["A", "B", "C", "D", "E", "F"];
  const seats = [];
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const isBooked = Math.random() < 0.35;
      const isWindow = c === "A" || c === "F";
      const isAisle = c === "C" || c === "D";
      seats.push({
        id: `${r}${c}`,
        row: r,
        col: c,
        isBooked,
        isWindow,
        isAisle,
        extraLegroom: r <= 3,
        price: r <= 3 ? 600 : isWindow ? 300 : isAisle ? 150 : 0,
      });
    }
  }
  return seats;
};
