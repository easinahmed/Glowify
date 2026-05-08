import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-1 { animation: fadeUp 0.7s 0.0s ease both; }
  .anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
  .anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
  .anim-4 { animation: fadeUp 0.7s 0.45s ease both; }

  .email-input::placeholder { color: #c4ada7; }
  .email-input:focus { outline: none; }

  .join-btn {
    transition: all 0.25s ease;
  }
  .join-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(90,60,55,0.38) !important;
  }
  .join-btn:active { transform: translateY(0); }
`;

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (!email) return;
    setJoined(true);
    setEmail("");
    setTimeout(() => setJoined(false), 3000);
  };

  return (
    <>
      <style>{styles}</style>

      <section
        className="w-full py-10 md:py-14 px-6 md:px-12 lg:px-16"
        style={{ background: "#fdf0ee", fontFamily: "'Jost', sans-serif" }}
      >
        <div className=" container max-w-7xl">

          {/* Card */}
          <div
            className="w-full rounded-3xl overflow-hidden flex flex-col md:flex-row"
            style={{ minHeight: "420px" }}
          >

            {/* Left: Content */}
            <div
              className="flex-1 flex flex-col justify-center px-10 md:px-14 lg:px-16 py-14 md:py-16"
              style={{ background: "#f5ddd8" }}
            >

              <p
                className="anim-1 text-[10px] tracking-[0.22em] uppercase mb-5"
                style={{ color: "#9e8a85", fontWeight: "400" }}
              >
                The Glowify Ritual
              </p>

              <h2
                className="anim-2 leading-tight mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: "400",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "#2e2420",
                  letterSpacing: "-0.01em",
                }}
              >
                Beyond Skincare.
                <br />
                A Moment for
                <br />
                You.
              </h2>

              <p
                className="anim-3 text-sm leading-relaxed mb-8"
                style={{
                  fontWeight: "300",
                  color: "#7a6560",
                  letterSpacing: "0.01em",
                  maxWidth: "360px",
                }}
              >
                Sign up to receive curated self-care rituals, early
                access to new collections, and a gift on your birthday.
              </p>

              {/* Email Input Row */}
              <div className="anim-4 flex items-center gap-0 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="Your email address"
                  className="email-input flex-1 px-5 py-3.5 text-sm rounded-l-full rounded-r-none border-0"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: "300",
                    background: "#fdf6f4",
                    color: "#2e2420",
                    fontSize: "13.5px",
                    boxShadow: "none",
                  }}
                />
                <button
                  onClick={handleJoin}
                  className="join-btn rounded-r-full rounded-l-none px-6 py-3.5 text-[11px] tracking-[0.16em] uppercase text-white border-0 cursor-pointer whitespace-nowrap"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: "400",
                    background: joined
                      ? "linear-gradient(135deg, #6a9e6a, #4a7a4a)"
                      : "linear-gradient(135deg, #7a5c56 0%, #5e4540 100%)",
                    boxShadow: "0 4px 18px rgba(90,60,55,0.28)",
                    transition: "all 0.25s ease",
                  }}
                >
                  {joined ? "✓ Joined!" : "Join Us"}
                </button>
              </div>

            </div>

            {/* Right: Image */}
            <div
              className="w-full md:w-[48%] shrink-0 overflow-hidden"
              style={{ minHeight: "280px" }}
            >
              <img
                src="/src/assets/newsletter.png"
                alt="Woman with glowing skin"
                className="w-full h-full object-cover object-center"
                style={{ minHeight: "280px" }}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}