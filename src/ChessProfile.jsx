import { useState, useEffect, useRef } from "react";
import profilePhoto from "./assets/profile.jpeg";

const LICHESS_USERNAME = "D2196";
const CHESSCOM_USERNAME = "rdx_2178";
const CHESSCOM_DISPLAY = "Dipak Prajapati";
const CHESSCOM_JOINED = "Jan 19, 2017";
const CHESSCOM_AVATAR =
  "https://images.chesscomfiles.com/uploads/v1/user/32505542.c702220e.160x160o.3b2f1cb5751e.png";

// Hook to fetch live Chess.com stats
function useChessComRatings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.chess.com/pub/player/${CHESSCOM_USERNAME}/stats`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
        setLastUpdated(new Date());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, lastUpdated };
}

// Hook to fetch live Lichess ratings
function useLichessRatings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchRatings() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://lichess.org/api/user/${LICHESS_USERNAME}`,
          {
            headers: { Accept: "application/json" },
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
        setLastUpdated(new Date());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRatings();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRatings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, lastUpdated };
}

const QUOTES = [
  {
    text: "The most powerful weapon in chess is to have the next move.",
    author: "Mikhail Tal",
    title: "The Magician from Riga",
    color: "#e63946",
  },
  {
    text: "Chess is life in miniature. Chess is a struggle, chess battles.",
    author: "Bobby Fischer",
    title: "The Greatest of All Time",
    color: "#f4a261",
  },
  {
    text: "I don't believe in psychology. I believe in good moves.",
    author: "Bobby Fischer",
    title: "World Champion 1972",
    color: "#f4a261",
  },
  {
    text: "You must take your opponent into a deep, dark forest where 2+2=5, and the path leading out is only wide enough for one.",
    author: "Mikhail Tal",
    title: "The Magician from Riga",
    color: "#e63946",
  },
  {
    text: "Chess, like love, like music, has the power to make men happy.",
    author: "Siegbert Tarrasch",
    title: "German Chess Master",
    color: "#a8dadc",
  },
  {
    text: "I have never in my life played the French Defence, which is the dullest of all openings.",
    author: "Alexander Alekhine",
    title: "The Chess Machine",
    color: "#c77dff",
  },
  {
    text: "Help your pieces so they can help you.",
    author: "Paul Morphy",
    title: "The Pride and Sorrow of Chess",
    color: "#ffd166",
  },
];

function ChessBoard({ size = 8 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        width: "100%",
        height: "100%",
        opacity: 0.07,
      }}
    >
      {Array.from({ length: size * size }).map((_, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const isLight = (row + col) % 2 === 0;
        return (
          <div
            key={i}
            style={{ background: isLight ? "#d4af37" : "#1a1a2e" }}
          />
        );
      })}
    </div>
  );
}

function CountUp({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseInt(target.toString().replace(/[^0-9]/g, ""));
    if (!num) {
      setCount(target);
      return;
    }
    let start = 0;
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

function QuoteCarousel() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);
  const q = QUOTES[idx];
  return (
    <div
      style={{
        transition: "opacity 0.4s",
        opacity: fade ? 1 : 0,
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          color: "#f0ece2",
          lineHeight: 1.7,
          marginBottom: "1.5rem",
          maxWidth: 700,
          margin: "0 auto 1.5rem",
        }}
      >
        "{q.text}"
      </div>
      <div
        style={{
          color: q.color,
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        — {q.author}
      </div>
      <div style={{ color: "#8e8e9a", fontSize: "0.8rem", marginTop: 4 }}>
        {q.title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setIdx(i);
                setFade(true);
              }, 200);
            }}
            style={{
              width: i === idx ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: i === idx ? q.color : "#3a3a4a",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCard() {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(212,175,55,0.4)",
          background: "#0d0d14",
        }}
      >
        {/* Chessboard background */}
        <div style={{ position: "absolute", inset: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              width: "100%",
              height: "100%",
              opacity: 0.2,
            }}
          >
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8),
                col = i % 8;
              return (
                <div
                  key={i}
                  style={{
                    background: (row + col) % 2 === 0 ? "#d4af37" : "#1a1a2e",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom gradient so text stays readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(13,13,20,0.75) 0%, transparent 55%)",
            zIndex: 2,
          }}
        />

        {/* Profile photo */}
        <img
          src={profilePhoto}
          alt="Dipak Prajapati"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            zIndex: 1,
          }}
        />

        {/* Bottom label */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1.5rem",
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              color: "#d4af37",
              fontWeight: 700,
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            }}
          >
            Mumbai, India
          </div>
          <div
            style={{
              color: "#c0bdb5",
              fontSize: "0.75rem",
              marginTop: 3,
              textShadow: "0 1px 4px rgba(0,0,0,0.9)",
              letterSpacing: "0.1em",
            }}
          >
            Born · Raised · Playing
          </div>
        </div>

        {/* Corner decorations */}
        {[
          { top: 16, left: 16 },
          { top: 16, right: 16 },
          { bottom: 70, left: 16 },
          { bottom: 70, right: 16 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              zIndex: 4,
              width: 20,
              height: 20,
              border: "2px solid rgba(212,175,55,0.6)",
              borderRadius: 3,
            }}
          />
        ))}

        {/* Top gold shimmer line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #d4af37, transparent)",
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
}

export default function ChessProfile() {
  const [scrolled, setScrolled] = useState(false);
  const {
    data: lichess,
    loading: lichessLoading,
    error: lichessError,
    lastUpdated,
  } = useLichessRatings();
  const {
    data: chesscom,
    loading: chesscomLoading,
    error: chesscomError,
    lastUpdated: chesscomUpdated,
  } = useChessComRatings();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Build live rating rows from API
  const lichessRatingRows = lichess
    ? [
        {
          mode: "Bullet",
          value: lichess.perfs.bullet?.rating,
          games: lichess.perfs.bullet?.games,
          prov: lichess.perfs.bullet?.prov,
        },
        {
          mode: "Blitz",
          value: lichess.perfs.blitz?.rating,
          games: lichess.perfs.blitz?.games,
          prov: lichess.perfs.blitz?.prov,
        },
        {
          mode: "Rapid",
          value: lichess.perfs.rapid?.rating,
          games: lichess.perfs.rapid?.games,
          prov: lichess.perfs.rapid?.prov,
        },
        {
          mode: "Classical",
          value: lichess.perfs.classical?.rating,
          games: lichess.perfs.classical?.games,
          prov: lichess.perfs.classical?.prov,
        },
        {
          mode: "Puzzle 🧩",
          value: lichess.perfs.puzzle?.rating,
          games: lichess.perfs.puzzle?.games,
          prov: lichess.perfs.puzzle?.prov,
        },
      ]
    : [];

  // Build live Chess.com rating rows from API
  const chesscomRatingRows = chesscom
    ? [
        {
          mode: "Bullet",
          value: chesscom.chess_bullet?.last?.rating ?? null,
          games:
            (chesscom.chess_bullet?.record?.win ?? 0) +
            (chesscom.chess_bullet?.record?.loss ?? 0) +
            (chesscom.chess_bullet?.record?.draw ?? 0),
          win: chesscom.chess_bullet?.record?.win ?? 0,
          loss: chesscom.chess_bullet?.record?.loss ?? 0,
          best: chesscom.chess_bullet?.best?.rating ?? null,
        },
        {
          mode: "Blitz",
          value: chesscom.chess_blitz?.last?.rating ?? null,
          games:
            (chesscom.chess_blitz?.record?.win ?? 0) +
            (chesscom.chess_blitz?.record?.loss ?? 0) +
            (chesscom.chess_blitz?.record?.draw ?? 0),
          win: chesscom.chess_blitz?.record?.win ?? 0,
          loss: chesscom.chess_blitz?.record?.loss ?? 0,
          best: chesscom.chess_blitz?.best?.rating ?? null,
        },
        {
          mode: "Rapid",
          value: chesscom.chess_rapid?.last?.rating ?? null,
          games:
            (chesscom.chess_rapid?.record?.win ?? 0) +
            (chesscom.chess_rapid?.record?.loss ?? 0) +
            (chesscom.chess_rapid?.record?.draw ?? 0),
          win: chesscom.chess_rapid?.record?.win ?? 0,
          loss: chesscom.chess_rapid?.record?.loss ?? 0,
          best: chesscom.chess_rapid?.best?.rating ?? null,
        },
        {
          mode: "Daily",
          value: chesscom.chess_daily?.last?.rating ?? null,
          games:
            (chesscom.chess_daily?.record?.win ?? 0) +
            (chesscom.chess_daily?.record?.loss ?? 0) +
            (chesscom.chess_daily?.record?.draw ?? 0),
          win: chesscom.chess_daily?.record?.win ?? 0,
          loss: chesscom.chess_daily?.record?.loss ?? 0,
          best: chesscom.chess_daily?.best?.rating ?? null,
        },
        {
          mode: "Puzzle Rush 🧩",
          value: chesscom.tactics?.highest?.rating ?? null,
          games: chesscom.tactics?.highest?.rating ? 1 : 0,
          win: null,
          loss: null,
          best: chesscom.tactics?.highest?.rating ?? null,
        },
      ].filter((r) => r.value !== null)
    : [];

  const totalGames = lichess?.count?.all ?? 0;
  const wins = lichess?.count?.win ?? 0;
  const losses = lichess?.count?.loss ?? 0;
  const draws = lichess?.count?.draw ?? 0;

  const ACHIEVEMENTS = [
    {
      icon: "⚡",
      label: "Rapid Rating",
      value: lichess ? String(lichess.perfs.rapid?.rating) : "—",
      sub: "Lichess Live",
    },
    {
      icon: "🧩",
      label: "Puzzle Rating",
      value: lichess ? String(lichess.perfs.puzzle?.rating) : "—",
      sub: "Lichess Live",
    },
    {
      icon: "🏆",
      label: "Total Wins",
      value: lichess ? String(wins) : "—",
      sub: `of ${totalGames} games`,
    },
    {
      icon: "🔥",
      label: "Blitz Rating",
      value: lichess ? String(lichess.perfs.blitz?.rating) : "—",
      sub: "Lichess Live",
    },
    {
      icon: "♾",
      label: "Total Games",
      value: lichess ? String(totalGames) : "—",
      sub: "All Formats",
    },
    {
      icon: "🎯",
      label: "Win Rate",
      value:
        lichess && totalGames
          ? `${Math.round((wins / totalGames) * 100)}%`
          : "—",
      sub: `${wins}W ${draws}D ${losses}L`,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d14",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#f0ece2",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;700&family=DM+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; background: #0d0d14; }
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 3px; }
        .card-hover { transition: transform 0.3s, box-shadow 0.3s; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(212,175,55,0.15); }
        .rating-bar { transition: width 1.5s cubic-bezier(0.4,0,0.2,1); }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .piece-float { animation: float 4s ease-in-out infinite; }
        .gold-shimmer {
          background: linear-gradient(90deg, #d4af37, #fff8dc, #d4af37, #b8860b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .fade-up { animation: fadeSlideUp 0.8s ease forwards; }
        .section-label {
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #d4af37;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "rgba(13,13,20,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,175,55,0.1)" : "none",
          transition: "all 0.4s",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.3rem",
            fontWeight: 900,
          }}
        >
          <span className="gold-shimmer">♔ SHATRANJ</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            fontSize: "0.85rem",
            color: "#8e8e9a",
          }}
        >
          {["About", "Ratings", "Achievements", "Quotes"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              style={{
                color: "#8e8e9a",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#d4af37")}
              onMouseLeave={(e) => (e.target.style.color = "#8e8e9a")}
            >
              {s}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "6rem 2rem 4rem",
        }}
      >
        {/* Chessboard BG */}
        <div style={{ position: "absolute", inset: 0 }}>
          <ChessBoard size={12} />
        </div>
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{ position: "relative", textAlign: "center", maxWidth: 900 }}
        >
          {/* Floating pieces */}
          <div
            className="piece-float"
            style={{
              fontSize: "4rem",
              marginBottom: "1.5rem",
              animationDelay: "0s",
            }}
          >
            ♔
          </div>
          {/* <div className="section-label">
            Grand Master Aspirant · Mumbai, India
          </div> */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              marginBottom: "1.5rem",
            }}
          >
            <span className="gold-shimmer">Dipak Prajapati</span>
            <br />
            {/* <span style={{ color: "#f0ece2" }}>Chronicles</span> */}
          </h1>
          <p
            style={{
              color: "#8e8e9a",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              maxWidth: 560,
              margin: "0 auto 3rem",
              lineHeight: 1.8,
            }}
          >
            Born and raised in the heart of Mumbai. A chess player, strategist,
            and forever student of the 64 squares.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#ratings"
              style={{
                padding: "0.9rem 2.5rem",
                background: "linear-gradient(135deg, #d4af37, #b8860b)",
                color: "#0d0d14",
                border: "none",
                borderRadius: 50,
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              View Ratings
            </a>
            <a
              href="#about"
              style={{
                padding: "0.9rem 2.5rem",
                background: "transparent",
                color: "#f0ece2",
                border: "1px solid rgba(212,175,55,0.4)",
                borderRadius: 50,
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              My Story
            </a>
          </div>
        </div>
        {/* Scroll cue */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "#3a3a4a",
          }}
        >
          <div
            style={{
              animation: "float 2s ease-in-out infinite",
              fontSize: "1.2rem",
            }}
          >
            ↓
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        style={{ padding: "6rem 2rem", maxWidth: 1200, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Left: Photo with chessboard bg */}
          <PhotoCard />

          {/* Right: Text */}
          <div>
            <div className="section-label">My Story</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              From the Streets of Mumbai
              <br />
              <span className="gold-shimmer">to the 64 Squares</span>
            </h2>
            <p
              style={{
                color: "#8e8e9a",
                lineHeight: 1.9,
                marginBottom: "1rem",
                fontSize: "0.95rem",
              }}
            >
              Born and raised in Mumbai, India — the city of dreams, hustle, and
              endless energy. I first encountered chess as a child in our
              neighborhood, watching my uncle battle it out on worn boards in
              the evening shade.
            </p>
            <p
              style={{
                color: "#8e8e9a",
                lineHeight: 1.9,
                marginBottom: "1rem",
                fontSize: "0.95rem",
              }}
            >
              What started as curiosity became an obsession. Through school,
              college, and into my professional life, chess has been the
              constant thread that connects me to the one arena where chaos
              resolves into clarity if you think deep enough.
            </p>
            <p
              style={{ color: "#8e8e9a", lineHeight: 1.9, fontSize: "0.95rem" }}
            >
              Today I compete actively on Lichess and Chess.com, represent my
              local club, and study the great games of Tal, Fischer, Murphy and
              Alexander four players whose brilliance continues to teach me
              every day..
            </p>
            <div
              style={{
                display: "flex",
                gap: "2rem",
                marginTop: "2rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "City", value: "Mumbai, India" },
                { label: "Style", value: "Aggressive / Tactical" },
                { label: "Favorite Opening", value: "Sicilian Defense" },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#d4af37",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RATINGS */}
      <section
        id="ratings"
        style={{ padding: "6rem 2rem", background: "rgba(255,255,255,0.02)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label">Live from Lichess API</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
              }}
            >
              Current <span className="gold-shimmer">ELO Ratings</span>
            </h2>
            {lastUpdated && (
              <div
                style={{ color: "#8e8e9a", fontSize: "0.75rem", marginTop: 8 }}
              >
                🟢 Live · Last synced {lastUpdated.toLocaleTimeString()} ·
                Auto-refreshes every 5 min
              </div>
            )}
          </div>

          {/* Lichess Card - full width live */}
          <div
            className="card-hover"
            style={{
              background: "linear-gradient(135deg, #13131e, #1a1a2e)",
              border: "1px solid rgba(186,237,145,0.2)",
              borderRadius: 24,
              padding: "2.5rem",
              marginBottom: "2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #baed91, transparent)",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                fontSize: "10rem",
                opacity: 0.04,
              }}
            >
              ⚡
            </div>

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "rgba(186,237,145,0.1)",
                    border: "1px solid rgba(186,237,145,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.4rem" }}>
                    Lichess
                  </div>
                  <a
                    href={`https://lichess.org/@/${LICHESS_USERNAME}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#baed91",
                      fontSize: "0.8rem",
                      textDecoration: "none",
                    }}
                  >
                    @{LICHESS_USERNAME} ↗
                  </a>
                </div>
              </div>
              {lichessLoading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#8e8e9a",
                    fontSize: "0.8rem",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#d4af37",
                      animation: "float 1s ease-in-out infinite",
                    }}
                  />
                  Fetching live data...
                </div>
              )}
              {lichessError && (
                <div style={{ color: "#e63946", fontSize: "0.8rem" }}>
                  ⚠ {lichessError}
                </div>
              )}
              {lichess && (
                <div
                  style={{
                    padding: "6px 16px",
                    background: "rgba(186,237,145,0.1)",
                    border: "1px solid rgba(186,237,145,0.2)",
                    borderRadius: 20,
                    fontSize: "0.8rem",
                    color: "#baed91",
                  }}
                >
                  {lichess.count?.all ?? 0} games played
                </div>
              )}
            </div>

            {/* Rating bars */}
            {lichessLoading ? (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {["Bullet", "Blitz", "Rapid", "Classical", "Puzzle 🧩"].map(
                  (m) => (
                    <div key={m}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ fontSize: "0.85rem", color: "#8e8e9a" }}>
                          {m}
                        </span>
                        <span style={{ color: "#3a3a4a", fontSize: "0.85rem" }}>
                          Loading...
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "#2a2a3e",
                          borderRadius: 3,
                          animation: "shimmer 1.5s linear infinite",
                          backgroundImage:
                            "linear-gradient(90deg, #2a2a3e 25%, #3a3a4e 50%, #2a2a3e 75%)",
                          backgroundSize: "200% auto",
                        }}
                      />
                    </div>
                  ),
                )}
              </div>
            ) : lichessRatingRows.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {lichessRatingRows.map((r) => {
                  const pct = Math.min(
                    ((r.value - 800) / (2800 - 800)) * 100,
                    100,
                  );
                  const tier =
                    r.value >= 2000
                      ? { label: "Expert", color: "#d4af37" }
                      : r.value >= 1600
                        ? { label: "Advanced", color: "#baed91" }
                        : r.value >= 1200
                          ? { label: "Intermediate", color: "#90e0ef" }
                          : { label: "Beginner", color: "#8e8e9a" };
                  return (
                    <div
                      key={r.mode}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 16,
                        padding: "1.25rem 1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 10,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#8e8e9a",
                              marginBottom: 2,
                            }}
                          >
                            {r.mode}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#5a5a6a" }}>
                            {r.games} games
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontWeight: 700,
                              color: "#baed91",
                              fontSize: "1.4rem",
                              lineHeight: 1,
                            }}
                          >
                            {r.value}
                            {r.prov && (
                              <sup
                                style={{
                                  fontSize: "0.6rem",
                                  color: "#8e8e9a",
                                  marginLeft: 2,
                                }}
                              >
                                ?
                              </sup>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "0.65rem",
                              color: tier.color,
                              marginTop: 3,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {tier.label}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "#2a2a3e",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, #baed9188, #baed91)",
                            borderRadius: 3,
                            transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  color: "#8e8e9a",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                Could not load ratings. Please check connection.
              </div>
            )}
          </div>

          {/* Chess.com Live Card */}
          <div
            className="card-hover"
            style={{
              background: "linear-gradient(135deg, #13131e, #1a1a2e)",
              border: "1px solid rgba(129,182,76,0.25)",
              borderRadius: 24,
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #81b64c, transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                fontSize: "10rem",
                opacity: 0.04,
              }}
            >
              ♟
            </div>

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <img
                  src={CHESSCOM_AVATAR}
                  alt="avatar"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    border: "2px solid rgba(129,182,76,0.4)",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.4rem" }}>
                    Chess.com
                  </div>
                  <a
                    href={`https://www.chess.com/member/${CHESSCOM_USERNAME}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#81b64c",
                      fontSize: "0.8rem",
                      textDecoration: "none",
                    }}
                  >
                    @{CHESSCOM_USERNAME} ↗
                  </a>
                  <div
                    style={{
                      color: "#5a5a6a",
                      fontSize: "0.7rem",
                      marginTop: 2,
                    }}
                  >
                    {CHESSCOM_DISPLAY} · Joined {CHESSCOM_JOINED}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 6,
                }}
              >
                {chesscomLoading && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#8e8e9a",
                      fontSize: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#81b64c",
                        animation: "float 1s ease-in-out infinite",
                      }}
                    />
                    Fetching live data...
                  </div>
                )}
                {chesscomError && (
                  <div style={{ color: "#e63946", fontSize: "0.8rem" }}>
                    ⚠ {chesscomError}
                  </div>
                )}
                {chesscomUpdated && !chesscomLoading && (
                  <div style={{ color: "#5a5a6a", fontSize: "0.7rem" }}>
                    🟢 Synced {chesscomUpdated.toLocaleTimeString()}
                  </div>
                )}
                {chesscom && (
                  <div
                    style={{
                      padding: "6px 16px",
                      background: "rgba(129,182,76,0.1)",
                      border: "1px solid rgba(129,182,76,0.2)",
                      borderRadius: 20,
                      fontSize: "0.8rem",
                      color: "#81b64c",
                    }}
                  >
                    {chesscomRatingRows.reduce((s, r) => s + r.games, 0)} games
                    played
                  </div>
                )}
              </div>
            </div>

            {/* Rating bars */}
            {chesscomLoading ? (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {["Bullet", "Blitz", "Rapid", "Daily", "Puzzle Rush 🧩"].map(
                  (m) => (
                    <div key={m}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ fontSize: "0.85rem", color: "#8e8e9a" }}>
                          {m}
                        </span>
                        <span style={{ color: "#3a3a4a", fontSize: "0.85rem" }}>
                          Loading...
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "#2a2a3e",
                          borderRadius: 3,
                          backgroundImage:
                            "linear-gradient(90deg, #2a2a3e 25%, #3a3a4e 50%, #2a2a3e 75%)",
                          backgroundSize: "200% auto",
                          animation: "shimmer 1.5s linear infinite",
                        }}
                      />
                    </div>
                  ),
                )}
              </div>
            ) : chesscomRatingRows.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {chesscomRatingRows.map((r) => {
                  const pct = Math.min(
                    ((r.value - 800) / (2800 - 800)) * 100,
                    100,
                  );
                  const tier =
                    r.value >= 2000
                      ? { label: "Expert", color: "#d4af37" }
                      : r.value >= 1600
                        ? { label: "Advanced", color: "#81b64c" }
                        : r.value >= 1200
                          ? { label: "Intermediate", color: "#90e0ef" }
                          : { label: "Beginner", color: "#8e8e9a" };
                  const winRate =
                    r.win !== null && r.games > 0
                      ? Math.round((r.win / r.games) * 100)
                      : null;
                  return (
                    <div
                      key={r.mode}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 16,
                        padding: "1.25rem 1.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 10,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#8e8e9a",
                              marginBottom: 2,
                            }}
                          >
                            {r.mode}
                          </div>
                          <div
                            style={{ display: "flex", gap: 8, marginTop: 4 }}
                          >
                            {r.win !== null && (
                              <>
                                <span
                                  style={{
                                    fontSize: "0.65rem",
                                    color: "#81b64c",
                                  }}
                                >
                                  W {r.win}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.65rem",
                                    color: "#e63946",
                                  }}
                                >
                                  L {r.loss}
                                </span>
                                {winRate !== null && (
                                  <span
                                    style={{
                                      fontSize: "0.65rem",
                                      color: "#8e8e9a",
                                    }}
                                  >
                                    {winRate}%
                                  </span>
                                )}
                              </>
                            )}
                            {r.best && r.best !== r.value && (
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  color: "#d4af37",
                                }}
                              >
                                Best: {r.best}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontWeight: 700,
                              color: "#81b64c",
                              fontSize: "1.4rem",
                              lineHeight: 1,
                            }}
                          >
                            {r.value}
                          </div>
                          <div
                            style={{
                              fontSize: "0.65rem",
                              color: tier.color,
                              marginTop: 3,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {tier.label}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "#2a2a3e",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, #81b64c88, #81b64c)",
                            borderRadius: 3,
                            transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : chesscomError ? (
              <div
                style={{
                  color: "#8e8e9a",
                  textAlign: "center",
                  padding: "2rem",
                  fontSize: "0.85rem",
                }}
              >
                ⚠ Could not load Chess.com ratings. The API may be temporarily
                unavailable.
              </div>
            ) : (
              <div
                style={{
                  color: "#8e8e9a",
                  textAlign: "center",
                  padding: "2rem",
                  fontSize: "0.85rem",
                }}
              >
                No rated games found yet on Chess.com.
              </div>
            )}
          </div>

          {/* ELO Legend */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem 2rem",
              background: "rgba(212,175,55,0.05)",
              border: "1px solid rgba(212,175,55,0.1)",
              borderRadius: 16,
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { range: "< 1200", label: "Beginner", color: "#8e8e9a" },
              { range: "1200–1600", label: "Intermediate", color: "#90e0ef" },
              { range: "1600–2000", label: "Advanced", color: "#baed91" },
              { range: "2000–2200", label: "Expert ★", color: "#d4af37" },
              { range: "2200+", label: "Master", color: "#e63946" },
            ].map((l) => (
              <div key={l.range} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: l.color,
                    marginBottom: 2,
                  }}
                >
                  {l.range}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#8e8e9a" }}>
                  {l.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label">Live Stats · Lichess</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
              }}
            >
              My <span className="gold-shimmer">Achievements</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {ACHIEVEMENTS.map((a, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: "linear-gradient(135deg, #13131e, #1a1a2e)",
                  border: "1px solid rgba(212,175,55,0.12)",
                  borderRadius: 20,
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(90deg, transparent, #d4af37, transparent)",
                  }}
                />
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                  {a.icon}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: lichessLoading ? "1.2rem" : "2rem",
                    fontWeight: 900,
                    color: "#d4af37",
                    lineHeight: 1,
                    minHeight: "2.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {lichessLoading ? (
                    <span style={{ color: "#3a3a4a", fontSize: "1rem" }}>
                      loading…
                    </span>
                  ) : (
                    a.value
                  )}
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    margin: "0.5rem 0 0.25rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {a.label}
                </div>
                <div style={{ color: "#8e8e9a", fontSize: "0.75rem" }}>
                  {a.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAVORITES PLAYERS */}
      <section
        style={{ padding: "6rem 2rem", background: "rgba(255,255,255,0.02)" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label">Icons</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
              }}
            >
              My Chess <span className="gold-shimmer">Idols</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                name: "Mikhail Tal",
                title: "The Magician from Riga",
                years: "1936–1992",
                piece: "♜",
                color: "#e63946",
                desc: "8th World Champion. Known for wild sacrifices and attacking brilliance that bewildered even computers. Tal played chess like a poet — irrational, beautiful, and devastating.",
                stat: "World Champ 1960",
              },
              {
                name: "Bobby Fischer",
                title: "The Greatest of All Time",
                years: "1943–2008",
                piece: "♛",
                color: "#f4a261",
                desc: "11th World Champion. The most dominant player in chess history with a 20/20 score in the 1963–64 US Championship. His precision and psychological warfare changed chess forever.",
                stat: "Peak Rating: 2785",
              },
              {
                name: "Alexander Alekhine",
                title: "The Chess Machine",
                years: "1892–1946",
                piece: "♞",
                color: "#c77dff",
                desc: "4th World Champion and one of the most ferocious attacking players ever. Alekhine combined deep positional understanding with tactical venom — a complete chess genius who never relinquished his title.",
                stat: "World Champ 1927–46",
              },
              {
                name: "Paul Morphy",
                title: "The Pride and Sorrow of Chess",
                years: "1837–1884",
                piece: "♔",
                color: "#ffd166",
                desc: "The unofficial World Champion of the 19th century. Morphy was 150 years ahead of his time — his open, rapid development and combinative brilliance destroyed all opposition. Many consider him the greatest natural talent chess has ever seen.",
                stat: "Unbeaten 1857–59",
              },
            ].map((player, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: "linear-gradient(160deg, #13131e, #1a1a2e)",
                  border: `1px solid ${player.color}30`,
                  borderRadius: 20,
                  padding: "2.5rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    fontSize: "7rem",
                    opacity: 0.06,
                    color: player.color,
                  }}
                >
                  {player.piece}
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `${player.color}18`,
                    border: `1px solid ${player.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {player.piece}
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    background: `${player.color}18`,
                    border: `1px solid ${player.color}40`,
                    borderRadius: 20,
                    fontSize: "0.7rem",
                    color: player.color,
                    marginBottom: "1rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {player.stat}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    marginBottom: 4,
                  }}
                >
                  {player.name}
                </h3>
                <div
                  style={{
                    color: player.color,
                    fontSize: "0.8rem",
                    marginBottom: 4,
                  }}
                >
                  {player.title}
                </div>
                <div
                  style={{
                    color: "#8e8e9a",
                    fontSize: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  {player.years}
                </div>
                <p
                  style={{
                    color: "#8e8e9a",
                    lineHeight: 1.7,
                    fontSize: "0.85rem",
                  }}
                >
                  {player.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES CAROUSEL */}
      <section
        id="quotes"
        style={{
          padding: "6rem 2rem",
          background: "linear-gradient(180deg, #0d0d14, #13131e)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
          <ChessBoard size={10} />
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label">Words of Wisdom</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
              }}
            >
              Timeless <span className="gold-shimmer">Quotes</span>
            </h2>
          </div>
          {/* Giant quote mark */}
          <div
            style={{
              position: "absolute",
              top: 100,
              left: "5%",
              fontSize: "15rem",
              lineHeight: 1,
              color: "rgba(212,175,55,0.04)",
              fontFamily: "Georgia, serif",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            "
          </div>
          <QuoteCarousel />
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "3rem 2rem",
          borderTop: "1px solid rgba(212,175,55,0.1)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          ♔ ♕ ♖ ♗ ♘ ♙
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            color: "#d4af37",
            marginBottom: "0.5rem",
          }}
        >
          Crafted with love for the game
        </div>
        {/* <div style={{ color: "#8e8e9a", fontSize: "0.8rem" }}>
          Mumbai, India · Lichess & Chess.com Active Player
        </div> */}
        <div
          style={{ marginTop: "1.5rem", color: "#3a3a4a", fontSize: "0.75rem" }}
        >
          "Every chess master was once a beginner." — Irving Chernev
        </div>
      </footer>
    </div>
  );
}
