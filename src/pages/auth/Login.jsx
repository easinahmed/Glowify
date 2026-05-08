import { useState } from "react";
import { Link } from "react-router";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-1 { animation: fadeUp 0.6s 0.0s ease both; }
  .anim-2 { animation: fadeUp 0.6s 0.1s ease both; }
  .anim-3 { animation: fadeUp 0.6s 0.2s ease both; }
  .anim-4 { animation: fadeUp 0.6s 0.3s ease both; }
  .anim-5 { animation: fadeUp 0.6s 0.4s ease both; }

  input::placeholder { color: #c5b3ae; }
  input:focus { outline: none; border-color: #9e7a74 !important; }
  input { transition: border-color 0.2s ease; }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <style>{styles}</style>

      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #fdf0e8 0%, #f7e4d8 40%, #ede0d9 100%)",
        }}
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        {/* Card */}
        <div
          className="w-full max-w-md rounded-3xl px-10 py-12"
          style={{
            background: "rgba(255,252,250,0.88)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,240,230,0.8)",
            boxShadow:
              "0 8px 40px rgba(100,70,60,0.08), 0 2px 8px rgba(100,70,60,0.04)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-9 anim-1">
            <p
              className="text-[10px] tracking-[0.22em] uppercase mb-3"
              style={{
                fontFamily: "'Jost', sans-serif",
                color: "#9e8a85",
              }}
            >
              Welcome Back
            </p>
            <h1
              className="text-[2.6rem] leading-tight font-light mb-2"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#3d2f2c",
              }}
            >
              Login to Glowify
            </h1>
            <p
              className="text-sm font-light"
              style={{
                fontFamily: "'Jost', sans-serif",
                color: "#b09a94",
                letterSpacing: "0.01em",
              }}
            >
              Enter your sanctuary of restorative care.
            </p>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-5 mb-4 anim-2">
            {/* Email */}
            <div className="relative">
              <span
                className="absolute -top-2.25 left-3 px-1.5 text-[10px] tracking-[0.12em] uppercase"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  background: "white",
                  color: "#9e8a85",
                }}
              >
                Email Address
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@ritual.com"
                className="w-full rounded-xl border px-4 py-3.5 text-sm"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  borderColor: "#e8d9d2",
                  color: "#4a3530",
                  background: "rgba(255,255,255,0.6)",
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span
                className="absolute -top-2.25 left-3 px-1.5 text-[10px] tracking-[0.12em] uppercase"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  background: "white",
                  color: "#9e8a85",
                }}
              >
                Password
              </span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border px-4 py-3.5 pr-12 text-sm"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  borderColor: "#e8d9d2",
                  color: "#4a3530",
                  background: "rgba(255,255,255,0.6)",
                }}
              />
              <button
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  color: "#b09a94",
                  letterSpacing: "0.05em",
                }}
              >
                {showPass ? "hide" : "show"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-7 anim-3">
            <a
              href="#"
              className="text-xs"
              style={{
                fontFamily: "'Jost', sans-serif",
                color: "#8a6e68",
                letterSpacing: "0.02em",
              }}
            >
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <div className="anim-4">
            <button
              className="w-full rounded-full py-4 text-xs tracking-[0.18em] uppercase text-white cursor-pointer transition-all duration-250 hover:-translate-y-px active:translate-y-0"
              style={{
                fontFamily: "'Jost', sans-serif",
                background: "linear-gradient(135deg, #7a5c56 0%, #5e4540 100%)",
                boxShadow: "0 4px 18px rgba(90,60,55,0.28)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 6px 24px rgba(90,60,55,0.38)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 18px rgba(90,60,55,0.28)")
              }
            >
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4 anim-5">
            <div
              className="flex-1 h-px"
              style={{
                background: "linear-gradient(to right, transparent, #e5d5cf)",
              }}
            />
            <span
              className="text-[10px] tracking-widest uppercase"
              style={{ fontFamily: "'Jost', sans-serif", color: "#c4ada7" }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background: "linear-gradient(to left, transparent, #e5d5cf)",
              }}
            />
          </div>

          {/* Create Account */}
          <div className="text-center anim-5">
            <p
              className="text-xs mb-4"
              style={{
                fontFamily: "'Jost', sans-serif",
                color: "#b09a94",
                letterSpacing: "0.03em",
              }}
            >
              New to our collective?
            </p>
            <Link to={"/auth/signup"}
              className="w-full rounded-full px-10 py-3.5 border text-xs tracking-[0.18em] uppercase cursor-pointer transition-all duration-200 hover:bg-[rgba(120,85,80,0.06)]"
              style={{
                fontFamily: "'Jost', sans-serif",
                borderColor: "#c4ada7",
                color: "#7a5c56",
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}