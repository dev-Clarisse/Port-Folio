import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  
  if (location.pathname === "/") {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/")} 
      className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full border border-(--wisteria-2)/40 bg-[#1a1025]/80 px-4 py-2 text-sm font-medium text-[var(--thistle)] backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:border-[var(--pastel-petal)] hover:shadow-[0_0_20px_rgba(193,158,224,0.35)]"
      aria-label="Back to the home page"
    >
      <ArrowLeft size={18} />
      <span>Home</span>
    </button>
  );
}