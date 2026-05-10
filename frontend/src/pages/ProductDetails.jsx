'use client';

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProductById, addToCart } from "../api/api";
import { useAuth } from "../context/AuthContext";

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

  .thumb { transition: all 0.3s ease; cursor: pointer; }
  .thumb:hover { opacity: 0.9; transform: scale(1.05); }
  .thumb-active { border: 2px solid #7a5c56; box-shadow: 0 0 0 3px rgba(122,92,86,0.15); }
`;

export default function ProductDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [activeThumb, setActiveThumb] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(true);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(product._id, qty),
    onSuccess: () => {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        navigate('/auth/login');
      }
    }
  });

  const handleAddToCart = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    addToCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6f2]">
        <p className="text-lg text-[#7a5c56]">Loading your ritual...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6f2]">
        <p className="text-lg text-red-600">Product not found</p>
      </div>
    );
  }

  // Dynamic Thumbnails
  const thumbnails = [
    product.image,
    ...(product.additionalImages || []),
    ...(product.images || [])
  ].filter(Boolean);

  const mainImage = thumbnails[activeThumb] || product.image;

  // Dynamic Content
  const keyActives = product.keyActives || [];
  const ritualSteps = product.ritualSteps || [];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen w-full" style={{ background: "#fdf6f2", fontFamily: "'Jost', sans-serif" }}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-12 md:py-16">

          {/* Main Product Section */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-20">

            {/* Images Section */}
            <div className="lg:w-1/2 anim-1">
              <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {thumbnails.length > 1 && (
                <div className="flex gap-4 mt-6">
                  {thumbnails.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveThumb(index)}
                      className={`thumb w-20 h-20 rounded-2xl overflow-hidden border-2 ${activeThumb === index ? 'thumb-active' : 'border-transparent'}`}
                    >
                      <img 
                        src={img} 
                        alt={`view ${index}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 anim-2">
              <p className="uppercase tracking-widest text-xs text-[#9e8a85]">{product.category}</p>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight mt-2 mb-4">{product.name}</h1>
              <p className="text-2xl font-medium mb-6">${product.price}</p>

              <p className="text-[#7a6560] leading-relaxed mb-8 text-[15.5px]">
                {product.description}
              </p>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex border border-[#d4c4be] rounded-full overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 text-2xl hover:bg-gray-100">-</button>
                  <span className="w-12 flex items-center justify-center font-medium text-lg">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 text-2xl hover:bg-gray-100">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-full text-white text-sm tracking-widest uppercase font-medium transition-all"
                  style={{
                    background: added ? "#4a7a4a" : "linear-gradient(135deg, #7a5c56, #5e4540)"
                  }}
                >
                  {added ? "✓ Added to Cart" : "Add to Cart"}
                </button>
              </div>

              <p className="text-xs text-[#9e8a85]">Free shipping on orders over $75</p>
            </div>
          </div>

          {/* Key Actives & Ritual Section */}
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

            {/* Key Actives */}
            <div className="anim-3">
              <h2 className="text-3xl font-serif mb-8 text-[#2e2420]">Key Actives</h2>
              <div className="space-y-8">
                {keyActives.length > 0 ? (
                  keyActives.map((active, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-12 h-12 flex items-center justify-center text-3xl bg-[#f0e4de] rounded-full shrink-0">
                        {active.icon || "✦"}
                      </div>
                      <div>
                        <h4 className="font-medium text-lg mb-1.5">{active.name}</h4>
                        <p className="text-sm text-[#7a6560] leading-relaxed">{active.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No active ingredients listed.</p>
                )}
              </div>
            </div>

            {/* The Ritual */}
            <div className="anim-4 bg-[#f5ddd8] rounded-3xl p-8 md:p-10">
              <h2 className="text-3xl font-serif mb-8 text-[#2e2420]">The Ritual</h2>
              <div className="space-y-8">
                {ritualSteps.length > 0 ? (
                  ritualSteps.map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-9 h-9 rounded-full border border-[#c4ada7] flex items-center justify-center text-xs font-medium shrink-0 text-[#7a6560]">
                        {step.num || `0${i+1}`}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{step.title}</h4>
                        <p className="text-sm text-[#7a6560]">{step.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Ritual steps coming soon.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}