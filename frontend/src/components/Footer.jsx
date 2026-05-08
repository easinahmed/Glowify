const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Jost:wght@300;400;500&display=swap');
`;

const BRAND_LINKS = ["Sustainability", "Ingredients Glossery", "Shipping & Returns"];
const SUPPORT_LINKS = ["Privacy Policy", "Contact"];

export default function Footer() {
  return (
    <>
      <style>{styles}</style>

      <footer
        className="w-full border-t"
        style={{
          background: "#fdf6f2",
          borderColor: "#edddd7",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        <div className="mx-auto max-w-7xl px-8 md:px-12 py-14 md:py-16">
          <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-8">

            {/* Left: Logo + Copyright */}
            <div className="max-w-xs">
              <h2
                className="text-2xl mb-5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: "400",
                  color: "#2e2420",
                  letterSpacing: "0.01em",
                }}
              >
                Glowify
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontWeight: "300",
                  color: "#9e8a85",
                  letterSpacing: "0.01em",
                }}
              >
                © 2024 Glowify. A ritual of self-care. Crafting restorative experiences for mindful beauty.
              </p>
            </div>

            {/* Right: Link Columns */}
            <div className="flex gap-16 md:gap-20">

              {/* The Brand */}
              <div className="flex flex-col gap-5">
                <h3
                  className="text-[10px] tracking-[0.18em] uppercase"
                  style={{ color: "#2e2420", fontWeight: "500" }}
                >
                  The Brand
                </h3>
                <ul className="flex flex-col gap-4 list-none">
                  {BRAND_LINKS.map((link) => (
                    < li key={link}>
                        < a
                      
                        href="#"
                        className="text-sm transition-colors duration-200 hover:text-[#2e2420]"
                        style={{
                          fontWeight: "300",
                          color: "#9e8a85",
                          textDecoration: "none",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="flex flex-col gap-5">
                <h3
                  className="text-[10px] tracking-[0.18em] uppercase"
                  style={{ color: "#2e2420", fontWeight: "500" }}
                >
                  Support
                </h3>
                <ul className="flex flex-col gap-4 list-none">
                  {SUPPORT_LINKS.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-200 hover:text-[#2e2420]"
                        style={{
                          fontWeight: "300",
                          color: "#9e8a85",
                          textDecoration: "none",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </>
  );
}