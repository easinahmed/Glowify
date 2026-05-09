import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { signupUser } from '../../api/api'

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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      navigate('/');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    signupMutation.mutate({ username, email, password });
  };

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Username */}
            <div className="flex flex-col gap-1.5 anim-2">
              <label
                className="text-[10px] tracking-[0.16em] uppercase"
                style={{ fontFamily: "'Jost', sans-serif", color: "#9e8a85" }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full border-0 border-b pb-3 text-sm bg-transparent"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  borderBottom: "1px solid #ddd0ca",
                  color: "#3d2f2c",
                  fontSize: "15px",
                }}
                required
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
                placeholder="your@email.com"
                className="w-full border-0 pb-3 text-sm bg-transparent"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  borderBottom: "1px solid #ddd0ca",
                  color: "#3d2f2c",
                  fontSize: "15px",
                }}
                required
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
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-0 bottom-3 text-[10px] tracking-wider uppercase cursor-pointer"
                  style={{ fontFamily: "'Jost', sans-serif", color: "#b09a94" }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <div className="anim-5 mt-2">
              <button
                type="submit"
                disabled={signupMutation.isLoading}
                className="w-full py-5 rounded-xl text-xs tracking-[0.22em] uppercase cursor-pointer transition-all duration-250 hover:brightness-95 active:scale-[0.99]"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  background: "#f0d5d0",
                  color: "#5a4540",
                  fontWeight: "400",
                }}
              >
                {signupMutation.isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            {signupMutation.isError && (
              <p
                className="text-sm text-center mt-3"
                style={{ color: '#b6403b', fontFamily: "'Jost', sans-serif" }}
              >
                {signupMutation.error?.response?.data?.message || signupMutation.error?.message}
              </p>
            )}

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

          </form>
        </div>
      </div>
    </>
  );
}