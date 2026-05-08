import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-1 { animation: fadeUp 0.5s 0.0s ease both; }
  .anim-2 { animation: fadeUp 0.5s 0.05s ease both; }
  .anim-3 { animation: fadeUp 0.5s 0.1s ease both; }
  .anim-4 { animation: fadeUp 0.5s 0.15s ease both; }
  .anim-5 { animation: fadeUp 0.5s 0.2s ease both; }
  .anim-6 { animation: fadeUp 0.5s 0.25s ease both; }

  .product-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(100,60,50,0.1) !important; }
  .product-card img { transition: transform 0.5s ease; }
  .product-card:hover img { transform: scale(1.04); }

  .range-input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 2px;
    background: #d4c4be;
    outline: none;
    border-radius: 2px;
  }
  .range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #7a5c56;
    cursor: pointer;
  }
  .range-input::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #7a5c56;
    cursor: pointer;
    border: none;
  }

  .page-btn { transition: all 0.2s ease; }
  .page-btn:hover { background: #f0e4de !important; }

  .clear-btn { transition: all 0.2s ease; }
  .clear-btn:hover { background: #5e4540 !important; }
`;

const CATEGORIES = ["Cleansers", "Serums", "Moisturizers", "Oils"];
const SKIN_TYPES = ["ALL", "OILY", "DRY", "COMBINATION", "SENSITIVE"];
const SORT_OPTIONS = ["Newest Arrivals", "Price: Low to High", "Price: High to Low", "Best Sellers"];

const PRODUCTS = [
  {
    id: 1,
    name: "Midnight Renewal Oil",
    category: "SERUM",
    price: 68,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80",
  },
  {
    id: 2,
    name: "Velvet Cloud Cream",
    category: "MOISTURIZER",
    price: 52,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
  },
  {
    id: 3,
    name: "Gentle Botanicals Milk",
    category: "CLEANSER",
    price: 45,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
  },
  {
    id: 4,
    name: "Aura Glow Elixir",
    category: "SERUM",
    price: 82,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80",
  },
  {
    id: 5,
    name: "Earthbound Clay Mask",
    category: "RITUAL",
    price: 58,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80",
  },
  {
    id: 6,
    name: "Rose Quartz Mist",
    category: "TONER",
    price: 38,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
  },
];

export default function Shop() {
  const [checkedCats, setCheckedCats] = useState(["Serums"]);
  const [activeSkin, setActiveSkin] = useState("ALL");
  const [priceMax, setPriceMax] = useState(200);
  const [sort, setSort] = useState("Newest Arrivals");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleCat = (cat) => {
    setCheckedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setCheckedCats([]);
    setActiveSkin("ALL");
    setPriceMax(200);
  };

  const filtered = PRODUCTS.filter((p) => p.price <= priceMax);

  return (
    <>
      <style>{styles}</style>

      <div
        className="min-h-screen w-full"
        style={{ background: "#fdf6f2", fontFamily: "'Jost', sans-serif" }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-14 py-10 md:py-14">

          {/* ── Breadcrumb ── */}
          <p
            className="anim-1 text-[11px] tracking-[0.12em] uppercase mb-5"
            style={{ color: "#9e8a85", fontWeight: "300" }}
          >
            Home &nbsp;›&nbsp; Shop All
          </p>

          {/* ── Page Header + Sort ── */}
          <div className="anim-2 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1
                className="mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: "400",
                  fontSize: "clamp(2rem, 4vw, 2.6rem)",
                  color: "#2e2420",
                  letterSpacing: "-0.01em",
                }}
              >
                Curated Essentials
              </h1>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontWeight: "300",
                  color: "#9e8a85",
                  maxWidth: "380px",
                  letterSpacing: "0.01em",
                }}
              >
                Harness the power of nature and science to reveal your most radiant
                self through intentional rituals.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <div
                className="flex items-center gap-3 text-xs"
                style={{ color: "#9e8a85" }}
              >
                <span className="tracking-widest uppercase text-[10px]">Sort by:</span>
                <button
                  onClick={() => setSortOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border bg-transparent cursor-pointer text-sm"
                  style={{
                    borderColor: "#d4c4be",
                    color: "#2e2420",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: "300",
                  }}
                >
                  {sort}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
              {sortOpen && (
                <div
                  className="absolute right-0 top-10 z-20 rounded-2xl overflow-hidden w-48"
                  style={{
                    background: "#fff",
                    border: "1px solid #e8d5ce",
                    boxShadow: "0 8px 30px rgba(100,60,50,0.1)",
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSort(opt); setSortOpen(false); }}
                      className="w-full text-left px-5 py-3 text-sm border-0 bg-transparent cursor-pointer transition-colors duration-150 hover:bg-[#fdf0ee]"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: sort === opt ? "400" : "300",
                        color: sort === opt ? "#2e2420" : "#9e8a85",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Main Layout ── */}
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Sidebar Filters ── */}
            <aside className="lg:w-52 shrink-0 anim-3">

              {/* Category */}
              <div className="mb-8">
                <p
                  className="text-[10px] tracking-widest uppercase mb-4"
                  style={{ fontWeight: "500", color: "#2e2420" }}
                >
                  Category
                </p>
                <div className="flex flex-col gap-3">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div
                        onClick={() => toggleCat(cat)}
                        className="w-4 h-4 rounded flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150"
                        style={{
                          border: checkedCats.includes(cat)
                            ? "none"
                            : "1px solid #c4ada7",
                          background: checkedCats.includes(cat)
                            ? "#7a5c56"
                            : "transparent",
                        }}
                      >
                        {checkedCats.includes(cat) && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2 6 5 9 10 3" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-sm cursor-pointer"
                        onClick={() => toggleCat(cat)}
                        style={{
                          fontWeight: checkedCats.includes(cat) ? "400" : "300",
                          color: checkedCats.includes(cat) ? "#2e2420" : "#9e8a85",
                        }}
                      >
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skin Type */}
              <div className="mb-8">
                <p
                  className="text-[10px] tracking-widest uppercase mb-4"
                  style={{ fontWeight: "500", color: "#2e2420" }}
                >
                  Skin Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveSkin(type)}
                      className="rounded-full px-3 py-1.5 text-[10px] tracking-widest uppercase border bg-transparent cursor-pointer transition-all duration-150"
                      style={{
                        borderColor: activeSkin === type ? "#7a5c56" : "#d4c4be",
                        color: activeSkin === type ? "#5e4540" : "#9e8a85",
                        background: activeSkin === type
                          ? "rgba(122,92,86,0.08)"
                          : "transparent",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: activeSkin === type ? "400" : "300",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <p
                  className="text-[10px] tracking-widest uppercase mb-4"
                  style={{ fontWeight: "500", color: "#2e2420" }}
                >
                  Price Range
                </p>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="range-input mb-3"
                />
                <div
                  className="flex justify-between text-xs"
                  style={{ fontWeight: "300", color: "#9e8a85" }}
                >
                  <span>$0</span>
                  <span>${priceMax === 200 ? "200+" : priceMax}</span>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="clear-btn w-full rounded-xl py-3 text-[11px] tracking-[0.18em] uppercase text-white border-0 cursor-pointer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: "400",
                  background: "linear-gradient(135deg, #7a5c56 0%, #5e4540 100%)",
                }}
              >
                Clear Filters
              </button>
            </aside>

            {/* ── Product Grid ── */}
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <div
                    key={product.id}
                    className={`product-card rounded-2xl overflow-hidden cursor-pointer anim-${Math.min(i + 1, 6)}`}
                    style={{
                      background: "#fff",
                      border: "1px solid #f0e4df",
                      boxShadow: "0 2px 12px rgba(100,60,50,0.05)",
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

                    {/* Info */}
                    <div className="px-4 py-4">
                      <p
                        className="text-[9px] tracking-[0.16em] uppercase mb-1.5"
                        style={{ fontWeight: "400", color: "#9e8a85" }}
                      >
                        {product.category}
                      </p>
                      <h3
                        className="mb-1.5 leading-snug"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: "400",
                          fontSize: "1.05rem",
                          color: "#2e2420",
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ fontWeight: "400", color: "#2e2420" }}
                      >
                        ${product.price}.00
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Pagination ── */}
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="page-btn w-9 h-9 rounded-full flex items-center justify-center border bg-transparent cursor-pointer"
                  style={{ borderColor: "#d4c4be", color: "#9e8a85" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="page-btn w-9 h-9 rounded-full flex items-center justify-center border text-sm cursor-pointer transition-all duration-200"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: currentPage === page ? "400" : "300",
                      borderColor: currentPage === page ? "transparent" : "#d4c4be",
                      background: currentPage === page
                        ? "linear-gradient(135deg, #7a5c56 0%, #5e4540 100%)"
                        : "transparent",
                      color: currentPage === page ? "#fff" : "#9e8a85",
                      boxShadow: currentPage === page
                        ? "0 4px 14px rgba(90,60,55,0.28)"
                        : "none",
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="page-btn w-9 h-9 rounded-full flex items-center justify-center border bg-transparent cursor-pointer"
                  style={{ borderColor: "#d4c4be", color: "#9e8a85" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}