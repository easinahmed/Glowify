import { useState } from "react";

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

  .product-card {
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(100,60,50,0.1) !important;
  }
  .product-card img {
    transition: transform 0.5s ease;
  }
  .product-card:hover img {
    transform: scale(1.03);
  }

  .add-to-cart-btn {
    transition: all 0.2s ease;
  }
  .add-to-cart-btn:hover {
    background: #2e2420 !important;
    color: white !important;
    border-color: #2e2420 !important;
  }
`;

const PRODUCTS = [
  {
    id: 1,
    name: "Radiance Elixir Oil",
    subtitle: "Hydrate & Brighten",
    price: "$64.00",
    badge: "BESTSELLER",
    badgeColor: "#e8d5ce",
    badgeText: "#7a5c56",
    image: "/images/best_1.png",
    anim: "anim-2",
  },
  {
    id: 2,
    name: "Midnight Recovery Cream",
    subtitle: "Deep Repair",
    price: "$58.00",
    badge: null,
    image: "/images/best_2.png ",
    anim: "anim-3",
  },
  {
    id: 3,
    name: "Zen Mist Toner",
    subtitle: "Calm & Balance",
    price: "$32.00",
    badge: null,
    image: "/images/best_3.png",
    anim: "anim-4",
  },
  {
    id: 4,
    name: "Milky Oat Cleanser",
    subtitle: "Sensitive Skin Safe",
    price: "$42.00",
    badge: "NEW ARRIVAL",
    badgeColor: "#ddeadd",
    badgeText: "#4a6b4a",
    image: "/images/best_4.png",
    anim: "anim-5",
  },
];

export default function BestSellers() {
  const [added, setAdded] = useState({});

  const handleAdd = (id) => {
    setAdded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [id]: false })), 1800);
  };

  return (
    <>
      <style>{styles}</style>

      <section
        className="w-full py-16 md:py-24 px-6 md:px-12 lg:px-16"
        style={{ background: "#fdf0ee", fontFamily: "'Jost', sans-serif" }}
      >
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <div className="anim-1 text-center mb-12 md:mb-14">
            <p
              className="text-[10px] tracking-[0.22em] uppercase mb-3"
              style={{ color: "#9e8a85", fontWeight: "400" }}
            >
              The Glow List
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: "400",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                color: "#2e2420",
                letterSpacing: "-0.01em",
              }}
            >
              Best-Selling Essentials
            </h2>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className={`product-card flex flex-col rounded-2xl overflow-hidden ${product.anim}`}
                style={{
                  background: "#fff",
                  border: "1px solid #f0e4df",
                  boxShadow: "0 4px 20px rgba(100,60,50,0.05)",
                }}
              >
                {/* Image */}
                <div
                  className="w-full overflow-hidden"
                  style={{ aspectRatio: "1/1" }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">

                  {/* Badge */}
                  {product.badge && (
                    <span
                      className="self-start text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        background: product.badgeColor,
                        color: product.badgeText,
                        fontWeight: "500",
                      }}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Name + Subtitle */}
                  <div>
                    <h3
                      className="mb-1 leading-snug"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: "500",
                        fontSize: "1.15rem",
                        color: "#2e2420",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-xs"
                      style={{
                        fontWeight: "300",
                        color: "#9e8a85",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <p
                    className="text-base"
                    style={{
                      fontWeight: "500",
                      color: "#2e2420",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {product.price}
                  </p>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAdd(product.id)}
                    className="add-to-cart-btn mt-auto w-full rounded-full py-3 text-[11px] tracking-[0.16em] uppercase cursor-pointer"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: "400",
                      background: added[product.id] ? "#2e2420" : "transparent",
                      color: added[product.id] ? "#fff" : "#2e2420",
                      border: "1px solid #d4c4be",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {added[product.id] ? "✓ Added" : "Add to Cart"}
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}