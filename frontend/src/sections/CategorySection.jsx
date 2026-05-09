import { Link } from 'react-router-dom'



const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-1 { animation: fadeUp 0.6s 0.0s ease both; }
  .anim-2 { animation: fadeUp 0.6s 0.1s ease both; }
  .anim-3 { animation: fadeUp 0.6s 0.2s ease both; }
  .anim-4 { animation: fadeUp 0.6s 0.3s ease both; }
  .anim-5 { animation: fadeUp 0.6s 0.4s ease both; }

  .category-card img {
    transition: transform 0.5s ease;
  }
  .category-card:hover img {
    transform: scale(1.04);
  }
`;

const CATEGORIES = [
  {
    name: "Cleansers",
    desc: "Pure, gentle foundations.",
    image: "/src/assets/category_1.png",
    anim: "anim-2",
  },
  {
    name: "Serums",
    desc: "Concentrated nourishment.",
    image: "/src/assets/category_2.png",
    anim: "anim-3",
  },
  {
    name: "Moisturizers",
    desc: "Lock in the glow.",
    image: "/src/assets/category_3.png",
    anim: "anim-4",
  },
  {
    name: "Sunscreen",
    desc: "Daily environmental shield.",
    image: "/src/assets/category_4.png",
    anim: "anim-5",
  },
];

export default function CategorySection() {
  return (
    <>
      <style>{styles}</style>

      <section
        className="w-full py-14 md:py-20 px-6 md:px-12 lg:px-16"
        style={{ background: "#fdf6f2", fontFamily: "'Jost', sans-serif" }}
      >
        <div className="container mx-auto max-w-7xl">

          {/* Header Row */}
          <div className="anim-1 flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p
                className="text-[10px] tracking-[0.2em] uppercase mb-2"
                style={{ color: "#9e8a85", fontWeight: "400" }}
              >
                Curated Rituals
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: "400",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  color: "#2e2420",
                  letterSpacing: "-0.01em",
                  lineHeight: "1.2",
                }}
              >
                Explore by Category
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden md:block text-sm pb-0.5 transition-colors duration-200 hover:text-[#2e2420]"
              style={{
                fontWeight: "300",
                color: "#9e8a85",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationColor: "#c4ada7",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              View all rituals
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/shop"
                className={`category-card cursor-pointer group ${cat.anim}`}
              >
                {/* Image */}
                <div
                  className="w-full overflow-hidden rounded-2xl mb-4"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text */}
                <h3
                  className="mb-1 transition-colors duration-200 group-hover:text-[#7a5c56]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: "400",
                    fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                    color: "#2e2420",
                    letterSpacing: "0.01em",
                  }}
                >
                  {cat.name}
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontWeight: "300",
                    color: "#9e8a85",
                    letterSpacing: "0.01em",
                  }}
                >
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>

          {/* Mobile: View all link */}
          <div className="md:hidden mt-8 text-center">
            <Link
              to="/shop"
              className="text-sm"
              style={{
                fontWeight: "300",
                color: "#9e8a85",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationColor: "#c4ada7",
                letterSpacing: "0.02em",
              }}
            >
              View all rituals
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}