const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-1 { animation: fadeUp 0.8s 0.1s ease both; }
  .anim-2 { animation: fadeUp 0.8s 0.3s ease both; }
  .anim-3 { animation: fadeUp 0.8s 0.5s ease both; }
`;

export default function HeroSection() {
  return (
    <>
      <style>{styles}</style>

      <section
        className="relative w-full overflow-hidden pt-20"
        style={{ minHeight: "520px", height: "62vh", maxHeight: "720px" }}
      >
        {/* Background Image */}
        <img
          src="Hero.png"
          alt="Skincare products on stone surface"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Subtle dark overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(40,28,24,0.38) 0%, rgba(40,28,24,0.18) 50%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div className="container mx-auto">
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-2xl">

          {/* Heading */}
          <h1
            className="anim-1 mb-5 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: "400",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              color: "#fff",
              letterSpacing: "-0.01em",
            }}
          >
            Reveal Your Natural Glow.
          </h1>

          {/* Subtext */}
          <p
            className="anim-2 mb-8 leading-relaxed"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: "300",
              fontSize: "clamp(13px, 1.5vw, 15px)",
              color: "#fff",
              letterSpacing: "0.01em",
              maxWidth: "340px",
            }}
          >
            Personalized skincare for your unique skin.
            <br />
            Experience the ritual of restorative beauty.
          </p>

          {/* CTA Button */}
          <div className="anim-3">
            <button
              className="rounded-full px-10 py-4 text-xs tracking-[0.2em] uppercase text-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: "400",
                background: "linear-gradient(135deg, #7a5c56 0%, #5e4540 100%)",
                boxShadow: "0 4px 20px rgba(90,60,55,0.35)",
                border: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 8px 28px rgba(90,60,55,0.45)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 20px rgba(90,60,55,0.35)")
              }
            >
              Shop the Collection
            </button>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}