import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchBestSellers, addToCart } from "../api/api";
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
  .anim-5 { animation: fadeUp 0.6s 0.4s ease both; }

  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  .skeleton {
    background: linear-gradient(90deg, #f0e4df 25%, #f7ede9 50%, #f0e4df 75%);
    background-size: 800px 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: 8px;
  }

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

const ANIM_CLASSES = ["anim-2", "anim-3", "anim-4", "anim-5"];

function SkeletonCard({ index }) {
  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden ${ANIM_CLASSES[index] || "anim-2"}`}
      style={{
        background: "#fff",
        border: "1px solid #f0e4df",
        boxShadow: "0 4px 20px rgba(100,60,50,0.05)",
      }}
    >
      <div className="w-full skeleton" style={{ aspectRatio: "1/1" }} />
      <div className="flex flex-col p-5 gap-3">
        <div className="skeleton" style={{ width: "60%", height: "12px" }} />
        <div className="skeleton" style={{ width: "80%", height: "18px" }} />
        <div className="skeleton" style={{ width: "40%", height: "12px" }} />
        <div className="skeleton" style={{ width: "50%", height: "16px" }} />
        <div className="skeleton" style={{ width: "100%", height: "44px", borderRadius: "999px", marginTop: "8px" }} />
      </div>
    </div>
  );
}

export default function BestSellers() {
  const [added, setAdded] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["bestSellers"],
    queryFn: () => fetchBestSellers(4),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId) => addToCart(productId, 1),
    onSuccess: (_, productId) => {
      setAdded((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => setAdded((prev) => ({ ...prev, [productId]: false })), 2000);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        navigate('/auth/login');
      }
    }
  });

  const handleAddToCart = (productId) => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    addToCartMutation.mutate(productId);
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

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {[0, 1, 2, 3].map((i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="anim-2 text-center py-12">
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  color: "#9e8a85",
                }}
              >
                Unable to load best sellers right now.
              </p>
              <button
                onClick={() => queryClient.invalidateQueries({ queryKey: ["bestSellers"] })}
                className="mt-4 px-6 py-2 rounded-full text-[11px] tracking-[0.16em] uppercase cursor-pointer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: "400",
                  background: "transparent",
                  color: "#2e2420",
                  border: "1px solid #d4c4be",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className={`product-card flex flex-col rounded-2xl overflow-hidden ${ANIM_CLASSES[index] || "anim-2"}`}
                  style={{
                    background: "#fff",
                    border: "1px solid #f0e4df",
                    boxShadow: "0 4px 20px rgba(100,60,50,0.05)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="w-full overflow-hidden cursor-pointer"
                    style={{ aspectRatio: "1/1" }}
                    onClick={() => navigate(`/shop/${product._id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 gap-3">

                    {/* Badge */}
                    {product.totalSold > 0 && (
                      <span
                        className="self-start text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                        style={{
                          background: "#e8d5ce",
                          color: "#7a5c56",
                          fontWeight: "500",
                        }}
                      >
                        BESTSELLER
                      </span>
                    )}

                    {/* Name + Category */}
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
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
                        {product.category
                          ? product.category.charAt(0) + product.category.slice(1).toLowerCase()
                          : ""}
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
                      ${product.price?.toFixed(2)}
                    </p>

                    {/* Add to Cart */}
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={addToCartMutation.isPending}
                      className="mt-auto w-full rounded-full py-3 text-[11px] tracking-[0.16em] uppercase cursor-pointer"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: "400",
                        background: added[product._id] ? "#2e2420" : "transparent",
                        color: added[product._id] ? "#fff" : "#2e2420",
                        border: "1px solid #d4c4be",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {added[product._id] ? "✓ Added" : "Add to Cart"}
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="anim-2 text-center py-12">
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  color: "#9e8a85",
                }}
              >
                No products available yet.
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}