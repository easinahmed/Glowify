'use client';

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-1 { animation: fadeUp 0.5s 0.0s ease both; }
  .anim-2 { animation: fadeUp 0.5s 0.05s ease both; }
  .anim-3 { animation: fadeUp 0.5s 0.1s ease both; }
`;

const CATEGORIES = ["CLEANSER", "SERUM", "MOISTURIZER", "TONER", "RITUAL"];
const SORT_OPTIONS = ["Newest Arrivals", "Price: Low to High", "Price: High to Low"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [checkedCats, setCheckedCats] = useState([]);
  const [priceMax, setPriceMax] = useState(200);
  const [sort, setSort] = useState("Newest Arrivals");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const urlCategory = searchParams.get('category');

  // Sync with URL and clear filters when "Shop All" is clicked
  useEffect(() => {
    if (urlCategory) {
      setCheckedCats([urlCategory]);
    } else {
      setCheckedCats([]);        // Important: Clear when no category in URL
    }
  }, [urlCategory]);

  const categoryParam = checkedCats.length ? checkedCats.join('|') : undefined;
  
  const sortParam = sort === 'Price: Low to High' ? 'priceAsc' 
                 : sort === 'Price: High to Low' ? 'priceDesc' 
                 : 'newest';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', categoryParam, priceMax, sortParam, currentPage],
    queryFn: () => fetchProducts({ 
      category: categoryParam, 
      maxPrice: priceMax, 
      sort: sortParam,
      page: currentPage,
      limit 
    }),
    keepPreviousData: true,
  });

  const products = data?.products || data || [];
  const totalPages = data?.totalPages || Math.ceil((data?.total || 0) / limit) || 1;

  const toggleCat = (cat) => {
    const newCats = checkedCats.includes(cat) ? [] : [cat];
    setCheckedCats(newCats);
    setCurrentPage(1);

    if (newCats.length > 0) {
      setSearchParams({ category: newCats[0] });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setCheckedCats([]);
    setPriceMax(200);
    setSort("Newest Arrivals");
    setCurrentPage(1);
    setSearchParams({});           // Clear URL
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setSortOpen(false);
    setCurrentPage(1);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#fdf6f2]">Loading products...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center bg-[#fdf6f2]">Failed to load products.</div>;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen w-full" style={{ background: "#fdf6f2", fontFamily: "'Jost', sans-serif" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">

          <p className="anim-1 text-xs tracking-widest uppercase mb-6 text-[#9e8a85]">
            Home › Shop All
          </p>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#2e2420]">Curated Essentials</h1>
              <p className="text-[#9e8a85] mt-2">Nature meets science in intentional rituals.</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-5 py-3 border rounded-full text-sm bg-white"
                style={{ borderColor: "#d4c4be" }}
              >
                {sort} ↓
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleSortChange(opt)}
                      className={`w-full text-left px-6 py-3.5 hover:bg-[#fdf0ee] ${sort === opt ? 'font-medium bg-[#f9ece6]' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="mb-8">
                <p className="uppercase text-xs tracking-widest mb-4 font-medium">Category</p>
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedCats.includes(cat)}
                      onChange={() => toggleCat(cat)}
                      className="w-4 h-4 accent-[#7a5c56]"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>

              <div className="mb-8">
                <p className="uppercase text-xs tracking-widest mb-4 font-medium">Price</p>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={priceMax}
                  onChange={(e) => { setPriceMax(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-[#7a5c56]"
                />
                <div className="flex justify-between text-xs mt-2 text-[#9e8a85]">
                  <span>$0</span>
                  <span>${priceMax}</span>
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full py-3 bg-[#5e4540] text-white rounded-xl text-sm tracking-widest hover:bg-[#4a3632]"
              >
                CLEAR ALL FILTERS
              </button>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                {products.map((product, i) => (
                  <Link
                    key={product._id}
                    to={`/shop/${product._id}`}
                    className="product-card rounded-2xl overflow-hidden bg-white border border-[#f0e4df] group"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-[#9e8a85]">{product.category}</p>
                      <h3 className="font-serif text-base md:text-lg mt-1 mb-1 leading-tight">{product.name}</h3>
                      <p className="font-medium">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {products.length === 0 && (
                <p className="text-center py-20 text-gray-500">No products found.</p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-16">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-5 py-2 border rounded-xl disabled:opacity-50">Previous</button>
                  {Array.from({ length: totalPages }, (_, i) => i+1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl ${currentPage === page ? 'bg-[#7a5c56] text-white' : 'border hover:bg-gray-100'}`}>{page}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-5 py-2 border rounded-xl disabled:opacity-50">Next</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}