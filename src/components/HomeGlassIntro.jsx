import React from "react";
import { Dna, ChartNoAxesCombined, Users, ArrowUpRight, Sparkles, Orbit } from "lucide-react";

export default function HomeGlassIntro({ goToPage }) {
  const introCards = [
    {
      id: "genome",
      title: "Genome & RNAi Research",
      desc: "Genome-wide identification and characterization of gene families, RNA interference (RNAi), and advanced molecular modeling in Brassica rapa and Solanum tuberosum.",
      badge: "PLOS ONE · BMC GENOMICS",
      actionText: "Explore Publications",
      actionTarget: "publications",
      icon: Dna,
      accent: "cyan",
      // স্পষ্ট বায়োলুমিনেসেন্ট ডিএনএ ও জিনোমিক্স ফটো
      bgImage: "https://images.unsplash.com/photo-1530210124550-9120c7e2e9a7?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "ai_biostat",
      title: "Predictive AI & Biostatistics",
      desc: "Applying statistical modeling, machine learning architectures, and high-throughput biomedical data analysis to uncover meaningful patterns and solve complex research problems.",
      badge: "RESEARCHGATE VERIFIED",
      actionText: "Citations & Impact",
      actionTarget: "https://scholar.google.com/citations?user=OtW5C_MAAAAJ&hl=en",
      isExternal: true,
      icon: ChartNoAxesCombined,
      accent: "emerald",
      // স্পষ্ট হাই-টেক নিউরাল নেটওয়ার্ক ও মেশিন লার্নিং ফটো
      bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "fellows",
      title: "Lab Fellows & Mentorship",
      desc: "Supporting the development of emerging researchers through dedicated mentorship, the IBAI program, practical research training, and guidance toward meaningful scientific publications.",
      badge: "12 ACTIVE RESEARCHERS",
      actionText: "Meet Our Team",
      actionTarget: "profile",
      icon: Users,
      accent: "violet",
      // স্পষ্ট বিশ্বমানের বায়োটেক ল্যাবরেটরি ও গবেষক টিম ফটো
      bgImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85"
    }
  ];

  return (
    <section className="home-glass-intro-section page-width">
      {/* ── আধুনিক ও নান্দনিক ইন্ট্রোডাকশন হেডার ── */}
      <div className="home-glass-heading">
        <div className="home-glass-badge">
          <Sparkles size={14} className="badge-sparkle-icon" />
          <span>INTERDISCIPLINARY COMPUTATIONAL RESEARCH</span>
        </div>
        <h2 className="home-glass-title">
          Pioneering Data-Driven <span className="title-gradient-part">Biological Discovery.</span>
        </h2>
        <p className="home-glass-subtitle">
          Bridging mathematical rigor, statistical genetics, and artificial intelligence to decipher complex biomolecular mechanisms and cultivate future research leaders.
        </p>
      </div>

      {/* ── ৩টি হাই-টেক ফিউচারিস্টিক গ্লাস কার্ড ── */}
      <div className="futuristic-glass-grid">
        {introCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.id} 
              className={`futuristic-glass-card accent-${card.accent}`}
              onClick={() => {
                if (card.isExternal) {
                  window.open(card.actionTarget, "_blank");
                } else {
                  goToPage(card.actionTarget);
                }
              }}
            >
              {/* ব্যাকগ্রাউন্ড পিকচার (১০০% ঝকঝকে ও স্পষ্ট) */}
              <div 
                className="glass-card-bg" 
                style={{ backgroundImage: `url("${card.bgImage}")` }}
              />

              {/* স্মুথ কনট্রাস্ট গ্রেডিয়েন্ট (পিকচার ঢাকা পড়বে না) */}
              <div className="glass-card-overlay" />

              {/* টপ রিফ্লেকশন হাইলাইট */}
              <div className="glass-card-reflection" />

              {/* কার্ড কন্টেন্ট */}
              <div className="glass-card-content">
                <div className="glass-card-header">
                  <div className="glass-icon-wrapper">
                    <Icon size={22} className="glass-icon" />
                  </div>
                  <span className="glass-badge">{card.badge}</span>
                </div>

                <h3 className="glass-card-title">{card.title}</h3>
                <p className="glass-card-desc">{card.desc}</p>

                <div className="glass-card-footer">
                  <span className="glass-action-label">
                    {card.actionText}
                    <ArrowUpRight size={15} className="glass-arrow" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
