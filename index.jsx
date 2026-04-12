import { useState, useRef, useEffect } from "react";

const AIRPORTS_BY_COUNTRY = {
  Sverige: ["Stockholm ARN", "Göteborg GOT", "Malmö MMX", "Luleå LLA", "Umeå UME", "Växjö VXO", "Linköping LPI", "Karlstad KSD", "Sundsvall SDL", "Kiruna KRN", "Visby VBY", "Ängelholm AGH", "Norrköping NRK", "Halmstad HAD", "Jönköping JKG", "Kalmar KLR", "Kristianstad KID", "Ronneby RNB", "Skellefteå SFT", "Örnsköldsvik OER"],
  Norge: ["Oslo OSL", "Bergen BGO", "Stavanger SVG", "Trondheim TRD", "Tromsø TOS", "Ålesund AES", "Bodø BOO", "Kristiansand KRS", "Haugesund HAU", "Sandefjord TRF"],
  Danmark: ["Köpenhamn CPH", "Billund BLL", "Aalborg AAL"],
  Finland: ["Helsingfors HEL", "Tammerfors TMP", "Åbo TKU", "Uleåborg OUL", "Rovaniemi RVN"],
  Tyskland: ["Berlin BER", "Frankfurt FRA", "München MUC", "Hamburg HAM", "Düsseldorf DUS", "Köln CGN", "Stuttgart STR", "Hannover HAJ", "Nürnberg NUE", "Leipzig LEJ", "Dresden DRS", "Bremen BRE", "Dortmund DTM", "Memmingen FMM", "Weeze NRN"],
  Polen: ["Warszawa WAW", "Kraków KRK", "Gdańsk GDN", "Wrocław WRO", "Poznań POZ", "Katowice KTW", "Łódź LCJ", "Rzeszów RZE", "Lublin LUZ", "Bydgoszcz BZG"],
  Grekland: ["Aten ATH", "Thessaloniki SKG", "Heraklion HER", "Chania CHQ", "Rhodos RHO", "Korfu CFU", "Zakynthos ZTH", "Kos KGS", "Santorini JTR", "Mykonos JMK", "Kalamata KLX", "Kavala KVA", "Kefalonia EFL"],
  Spanien: ["Madrid MAD", "Barcelona BCN", "Málaga AGP", "Palma de Mallorca PMI", "Alicante ALC", "Valencia VLC", "Sevilla SVQ", "Bilbao BIO", "Tenerife TFS", "Gran Canaria LPA", "Lanzarote ACE", "Fuerteventura FUE", "Ibiza IBZ", "Girona GRO", "Reus REU", "Murcia RMU"],
  Italien: ["Rom FCO", "Milano MXP", "Milano Linate LIN", "Bergamo BGY", "Venedig VCE", "Neapel NAP", "Bologna BLQ", "Pisa PSA", "Catania CTA", "Palermo PMO", "Bari BRI", "Turin TRN", "Genua GOA", "Cagliari CAG", "Olbia OLB", "Verona VRN", "Treviso TSF"],
  Frankrike: ["Paris CDG", "Paris Orly ORY", "Nice NCE", "Lyon LYS", "Marseille MRS", "Toulouse TLS", "Bordeaux BOD", "Nantes NTE", "Strasbourg SXB", "Montpellier MPL", "Beauvais BVA", "Brest BES", "Bastia BIA", "Ajaccio AJA"],
  Storbritannien: ["London Heathrow LHR", "London Gatwick LGW", "London Stansted STN", "London Luton LTN", "Manchester MAN", "Edinburgh EDI", "Birmingham BHX", "Bristol BRS", "Glasgow GLA", "Liverpool LPL", "Newcastle NCL", "Leeds Bradford LBA", "Belfast BFS", "East Midlands EMA"],
  Portugal: ["Lissabon LIS", "Porto OPO", "Faro FAO", "Funchal FNC", "Ponta Delgada PDL"],
  Turkiet: ["Istanbul IST", "Istanbul Sabiha SAW", "Antalya AYT", "Ankara ESB", "Izmir ADB", "Bodrum BJV", "Dalaman DLM"],
  Thailand: ["Bangkok BKK", "Bangkok Don Mueang DMK", "Phuket HKT", "Chiang Mai CNX", "Krabi KBV", "Koh Samui USM", "Hat Yai HDY"],
  USA: ["New York JFK", "New York Newark EWR", "Los Angeles LAX", "Chicago ORD", "Miami MIA", "San Francisco SFO", "Atlanta ATL", "Dallas DFW", "Houston IAH", "Seattle SEA", "Boston BOS", "Washington IAD", "Las Vegas LAS", "Orlando MCO", "Denver DEN"],
  Kroatien: ["Zagreb ZAG", "Split SPU", "Dubrovnik DBV", "Zadar ZAD", "Pula PUY", "Rijeka RJK"],
  Ungern: ["Budapest BUD"],
  Tjeckien: ["Prag PRG", "Brno BRQ"],
  Österrike: ["Wien VIE", "Salzburg SZG", "Innsbruck INN"],
  Schweiz: ["Zürich ZRH", "Genève GVA", "Basel BSL"],
  Nederländerna: ["Amsterdam AMS", "Eindhoven EIN", "Rotterdam RTM"],
  Belgien: ["Bryssel BRU", "Charleroi CRL", "Antwerpen ANR"],
  Irland: ["Dublin DUB", "Cork ORK", "Shannon SNN", "Knock NOC"],
  Island: ["Reykjavik KEF"],
  Cypern: ["Larnaca LCA", "Paphos PFO"],
  Malta: ["Malta MLA"],
  Marocko: ["Marrakech RAK", "Casablanca CMN", "Fès FEZ", "Agadir AGA", "Tangier TNG"],
  Egypten: ["Kairo CAI", "Hurghada HRG", "Sharm el-Sheikh SSH"],
  Förenade Arabemiraten: ["Dubai DXB", "Abu Dhabi AUH", "Sharjah SHJ"],
  Japan: ["Tokyo Narita NRT", "Tokyo Haneda HND", "Osaka KIX", "Nagoya NGO", "Fukuoka FUK", "Sapporo CTS"],
  Australien: ["Sydney SYD", "Melbourne MEL", "Brisbane BNE", "Perth PER", "Adelaide ADL", "Gold Coast OOL", "Cairns CNS"],
  Mexiko: ["Mexico City MEX", "Cancún CUN", "Guadalajara GDL", "Puerto Vallarta PVR"],
  Brasilien: ["São Paulo GRU", "Rio de Janeiro GIG", "Brasília BSB", "Salvador SSA"],
  Kanada: ["Toronto YYZ", "Vancouver YVR", "Montreal YUL", "Calgary YYC", "Ottawa YOW"],
  Indien: ["Delhi DEL", "Mumbai BOM", "Bangalore BLR", "Chennai MAA", "Hyderabad HYD", "Kolkata CCU", "Goa GOI"],
  Kina: ["Peking PEK", "Shanghai PVG", "Guangzhou CAN", "Shenzhen SZX", "Chengdu CTU"],
  Sydkorea: ["Seoul ICN", "Busan PUS", "Jeju CJU"],
  Indonesien: ["Jakarta CGK", "Bali DPS", "Surabaya SUB", "Yogyakarta JOG"],
  Vietnam: ["Ho Chi Minh-staden SGN", "Hanoi HAN", "Da Nang DAD"],
  Filippinerna: ["Manila MNL", "Cebu CEB", "Clark CRK"],
  Malaysia: ["Kuala Lumpur KUL", "Penang PEN", "Langkawi LGK", "Kota Kinabalu BKI"],
  Singapore: ["Singapore SIN"],
  Sydafrika: ["Johannesburg JNB", "Kapstaden CPT", "Durban DUR"],
  Kenya: ["Nairobi NBO", "Mombasa MBA"],
  Tanzania: ["Dar es Salaam DAR", "Kilimanjaro JRO", "Zanzibar ZNZ"],
  Argentina: ["Buenos Aires EZE"],
  Colombia: ["Bogotá BOG", "Medellín MDE", "Cartagena CTG"],
  Peru: ["Lima LIM", "Cusco CUZ"],
  Chile: ["Santiago SCL"],
  "Nya Zeeland": ["Auckland AKL", "Wellington WLG", "Queenstown ZQN", "Christchurch CHC"],
  Montenegro: ["Podgorica TGD", "Tivat TIV"],
  Albanien: ["Tirana TIA"],
  Bulgarien: ["Sofia SOF", "Varna VAR", "Burgas BOJ"],
  Rumänien: ["Bukarest OTP", "Cluj-Napoca CLJ", "Timișoara TSR"],
  Serbien: ["Belgrad BEG", "Niš INI"],
  Litauen: ["Vilnius VNO", "Kaunas KUN"],
  Lettland: ["Riga RIX"],
  Estland: ["Tallinn TLL"],
};

const COUNTRIES = Object.keys(AIRPORTS_BY_COUNTRY).sort();

const BUDGET_HUBS = [
  "Warszawa WAW", "Kraków KRK", "Budapest BUD", "Prag PRG",
  "Milano Bergamo BGY", "London Stansted STN", "London Luton LTN",
  "Paris Beauvais BVA", "Köln CGN", "Eindhoven EIN", "Charleroi CRL",
  "Katowice KTW", "Gdańsk GDN", "Wrocław WRO", "Memmingen FMM",
  "Weeze NRN", "Treviso TSF", "Girona GRO"
];

const BUDGET_AIRLINES = [
  "Ryanair", "Wizz Air", "easyJet", "Norwegian", "Eurowings",
  "Transavia", "Vueling", "Pegasus", "Play", "Volotea", "SKY Express"
];

export default function FlightAgent() {
  const [fromCountry, setFromCountry] = useState("Sverige");
  const [toCountry, setToCountry] = useState("");
  const [toCity, setToCity] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [flexible, setFlexible] = useState(true);
  const [passengers, setPassengers] = useState(1);
  const [searching, setSearching] = useState(false);
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const resultsRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const addMsg = (text, type = "info") => {
    setMessages(prev => [...prev, { text, type, time: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }]);
  };

  const searchFlights = async () => {
    if (!toCountry || !dateFrom) {
      setError("Välj destination och datum.");
      return;
    }
    setError("");
    setSearching(true);
    setMessages([]);
    setResults([]);
    setDone(false);

    const fromAirports = AIRPORTS_BY_COUNTRY[fromCountry] || [];
    const toAirports = AIRPORTS_BY_COUNTRY[toCountry] || [];

    addMsg(`Startar sökning: ${fromCountry} → ${toCountry}${toCity ? ` (${toCity})` : ""}`, "start");
    addMsg(`Skannar ${fromAirports.length} avreseflygplatser × ${toAirports.length} destinationsflygplatser`, "info");
    addMsg(`Kontrollerar ${BUDGET_HUBS.length} budgethubbar för mellanlandningsrutter...`, "info");

    const dateStr = dateFrom;
    const returnStr = dateTo || "";
    const flexStr = flexible ? " ±3 dagar" : "";
    const destFilter = toCity ? ` nära ${toCity}` : "";

    const allResults = [];

    // Phase 1: Direct flights from all origin airports
    setPhase("Fas 1/3: Direktflyg från alla flygplatser");
    addMsg("═══ FAS 1: Söker direktflyg från alla avgångsflygplatser ═══", "phase");

    const originBatches = [];
    for (let i = 0; i < fromAirports.length; i += 4) {
      originBatches.push(fromAirports.slice(i, i + 4));
    }

    for (const batch of originBatches) {
      const airportNames = batch.map(a => a.split(" ").slice(-1)[0]).join(", ");
      addMsg(`Söker: ${batch.map(a => a.split(" ")[0]).join(", ")}...`, "search");

      try {
        const query = `cheapest flights from ${batch.map(a => a.split(" ").slice(-1)[0]).join(" or ")} to ${toCountry}${destFilter} ${dateStr}${flexStr} ${returnStr ? "return " + returnStr : "one way"} 2026 budget`;

        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `You are a flight price research agent. Search the web for the cheapest flights and respond ONLY in JSON array format. Each element: {"from":"AIRPORT_CODE","from_city":"City","to":"AIRPORT_CODE","to_city":"City","price_eur":NUMBER,"airline":"Name","type":"direct","stops":0,"via":"","date":"YYYY-MM-DD","source":"website_name","notes":"any relevant info"}. If you find no results, return []. No markdown, no text, ONLY the JSON array. Search thoroughly using Google Flights, Skyscanner, Momondo, Kiwi.com data. Include budget airlines like ${BUDGET_AIRLINES.join(", ")}.`,
            messages: [{ role: "user", content: query }],
            tools: [{ type: "web_search_20250305", name: "web_search" }]
          })
        });

        const data = await resp.json();
        const texts = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");

        try {
          const clean = texts.replace(/```json|```/g, "").trim();
          const jsonMatch = clean.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach(r => { r._batch = "direct"; });
              allResults.push(...parsed);
              addMsg(`✓ Hittade ${parsed.length} flyg via ${airportNames}`, "success");
            } else {
              addMsg(`— Inga fynd via ${airportNames}`, "empty");
            }
          } else {
            addMsg(`— Inga strukturerade resultat via ${airportNames}`, "empty");
          }
        } catch {
          addMsg(`— Kunde inte tolka resultat för ${airportNames}`, "warn");
        }
      } catch (err) {
        addMsg(`⚠ Nätverksfel för ${airportNames}: ${err.message}`, "error");
      }
    }

    // Phase 2: Via budget hubs
    setPhase("Fas 2/3: Mellanlandningar via budgethubbar");
    addMsg("═══ FAS 2: Söker billigare rutter via budgethubbar ═══", "phase");

    const hubBatches = [];
    for (let i = 0; i < BUDGET_HUBS.length; i += 5) {
      hubBatches.push(BUDGET_HUBS.slice(i, i + 5));
    }

    for (const batch of hubBatches) {
      const hubNames = batch.map(h => h.split(" ")[0]).join(", ");
      addMsg(`Kontrollerar hubbar: ${hubNames}...`, "search");

      try {
        const hubCodes = batch.map(h => h.split(" ").slice(-1)[0]).join(", ");
        const query = `cheapest flights from ${fromCountry} via ${hubCodes} to ${toCountry}${destFilter} ${dateStr}${flexStr} budget airlines connecting flights 2026`;

        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `You are a flight price research agent specializing in finding cheap connecting flights via budget airline hubs. Search for 2-leg journeys: Leg 1 from ${fromCountry} to hub, Leg 2 from hub to ${toCountry}. Respond ONLY in JSON array format. Each element: {"from":"CODE","from_city":"City","to":"CODE","to_city":"City","price_eur":NUMBER,"airline":"Name(s)","type":"connection","stops":1,"via":"Hub City (CODE)","date":"YYYY-MM-DD","source":"website","notes":"e.g. Leg1: X EUR + Leg2: Y EUR"}. Search Ryanair, Wizz Air, easyJet routes. No markdown, ONLY JSON array. Return [] if nothing found.`,
            messages: [{ role: "user", content: query }],
            tools: [{ type: "web_search_20250305", name: "web_search" }]
          })
        });

        const data = await resp.json();
        const texts = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");

        try {
          const clean = texts.replace(/```json|```/g, "").trim();
          const jsonMatch = clean.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
              parsed.forEach(r => { r._batch = "hub"; });
              allResults.push(...parsed);
              addMsg(`✓ Hittade ${parsed.length} rutter via hubbar`, "success");
            } else {
              addMsg(`— Inga billigare rutter via ${hubNames}`, "empty");
            }
          }
        } catch {
          addMsg(`— Tolkningsfel för hubbar ${hubNames}`, "warn");
        }
      } catch (err) {
        addMsg(`⚠ Fel vid hubb-sökning: ${err.message}`, "error");
      }
    }

    // Phase 3: Smart analysis
    setPhase("Fas 3/3: AI-analys & ranking");
    addMsg("═══ FAS 3: Analyserar & rankar alla resultat ═══", "phase");

    if (allResults.length > 0) {
      // Dedupe and sort
      const seen = new Set();
      const unique = allResults.filter(r => {
        const key = `${r.from}-${r.to}-${r.price_eur}-${r.airline}-${r.via || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      unique.sort((a, b) => (a.price_eur || 9999) - (b.price_eur || 9999));
      const top = unique.slice(0, 30);

      // AI analysis
      try {
        addMsg("AI analyserar bästa alternativen...", "search");
        const analysisResp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: `You are a Swedish-speaking flight deal analyst. Analyze these flight results and provide a brief summary in Swedish. Focus on: 1) Best overall deal, 2) Best direct flight, 3) Smartest connection route, 4) Any tips for saving more. Keep it concise, max 4-5 sentences. No JSON, just natural Swedish text.`,
            messages: [{ role: "user", content: `Analysera dessa flygresultat från ${fromCountry} till ${toCountry}:\n${JSON.stringify(top.slice(0, 15))}` }]
          })
        });
        const analysisData = await analysisResp.json();
        const analysisText = (analysisData.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
        if (analysisText) {
          addMsg(analysisText, "analysis");
        }
      } catch {
        // Skip analysis on error
      }

      setResults(top);
      addMsg(`Klart! ${unique.length} unika alternativ hittade, visar topp ${top.length}.`, "done");
    } else {
      addMsg("Inga flygresultat hittade. Prova andra datum eller bredare sökning.", "error");
    }

    setDone(true);
    setSearching(false);
    setPhase("");
  };

  const msgIcon = (type) => {
    switch (type) {
      case "start": return "🛫";
      case "phase": return "📡";
      case "search": return "🔍";
      case "success": return "✅";
      case "empty": return "—";
      case "warn": return "⚠️";
      case "error": return "❌";
      case "analysis": return "🧠";
      case "done": return "🏁";
      default: return "→";
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e17 0%, #111827 40%, #0c1220 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: 0
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "24px 24px 20px"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>✈️</span>
            <h1 style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              FlyScout AI
            </h1>
            <span style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 20,
              background: "rgba(139,92,246,0.2)",
              color: "#a78bfa",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase"
            }}>Agent</span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
            Genomsöker ALLA flygplatser i båda länder • Hittar dolda rutter via budgethubbar • Jämför {BUDGET_AIRLINES.length} lågprisbolag
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px" }}>

        {/* Search form */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 20
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16
          }}>
            <div>
              <label style={labelStyle}>Från land</label>
              <select value={fromCountry} onChange={e => setFromCountry(e.target.value)} style={selectStyle}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c} ({(AIRPORTS_BY_COUNTRY[c] || []).length} flygplatser)</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Till land</label>
              <select value={toCountry} onChange={e => { setToCountry(e.target.value); setToCity(""); }} style={selectStyle}>
                <option value="">— Välj destination —</option>
                {COUNTRIES.filter(c => c !== fromCountry).map(c => <option key={c} value={c}>{c} ({(AIRPORTS_BY_COUNTRY[c] || []).length} flygplatser)</option>)}
              </select>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: 16,
            alignItems: "end",
            marginBottom: 16
          }}>
            <div>
              <label style={labelStyle}>Utresa</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Hemresa (valfri)</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Passagerare</label>
              <select value={passengers} onChange={e => setPassengers(+e.target.value)} style={selectStyle}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#94a3b8", paddingBottom: 4 }}>
              <input type="checkbox" checked={flexible} onChange={e => setFlexible(e.target.checked)}
                style={{ accentColor: "#60a5fa" }} />
              ±3 dagar
            </label>
          </div>

          {toCountry && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Specifik stad/ö (valfritt — lämna tomt för hela landet)</label>
              <input type="text" placeholder="t.ex. Kreta, Santorini, Palma..." value={toCity}
                onChange={e => setToCity(e.target.value)} style={inputStyle} />
            </div>
          )}

          {error && <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}

          <button onClick={searchFlights} disabled={searching}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              border: "none",
              fontWeight: 600,
              fontSize: 15,
              cursor: searching ? "not-allowed" : "pointer",
              background: searching
                ? "rgba(59,130,246,0.2)"
                : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              color: searching ? "#60a5fa" : "#fff",
              transition: "all 0.2s",
              fontFamily: "inherit"
            }}>
            {searching ? `⏳ ${phase || "Söker..."}` : `🔍 Sök billigaste flyg — ${(AIRPORTS_BY_COUNTRY[fromCountry] || []).length} × ${(AIRPORTS_BY_COUNTRY[toCountry] || []).length || "?"} flygplatser + ${BUDGET_HUBS.length} hubbar`}
          </button>
        </div>

        {/* Stats bar */}
        {toCountry && !searching && (
          <div style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap"
          }}>
            {[
              { label: "Avgångsflygplatser", val: (AIRPORTS_BY_COUNTRY[fromCountry] || []).length },
              { label: "Destinationsflygplatser", val: (AIRPORTS_BY_COUNTRY[toCountry] || []).length },
              { label: "Budgethubbar", val: BUDGET_HUBS.length },
              { label: "Kombinationer", val: (AIRPORTS_BY_COUNTRY[fromCountry] || []).length * (AIRPORTS_BY_COUNTRY[toCountry] || []).length + BUDGET_HUBS.length }
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: "8px 14px",
                flex: "1 1 120px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#60a5fa" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Agent log */}
        {messages.length > 0 && (
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            maxHeight: 320,
            overflowY: "auto",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12
          }}>
            <div style={{ color: "#64748b", fontSize: 10, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              Agent-logg
            </div>
            {messages.map((m, i) => (
              <div key={i} style={{
                padding: "4px 0",
                color: m.type === "success" ? "#4ade80" : m.type === "error" ? "#f87171" : m.type === "phase" ? "#60a5fa" : m.type === "analysis" ? "#fbbf24" : m.type === "done" ? "#a78bfa" : "#94a3b8",
                fontWeight: m.type === "phase" || m.type === "done" ? 600 : 400,
                borderBottom: m.type === "phase" ? "1px solid rgba(96,165,250,0.15)" : "none",
                marginTop: m.type === "phase" ? 8 : 0,
                paddingBottom: m.type === "phase" ? 6 : 4
              }}>
                <span style={{ color: "#475569", marginRight: 8 }}>{m.time}</span>
                {msgIcon(m.type)} {m.text}
              </div>
            ))}
            {searching && (
              <div style={{ color: "#60a5fa", animation: "pulse 1.5s infinite" }}>
                ⏳ Söker...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div ref={resultsRef}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#e2e8f0" }}>
              🏆 Topp {results.length} billigaste flyg
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  background: i === 0
                    ? "linear-gradient(135deg, rgba(250,204,21,0.08), rgba(251,191,36,0.04))"
                    : i < 3
                    ? "rgba(59,130,246,0.05)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${i === 0 ? "rgba(250,204,21,0.2)" : i < 3 ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 12,
                  padding: "14px 18px",
                  display: "grid",
                  gridTemplateColumns: "50px 1fr 1fr 100px",
                  alignItems: "center",
                  gap: 12
                }}>
                  <div style={{
                    fontSize: i < 3 ? 22 : 16,
                    fontWeight: 700,
                    color: i === 0 ? "#fbbf24" : i < 3 ? "#60a5fa" : "#64748b",
                    textAlign: "center"
                  }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#e2e8f0" }}>
                      {r.from_city || r.from} → {r.to_city || r.to}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {r.from} → {r.via ? `${r.via} → ` : ""}{r.to}
                    </div>
                    {r.date && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{r.date}</div>}
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      {r.airline || "—"} • {r.type === "connection" ? `Via ${r.via}` : "Direkt"}
                    </div>
                    {r.notes && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{r.notes}</div>}
                    {r.source && <div style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>Källa: {r.source}</div>}
                  </div>

                  <div style={{
                    textAlign: "right",
                    fontSize: i < 3 ? 20 : 16,
                    fontWeight: 700,
                    color: i === 0 ? "#4ade80" : i < 3 ? "#60a5fa" : "#94a3b8",
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {r.price_eur ? `€${r.price_eur}` : "—"}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking tips */}
            <div style={{
              marginTop: 20,
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: 12,
              padding: 16
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", margin: "0 0 8px" }}>💡 Boka via</h3>
              <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>
                <strong>Bäst pris:</strong> Google Flights → Kiwi.com → Momondo → Skyscanner<br />
                <strong>Budgetbolag direkt:</strong> Ryanair.com, WizzAir.com, easyJet.com (ofta billigast)<br />
                <strong>Tips:</strong> Boka separata ben manuellt via lågprisbolagen om agenten hittar billigare connections
              </div>
            </div>
          </div>
        )}

        {done && results.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: 40,
            color: "#64748b"
          }}>
            <span style={{ fontSize: 40 }}>🔎</span>
            <p style={{ marginTop: 12 }}>Inga resultat hittades. Prova andra datum eller en annan destination.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        select:focus, input:focus {
          outline: none;
          border-color: rgba(96,165,250,0.5) !important;
          box-shadow: 0 0 0 2px rgba(96,165,250,0.1);
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#64748b",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.3)",
  color: "#e2e8f0",
  fontSize: 14,
  fontFamily: "inherit",
  boxSizing: "border-box"
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "auto"
};
