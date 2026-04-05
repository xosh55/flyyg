module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const API_KEY = process.env.SERPAPI_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'SERPAPI_KEY not configured' });
  }
  
  const { origins, destination, destinations, outbound_date, return_date } = req.query;
  
  if (!outbound_date || !return_date) {
    return res.status(400).json({ error: 'outbound_date and return_date required (YYYY-MM-DD)' });
  }
  
  const originList = origins ? origins.split(',').map(s => s.trim()) : ['GOT'];
  
  try {
    let results = [];
    
    if (destination) {
      // MODE 1: Compare airports — one destination, multiple origins
      const promises = originList.map(origin => 
        searchFlight(API_KEY, origin, destination, outbound_date, return_date)
      );
      const responses = await Promise.all(promises);
      responses.forEach((data, i) => {
        results.push(...formatResults(data, originList[i]));
      });
      
    } else {
      // MODE 2: Explore — one origin, multiple destinations
      const destList = destinations 
        ? destinations.split(',').map(s => s.trim())
        : DEFAULT_DESTINATIONS.map(d => d.code);
      
      const primaryOrigin = originList[0] || 'GOT';
      const promises = destList.map(dest =>
        searchFlight(API_KEY, primaryOrigin, dest, outbound_date, return_date)
      );
      const responses = await Promise.all(promises);
      responses.forEach((data, i) => {
        results.push(...formatResults(data, primaryOrigin));
      });
    }
    
    // Sort by price ascending
    results.sort((a, b) => a.price - b.price);
    
    return res.status(200).json({ 
      results,
      count: results.length,
      searched_at: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('Flight search error:', err);
    return res.status(500).json({ error: 'Search failed', message: err.message });
  }
};

// --- Search one route via SerpAPI ---
async function searchFlight(apiKey, origin, destination, outDate, retDate) {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_flights');
  url.searchParams.set('departure_id', origin);
  url.searchParams.set('arrival_id', destination);
  url.searchParams.set('outbound_date', outDate);
  url.searchParams.set('return_date', retDate);
  url.searchParams.set('currency', 'SEK');
  url.searchParams.set('hl', 'sv');
  url.searchParams.set('type', '1'); // Round trip
  url.searchParams.set('travel_class', '1'); // Economy
  url.searchParams.set('adults', '1');
  url.searchParams.set('api_key', apiKey);
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error(`SerpAPI error for ${origin}->${destination}: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error(`Fetch error for ${origin}->${destination}:`, err.message);
    return null;
  }
}

// --- Extract flight results from SerpAPI response ---
function formatResults(data, origin) {
  if (!data) return [];
  
  const results = [];
  const flights = [
    ...(data.best_flights || []),
    ...(data.other_flights || [])
  ];
  
  for (const flight of flights) {
    if (!flight.price) continue;
    
    const legs = flight.flights || [];
    const outbound = legs[0] || {};
    const lastLeg = legs[legs.length - 1] || {};
    
    // Get destination from the arrival of outbound journey
    let destCode = '';
    let destName = '';
    
    // Find the midpoint (end of outbound, before return)
    // For round trips, SerpAPI groups outbound legs
    if (outbound.arrival_airport) {
      destCode = outbound.arrival_airport.id || '';
      destName = outbound.arrival_airport.name || '';
    }
    // If multiple legs, the last arrival before return is the destination
    if (legs.length > 0) {
      const lastOutbound = legs[legs.length - 1];
      if (lastOutbound && lastOutbound.arrival_airport) {
        destCode = lastOutbound.arrival_airport.id || destCode;
        destName = lastOutbound.arrival_airport.name || destName;
      }
    }
    
    // Get airline info
    const airlines = legs.map(l => l.airline).filter(Boolean);
    const uniqueAirlines = [...new Set(airlines)];
    
    // Departure and arrival times
    const depTime = outbound.departure_airport?.time || '';
    const arrTime = (legs.length > 0 ? legs[legs.length - 1] : outbound)?.arrival_airport?.time || '';
    
    // Calculate stops
    const stops = flight.layovers ? flight.layovers.length : Math.max(0, legs.length - 1);
    
    // Airline logos
    const airlineLogos = legs.map(l => l.airline_logo).filter(Boolean);
    
    results.push({
      origin: origin,
      destination_code: destCode,
      destination_name: destName,
      airlines: uniqueAirlines,
      airline_logos: [...new Set(airlineLogos)],
      price: flight.price,
      currency: 'SEK',
      departure_time: depTime,
      arrival_time: arrTime,
      total_duration: flight.total_duration || 0,
      stops: stops,
      layovers: (flight.layovers || []).map(l => ({
        airport: l.name || '',
        duration: l.duration || 0
      })),
      type: flight.type || 'Round trip',
      carbon_emissions: flight.carbon_emissions?.this_flight || null,
      booking_token: flight.booking_token || null
    });
  }
  
  return results;
}

// --- Default popular destinations ---
const DEFAULT_DESTINATIONS = [
  { code: 'LON', name: 'London' },
  { code: 'BCN', name: 'Barcelona' },
  { code: 'BER', name: 'Berlin' },
  { code: 'AMS', name: 'Amsterdam' },
  { code: 'PRG', name: 'Prag' },
  { code: 'BUD', name: 'Budapest' },
  { code: 'FCO', name: 'Rom' },
  { code: 'CDG', name: 'Paris' },
  { code: 'ALC', name: 'Alicante' },
  { code: 'AGP', name: 'Malaga' },
  { code: 'ATH', name: 'Aten' },
  { code: 'WAW', name: 'Warszawa' },
  { code: 'KRK', name: 'Krakow' },
  { code: 'LIS', name: 'Lissabon' },
  { code: 'MIL', name: 'Milano' },
  { code: 'VIE', name: 'Wien' },
  { code: 'IST', name: 'Istanbul' },
  { code: 'SPU', name: 'Split' },
  { code: 'DUB', name: 'Dublin' },
  { code: 'NCE', name: 'Nice' }
];
