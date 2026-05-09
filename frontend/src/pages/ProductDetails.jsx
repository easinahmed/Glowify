import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../api/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-1 { animation: fadeUp 0.6s 0.0s ease both; }
  .anim-2 { animation: fadeUp 0.6s 0.1s ease both; }
  .anim-3 { animation: fadeUp 0.6s 0.2s ease both; }
  .anim-4 { animation: fadeUp 0.6s 0.3s ease both; }
  .anim-5 { animation: fadeUp 0.6s 0.4s ease both; }
  .anim-6 { animation: fadeUp 0.6s 0.5s ease both; }

  .thumb { transition: all 0.2s ease; cursor: pointer; }
  .thumb:hover { opacity: 0.85; }

  .add-btn {
    transition: all 0.25s ease;
  }
  .add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(90,60,55,0.4) !important;
  }
  .add-btn:active { transform: translateY(0); }

  .qty-btn {
    transition: background 0.2s;
  }
  .qty-btn:hover { background: #e8d5ce !important; }

  .accordion-chevron {
    transition: transform 0.3s ease;
  }
  .accordion-chevron.open {
    transform: rotate(180deg);
  }

  input::placeholder { color: #c4ada7; }
`;

export default function ProductDetails() {
  const { id } = useParams();
  const [activeThumb, setActiveThumb] = useState(0);
  const [qty, setQty] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf6f2' }}>
        <p className="text-base text-[#7a5c56]">Loading product...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf6f2' }}>
        <p className="text-base text-[#b6403b]">Product not found.</p>
      </div>
    );
  }

  const THUMBNAILS = [
    product.image,
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80",
  ];

  const MAIN_IMAGE = product.image;
  const SKIN_TAGS = ["ALL SKIN TYPES", "SENSITIVE SAFE", "DERMATOLOGIST TESTED"];

  const ACTIVES = [
    {
      icon: "💧",
      name: "Hyaluronic Acid (2%)",
      desc: "Multi-molecular weights to hydrate both the surface and deep layers of the epidermis.",
    },
    {
      icon: "🌿",
      name: "Niacinamide (5%)",
      desc: "Refines skin texture, balances oil production, and visibly reduces the appearance of pores.",
    },
    {
      icon: "🌹",
      name: "Rosehip Seed Extract",
      desc: "Naturally rich in Vitamin A and C to promote cell turnover and brighten the complexion.",
    },
  ];

  const RITUAL_STEPS = [
    {
      num: "01",
      title: "Cleanse & Prep",
      desc: "Start with a fresh canvas. Use our Purifying Cleanser to remove impurities and pat dry gently.",
    },
    {
      num: "02",
      title: "Apply Serum",
      desc: "Dispense 2–3 drops onto your fingertips. Gently press and massage into your face, neck, and décolletage.",
    },
    {
      num: "03",
      title: "Seal with Care",
      desc: "Wait 30 seconds for full absorption, then follow with your preferred moisturizer to lock in the actives.",
    },
  ];

  return (
    <>
      <style>{styles}</style>

      <div
        className="min-h-screen w-full"
        style={{ background: "#fdf6f2", fontFamily: "'Jost', sans-serif" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-12 md:py-16">

          {/* ── TOP: Image + Info ── */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-16 md:mb-24">

            {/* Left: Images */}
            <div className="flex flex-col gap-4 lg:w-[48%] shrink-0 anim-1">
              {/* Main Image */}
              <div
                className="w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: "1/1" }}
              >
                <img
                  src={THUMBNAILS[activeThumb] || MAIN_IMAGE}
                  alt="Dewy Radiance Serum"
                  className="w-full h-full object-cover"
                  style={{ transition: "opacity 0.3s ease" }}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {THUMBNAILS.map((src, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className="thumb rounded-xl overflow-hidden"
                    style={{
                      width: "80px",
                      height: "80px",
                      border: activeThumb === i
                        ? "2px solid #7a5c56"
                        : "2px solid transparent",
                      boxShadow: activeThumb === i
                        ? "0 0 0 1px #7a5c56"
                        : "none",
                    }}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col flex-1">

              {/* Category */}
              <p
                className="anim-1 text-[10px] tracking-[0.22em] uppercase mb-3"
                style={{ color: "#9e8a85", fontWeight: "400" }}
              >
                {product.category}
              </p>

              {/* Name */}
              <h1
                className="anim-2 mb-3 leading-tight"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: "400",
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  color: "#2e2420",
                  letterSpacing: "-0.01em",
                }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <p
                className="anim-2 text-xl mb-5"
                style={{ fontWeight: "400", color: "#2e2420", letterSpacing: "0.02em" }}
              >
                ${product.price}.00
              </p>

              {/* Description */}
              <p
                className="anim-3 text-sm leading-relaxed mb-7"
                style={{
                  fontWeight: "300",
                  color: "#7a6560",
                  letterSpacing: "0.01em",
                  maxWidth: "480px",
                }}
              >
                {product.description || "A transformative ritual in a bottle. This lightweight, silky serum penetrates deep into the dermal layers to deliver intense hydration and a lit-from-within glow. Crafted with expert-grade botanicals to restore your skin's natural vitality."}
              </p>

              {/* Qty + Add to Cart */}
              <div className="anim-4 flex items-center gap-4 mb-5">
                {/* Qty */}
                <div
                  className="flex items-center rounded-full overflow-hidden"
                  style={{ border: "1px solid #d4c4be" }}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="qty-btn w-10 h-11 text-base flex items-center justify-center bg-transparent border-0 cursor-pointer"
                    style={{ color: "#2e2420" }}
                  >
                    −
                  </button>
                  <span
                    className="w-8 text-center text-sm"
                    style={{ fontWeight: "400", color: "#2e2420" }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="qty-btn w-10 h-11 text-base flex items-center justify-center bg-transparent border-0 cursor-pointer"
                    style={{ color: "#2e2420" }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  className="add-btn flex-1 rounded-full py-3.5 text-sm tracking-[0.12em] uppercase text-white border-0 cursor-pointer"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: "400",
                    background: added
                      ? "linear-gradient(135deg, #6a9e6a, #4a7a4a)"
                      : "linear-gradient(135deg, #7a5c56 0%, #5e4540 100%)",
                    boxShadow: "0 4px 18px rgba(90,60,55,0.28)",
                    transition: "all 0.25s ease",
                  }}
                >
                  {added ? "✓ Added to Cart" : "Add to Cart"}
                </button>
              </div>

              {/* Shipping note */}
              <p
                className="anim-4 text-xs mb-8 flex items-center gap-2"
                style={{ color: "#9e8a85", fontWeight: "300" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 5v4h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="1.5" />
                  <circle cx="18.5" cy="18.5" r="1.5" />
                </svg>
                Complimentary shipping on orders over $75
              </p>

              {/* Skin Compatibility Accordion */}
              <div
                className="anim-5 rounded-2xl overflow-hidden"
                style={{ border: "1px solid #e8d5ce" }}
              >
                <button
                  onClick={() => setAccordionOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-0 cursor-pointer"
                  style={{ background: "rgba(255,252,250,0.6)" }}
                >
                  <span
                    className="text-sm tracking-wide"
                    style={{ fontWeight: "400", color: "#2e2420" }}
                  >
                    Skin Compatibility
                  </span>
                  <svg
                    className={`accordion-chevron ${accordionOpen ? "open" : ""}`}
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#9e8a85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {accordionOpen && (
                  <div
                    className="px-5 pb-5 flex flex-wrap gap-2"
                    style={{ background: "rgba(255,252,250,0.6)" }}
                  >
                    {SKIN_TAGS.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                        style={{
                          border: "1px solid #d4c4be",
                          color: "#7a6560",
                          fontWeight: "400",
                          background: "transparent",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ── BOTTOM: Key Actives + The Ritual ── */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">

            {/* Key Actives */}
            <div className="flex-1 anim-6">
              <h2
                className="mb-2 leading-snug"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: "400",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#2e2420",
                }}
              >
                Key Actives
              </h2>
              <p
                className="text-sm mb-8 leading-relaxed"
                style={{ fontWeight: "300", color: "#9e8a85", maxWidth: "380px" }}
              >
                Transparency is at the heart of our ritual. We use only the
                highest-purity ingredients to ensure results you can see and feel.
              </p>

              <div className="flex flex-col gap-6">
                {ACTIVES.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base"
                      style={{ background: "#f0e4de" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-sm mb-1"
                        style={{ fontWeight: "500", color: "#2e2420" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ fontWeight: "300", color: "#9e8a85" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="mt-8 text-[10px] tracking-[0.18em] uppercase bg-transparent border-0 cursor-pointer pb-0.5"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  color: "#7a5c56",
                  borderBottom: "1px solid #c4ada7",
                  fontWeight: "400",
                }}
              >
                View Full Ingredients Glossary
              </button>
            </div>

            {/* The Ritual */}
            <div
              className="flex-1 rounded-3xl px-8 py-10 anim-6"
              style={{ background: "#f5ddd8" }}
            >
              <h2
                className="mb-8 leading-snug"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: "400",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#2e2420",
                }}
              >
                The Ritual
              </h2>

              <div className="flex flex-col gap-7">
                {RITUAL_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    {/* Step Number */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs"
                      style={{
                        border: "1px solid #c4ada7",
                        background: "transparent",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: "400",
                        color: "#7a6560",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <p
                        className="text-sm mb-1"
                        style={{ fontWeight: "500", color: "#2e2420" }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ fontWeight: "300", color: "#7a6560" }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}