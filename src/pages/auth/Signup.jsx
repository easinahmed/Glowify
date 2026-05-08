import { useState } from "react";
import { Link } from "react-router";

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

  input::placeholder { color: #cbbdb8; }
  input:focus { outline: none; border-color: #b09a94 !important; }
  input { transition: border-color 0.2s ease; }
`;

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive"];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [skinType, setSkinType] = useState("Combination");

  return (
    <>
      <style>{styles}</style>

      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "#fdf0ee" }}
      />

      <div className="min-h-screen flex items-start justify-center px-6 py-16">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="mb-10 anim-1">
            <p
              className="text-[11px] tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: "'Jost', sans-serif", color: "#9e8a85" }}
            >
              Begin Your Journey
            </p>
            <h1
              className="text-[2.4rem] font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2e2420" }}
            >
              Create Your Profile
            </h1>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-8">

            {/* Full Name */}
            <div className="flex flex-col gap-1.5 anim-2">
              <label
                className="text-[10px] tracking-[0.16em] uppercase"
                style={{ fontFamily: "'Jost', sans-serif", color: "#9e8a85" }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Julianne Moore"
                className="w-full border-0 border-b pb-3 text-sm bg-transparent"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  borderBottom: "1px solid #ddd0ca",
                  color: "#3d2f2c",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 anim-3">
              <label
                className="text-[10px] tracking-[0.16em] uppercase"
                style={{ fontFamily: "'Jost', sans-serif", color: "#9e8a85" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ritual@zenapothecary.com"
                className="w-full border-0 pb-3 text-sm bg-transparent"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  borderBottom: "1px solid #ddd0ca",
                  color: "#3d2f2c",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 anim-4">
              <label
                className="text-[10px] tracking-[0.16em] uppercase"
                style={{ fontFamily: "'Jost', sans-serif", color: "#9e8a85" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-0 pb-3 pr-12 text-sm bg-transparent"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    borderBottom: "1px solid #ddd0ca",
                    color: "#3d2f2c",
                    fontSize: "15px",
                  }}
                />
                <button
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-0 bottom-3 text-[10px] tracking-wider uppercase cursor-pointer"
                  style={{ fontFamily: "'Jost', sans-serif", color: "#b09a94" }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Skin Type */}
            <div className="flex flex-col gap-4 anim-5">
              <label
                className="text-[10px] tracking-[0.16em] uppercase"
                style={{ fontFamily: "'Jost', sans-serif", color: "#9e8a85" }}
              >
                Select Your Skin Type
              </label>
              <div className="flex flex-wrap gap-3">
                {SKIN_TYPES.map((type) => {
                  const active = skinType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSkinType(type)}
                      className="rounded-full px-5 py-2 text-xs tracking-wider cursor-pointer transition-all duration-200"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        border: active ? "1px solid #a89088" : "1px solid #d4c4be",
                        background: active ? "rgba(168,144,136,0.15)" : "transparent",
                        color: active ? "#5a4540" : "#9e8a85",
                        fontWeight: active ? "500" : "300",
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Create Account Button */}
            <div className="anim-6 mt-2">
              <button
                className="w-full py-5 rounded-xl text-xs tracking-[0.22em] uppercase cursor-pointer transition-all duration-250 hover:brightness-95 active:scale-[0.99]"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  background: "#f0d5d0",
                  color: "#5a4540",
                  fontWeight: "400",
                }}
              >
                Create Account
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center anim-6">
              <p
                className="text-sm"
                style={{ fontFamily: "'Jost', sans-serif", color: "#9e8a85" }}
              >
                Already part of the ritual?{" "}
                
                  
                  
                <Link to={"/auth/login"} >
                  Login here
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}