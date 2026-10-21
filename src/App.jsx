import AdminPanel from "./components/AdminPanel.jsx";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Atom, Award, BookOpen,
  BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, Dna, ExternalLink,
  FlaskConical, GraduationCap, Mail, MapPin, Menu, Microscope, Network,
  Orbit, Phone, Quote, Sparkles, X, MoreHorizontal, Code2, Users, CalendarCheck, BadgeCheck, ChevronLeft, ChevronRight, FileText, FileDown, Bell, Search
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import VideoBackground from "./components/VideoBackground.jsx";
import { notices } from "./data/notices.js";

const links = {
  just: "https://just.edu.bd/t/feefaysalammed",
  researchGate: "https://www.researchgate.net/profile/Fee-Faysal-Ahmed-2",
  justPublications: "https://just.edu.bd/t/feefaysalammed/publications",
  justEducation: "https://just.edu.bd/t/feefaysalammed/education",
  contact: "https://just.edu.bd/t/feefaysalammed/contact",
  lab: "https://just.edu.bd/t/feefaysalammed"
};

const stats = [
  { value: "54", label: "ResearchGate publications", note: "Profile figure observed Oct 2026" },
  { value: "626", label: "Citations", note: "ResearchGate profile figure" },
  { value: "16.3K+", label: "ResearchGate reads", note: "Profile figure observed Oct 2026" },
  { value: "8+", label: "Research interests", note: "Bioinformatics to deep learning" }
];

const interests = [
  { icon: Dna, title: "Bioinformatics & Genomics", text: "Computational analysis of biological systems, gene families and genomic data." },
  { icon: ChartNoAxesCombined, title: "Statistics & Machine Learning", text: "Statistical analysis, predictive modelling, classification and data-driven inference." },
  { icon: FlaskConical, title: "Proteomics & Drug Discovery", text: "Protein-focused computational research and molecular target exploration." },
  { icon: Microscope, title: "Public Health", text: "Quantitative approaches to health-related questions and biological evidence." }
];

const publications = [
  { year: "2026", journal: "BMC Genomic Data", title: "Genome-wide identification and characterization of the RNAi gene families in Brassica rapa L. highlighting their regulatory components and underlying functions involving crop improvement", href: links.researchGate, tag: "Plant genomics" },
  { year: "2026", journal: "PLOS ONE", title: "Genome-wide identification and characterization of argonaute, dicer-like, and RNA-dependent RNA polymerase gene families in potato (Solanum tuberosum): Advancing RNA interference-based crop enhancement", href: "https://doi.org/10.1371/journal.pone.0339021", tag: "RNA interference" },
  { year: "2025", journal: "BioMed Research International", title: "Unveiling the Therapeutic Potential of Piper chaba Hunter: Computational Approaches Shed Light on Targeting Proteins in Alzheimer’s Disease", href: links.researchGate, tag: "Computational biology" },
  { year: "2024", journal: "F1000Research", title: "A computational biology approach for the identification of potential SARS-CoV-2 main protease inhibitors from natural essential oil compounds", href: links.researchGate, tag: "Drug discovery" },
  { year: "2024", journal: "Tropical Plant Biology", title: "Genome-wide Identification and Functional Analysis of RNAi Gene Families in Papaya (Carica papaya L.)", href: links.researchGate, tag: "Plant genomics" },
  { year: "2024", journal: "Genetics Research", title: "Genome-Wide Comprehensive Identification and In Silico Characterization of Lectin Receptor-Like Kinase Gene Family in Barley (Hordeum vulgare L.)", href: links.researchGate, tag: "Plant genomics" },
  { year: "2024", journal: "Environmental Monitoring and Assessment", title: "Effect of water quality parameters and climatic influences on reproductive phenology of Macrognathus pancalus in wetland ecosystem: recommending a long-term management approach and conservation policy", href: links.researchGate, tag: "Environmental research" },
  { year: "2023", journal: "PLOS ONE", title: "Genome-wide identification, classification, and characterization of lectin gene superfamily in sweet orange (Citrus sinensis L.)", href: links.researchGate, tag: "Plant genomics" },
  { year: "2023", journal: "Scientific Reports", title: "Identification of genetic biomarkers, drug targets and agents for respiratory diseases utilising integrated bioinformatics approaches", href: links.researchGate, tag: "Health bioinformatics" },
  { year: "2023", journal: "Combinatorial Chemistry & High Throughput Screening", title: "Investigating the Precise Identification of Citrullination Sites with High-Performance Score Metrics Using a Powerful Computation Predicting Tool", href: links.researchGate, tag: "Predictive modelling" },
  { year: "2023", journal: "PLOS ONE", title: "Genome-wide identification of DCL, AGO and RDR gene families and their associated functional regulatory element analyses in sunflower (Helianthus annuus)", href: links.researchGate, tag: "RNA interference" }
];

const education = [
  { period: "2016–2017", degree: "M.Sc. in Statistics", place: "University of Rajshahi" },
  { period: "2012–2016", degree: "B.Sc. (Honours) in Statistics", place: "University of Rajshahi" },
  { period: "2010–2012", degree: "Higher Secondary Certificate (HSC)", place: "Singra Damdama Pilot School & College" },
  { period: "2005–2010", degree: "Secondary School Certificate (SSC)", place: "Singra Damdama Pilot School & College" },
  { period: "2000–2005", degree: "Primary Education", place: "16 No. Borogaon Government Primary School" }
];

const awards = [
  ["2018", "Dean’s Award", "Rajshahi University; for excellent B.Sc. (Honours) examination results."],
  ["2017", "Best Poster Award", "Awarded based on international scientific committee reviews and presentation."],
  ["2017", "NST Fellowship Scholarship", "National Science and Technology fellowship."],
  ["2013", "Outstanding Performance", "Probability Theory course, Department of Statistics, University of Rajshahi."]
];

const skills = [
  "Statistical analysis", "Statistical modelling", "R & RStudio", "Python", "SPSS", "STATA",
  "Logistic regression", "Linear regression", "Statistical inference", "Data analysis",
  "Weka / data mining", "MAPLE", "C / C++", "Perl", "Simulation & modelling", "MEGA 11"
];

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(window.location.hash === "#admin");

  useEffect(() => {
    const handleHash = () => setIsAdminOpen(window.location.hash === "#admin");
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  if (isAdminOpen) {
    return (
      <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", background: "#f4f7ef", zIndex: 99999999, overflowY: "auto", padding: "30px 15px" }}>
        <AdminPanel onBackToSite={() => { window.location.hash = ""; setIsAdminOpen(false); }} />
      </div>
    );
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [page, setPage] = useState("home");
  const goToPage = (nextPage) => { changePage(nextPage); setMenuOpen(false); setMoreOpen(false); window.scrollTo({ top: 0, behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All");
  const [selectedServices, setSelectedServices] = useState([]);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const topicRailRef = useRef(null);

  // ── ট্রেনিং মডাল এবং ফর্মের স্টেট ──
  const [activeModalCourse, setActiveModalCourse] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [applicant, setApplicant] = useState({ name: "", email: "", phone: "", institution: "", message: "" });

  const openCourseModal = (courseData) => {
    setActiveModalCourse(courseData);
    setIsFormSubmitted(false);
  };

  const closeCourseModal = () => {
    setActiveModalCourse(null);
    setIsFormSubmitted(false);
  };

  // ── বারবার স্ক্রল ও পেজ ব্যাকে জীবন্ত মোশন সচল রাখার স্ক্রিপ্ট ──
  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll(
      ".section-heading, .intro-label, .intro-copy, .research-card, .publication-row, .education-item, .thesis-card, .award-card, .training-card, .service-card, .contact-inner, .home-showcase, .stat-item, .skills-layout, .topic-explorer, .notice-board-container, .research-preview-card, .home-quick-links > button"
    );

    targets.forEach((el, index) => {
      el.classList.add("motion-reveal");
      el.style.setProperty("--reveal-delay", `${(index % 4) * 65}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });

    targets.forEach((el) => observer.observe(el));




  return () => observer.disconnect();
  }, [page]);

  const changePage = (nextPage) => {
    if (nextPage === page) { setMenuOpen(false); setMoreOpen(false); return; }
    const update = () => setPage(nextPage);
    if (document.startViewTransition && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  const serviceOptions = [
    { title: "IELTS Preparation Support", category: "LANGUAGE & ACADEMIC SKILLS", text: "Study planning, academic vocabulary, writing feedback and speaking practice support.", icon: BookOpen, color: "mint" },
    { title: "Research Data Analysis", category: "RESEARCH METHODS", text: "Support with data cleaning, exploratory analysis, visualisation and reporting workflows.", icon: ChartNoAxesCombined, color: "blue" },
    { title: "Machine Learning for Research", category: "AI & MODELLING", text: "Introductory model building, validation, classification and interpretation for research datasets.", icon: Network, color: "violet" },
    { title: "Deep Learning Fundamentals", category: "AI & MODELLING", text: "Neural-network concepts and practical workflows for suitable image or tabular data projects.", icon: Orbit, color: "coral" },
    { title: "R Programming & Statistics", category: "PROGRAMMING", text: "R/RStudio foundations, statistical tests, tidy data and reproducible analysis.", icon: Code2, color: "lime" },
    { title: "Python for Data Science", category: "PROGRAMMING", text: "Python, notebooks, pandas, NumPy, visualisation and exploratory data analysis.", icon: Code2, color: "blue" },
    { title: "Genomics & Bioinformatics", category: "LIFE SCIENCES", text: "An introduction to genomic data, quality-control concepts and computational biology workflows.", icon: Dna, color: "mint" },
    { title: "Public Health Data Analysis", category: "HEALTH DATA", text: "Quantitative summaries, regression concepts and clear presentation of health research findings.", icon: Microscope, color: "coral" },
  ];

  const toggleService = (title) => setSelectedServices((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  const filteredPublications = publications.filter((p) =>
    (year === "All" || p.year === year) &&
    `${p.title} ${p.journal} ${p.tag}`.toLowerCase().includes(query.toLowerCase())
  );
  const closeMenu = () => { setMenuOpen(false); setMoreOpen(false); };

  return (
    <main data-page={page}>
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand-mark lab-brand-mark">
            <img src="/Final.jpg" alt="Data Science & Biochemistry Lab" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <Atom className="brand-fallback-icon" size={24} />
          </span>
          <span className="brand-name">
            DATA SCIENCE & BIOCHEMISTRY LAB
            <span>JUST · INTERDISCIPLINARY COMPUTATIONAL RESEARCH</span>
          </span>
        </a>
        <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "navigation navigation-open" : "navigation"} aria-label="Main navigation">
          <a className={page === "home" ? "active" : ""} href="#home" onClick={(e) => {e.preventDefault(); goToPage("home");}}>Home</a>
          <a className={page === "profile" ? "active" : ""} href="#about" onClick={(e) => {e.preventDefault(); goToPage("profile");}}>Profile</a>
          <a href={links.researchGate} target="_blank" rel="noreferrer" onClick={closeMenu}>Research <ExternalLink size={12}/></a>
          <a className={page === "publications" ? "active" : ""} href="#publications" onClick={(e) => {e.preventDefault(); goToPage("publications");}}>Publications</a>
          <a className={page === "awards" ? "active" : ""} href="#awards" onClick={(e) => {e.preventDefault(); goToPage("awards");}}>Awards</a>
          <a className={page === "training" ? "active" : ""} href="#training" onClick={(e) => {e.preventDefault(); goToPage("training");}}>Training</a>
          <a className={page === "notices" ? "active" : ""} href="#notices" onClick={(e) => {e.preventDefault(); goToPage("notices");}}>Notices</a>
          <a className={page === "services" ? "active" : ""} href="#services" onClick={(e) => {e.preventDefault(); goToPage("services");}}>Services</a>
          <a className="nav-contact" href="#contact" onClick={(e) => {e.preventDefault(); goToPage("contact");}}>Contact <ArrowUpRight size={15} /></a>
          <div className="more-menu-wrap">
            <button className="more-menu-button" aria-label="More pages" aria-expanded={moreOpen} onClick={() => setMoreOpen(!moreOpen)}><MoreHorizontal size={23}/></button>
            {moreOpen && <div className="more-menu-panel">
              <span className="more-menu-label">EXPLORE PROFILE</span>
              <button onClick={() => goToPage("interests")}>Research interests</button>
              <button onClick={() => goToPage("methods")}>Methods & software</button>
              <button onClick={() => goToPage("awards")}>Awards & service</button>
              <button onClick={() => goToPage("training")}>Training sessions</button>
              <button onClick={() => goToPage("notices")}>Notices & documents</button>
              <button onClick={() => goToPage("services")}>Services & collaboration</button>
              <a href="#admin" onClick={() => setIsAdminOpen(true)} style={{display: "block", padding: "10px", color: "#2f5a3d", fontWeight: "bold", textDecoration: "none"}}>⚡ Admin Dashboard</a>
              <a href={links.just} target="_blank" rel="noreferrer" onClick={closeMenu}>Official university profile <ExternalLink size={14}/></a>
              <a href={links.researchGate} target="_blank" rel="noreferrer" onClick={closeMenu}>ResearchGate <ExternalLink size={14}/></a>
            </div>}
          </div>
        </nav>
      </header>

      {/* ── GLOBAL BACK BUTTON BAR (Shows on all pages except 'home') ── */}
      {page !== "home" && (
        <div className="page-back-bar page-width">
          <button
            type="button"
            className="global-back-button"
            onClick={() => goToPage("home")}
            title="Go back to Home"
          >
            <ChevronLeft size={18} />
            <span>Back to Home</span>
          </button>
          <span className="current-page-tag">
            VIEWING / <strong>{page.toUpperCase()}</strong>
          </span>
        </div>
      )}

      {/* ── HERO SECTION: DATA SCIENCE & BIOCHEMISTRY LAB ── */}
      <section className="hero hero-reference-layout" id="home">
        <VideoBackground className="hero-full-video-background" />

        <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
        <div className="hero-phone-mockup" aria-label="Mobile research portfolio preview">
          <div className="phone-frame">
            <div className="phone-island"></div>
            <div className="phone-status"><span>9:41</span><span>▮▮ ◉ ▰</span></div>
            <div className="phone-brand">
              <span className="phone-brand-icon"><Dna size={15}/></span>
              <strong>Training Hub</strong>
              <span className="phone-brand-menu"><Menu size={16}/></span>
            </div>
            <div className="phone-training-heading">
              <span>LEARN & APPLY</span>
              <strong>Training sessions</strong>
              <small>Choose a topic to explore</small>
            </div>
            <div className="phone-training-list">
              {[{n:"01",title:"R Programming & Biostatistics",tone:"mint"},{n:"02",title:"Python for Data Analysis",tone:"blue"},{n:"03",title:"Genomics & Bioinformatics",tone:"violet"},{n:"04",title:"Public Health Data Analysis",tone:"peach"},{n:"05",title:"Machine Learning for Research",tone:"mint"},{n:"06",title:"Deep Learning Fundamentals",tone:"blue"},{n:"07",title:"SPSS / STATA Modelling",tone:"violet"},{n:"08",title:"Custom Research Workshop",tone:"peach"}].map(item=><button type="button" key={item.n} className={`phone-training-option phone-tone-${item.tone}`} onClick={()=>goToPage("training")}><span>{item.n}</span><strong>{item.title}</strong><ArrowRight size={13}/></button>)}
            </div>
            <button type="button" className="phone-training-cta" onClick={()=>goToPage("training")}>View all training sessions <ArrowUpRight size={13}/></button>
          </div>
        </div>

        <div className="hero-content page-width">
          <div className="hero-topline">
            <span className="status-dot" /> JUST · BIOINFORMATICS & INTELLIGENCE
          </div>

          <h1 className="adobe-max-title">
            Where Data Meets <span className="adobe-gradient">Discovery.</span>
          </h1>

          <p className="adobe-max-lead">
            Pioneering the intersection of statistical modeling, genomics, and artificial intelligence at Jashore University of Science and Technology.
          </p>

          <div className="hero-actions">
            <a className="button button-primary adobe-btn" href={links.researchGate} target="_blank" rel="noreferrer">
              Explore Research <ArrowUpRight size={17} />
            </a>
            <a className="button button-glass adobe-btn-ghost" href="#publications" onClick={(e) => { e.preventDefault(); goToPage("publications"); }}>
              Publications <ArrowRight size={16} />
            </a>
          </div>

          <div className="hero-bottomline">
            <span><Sparkles size={14} /> GENOMICS · AI · DRUG DISCOVERY</span>
            <span className="scroll-cue">SCROLL TO EXPLORE <span className="scroll-line" /></span>
          </div>
        </div>
        <div className="hero-index">JUST / RESEARCH</div>
      </section>

      <section className="topic-explorer page-width" aria-label="Explore research and training topics">
        <div className="topic-explorer-heading">
          <div><span className="eyebrow">EXPLORE BY TOPIC</span><h2>Research, tools & <span>training.</span></h2><p>Choose a topic to open its dedicated section.</p></div>
          <div className="topic-rail-controls"><button aria-label="Scroll topics left" onClick={() => topicRailRef.current?.scrollBy({left:-300,behavior:"smooth"})}><ChevronLeft size={18}/></button><button aria-label="Scroll topics right" onClick={() => topicRailRef.current?.scrollBy({left:300,behavior:"smooth"})}><ChevronRight size={18}/></button></div>
        </div>
        <div className="topic-thumbnail-rail" ref={topicRailRef}>
          {[
            {title:"Genomics & Bioinformatics",label:"LIFE SCIENCES",page:"interests",image:"https://images.unsplash.com/photo-1530210124550-9120c7e2e9a7?auto=format&fit=crop&w=900&q=85",tone:"topic-mint"},
            {title:"Public Health",label:"HEALTH DATA",page:"interests",image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",tone:"topic-blue"},
            {title:"R Programming & Statistics",label:"PROGRAMMING",page:"training",image:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=85",tone:"topic-violet"},
            {title:"Machine Learning",label:"AI & MODELLING",page:"services",image:"https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=85",tone:"topic-peach"},
            {title:"Python for Data Science",label:"DATA ANALYSIS",page:"training",image:"https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=85",tone:"topic-blue"},
            {title:"Publications & Projects",label:"ACADEMIC WORK",page:"publications",image:"https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=900&q=85",tone:"topic-mint"}
          ].map((topic,index)=><button type="button" key={topic.title} className={`topic-thumbnail ${topic.tone}`} style={{"--topic-image":`url("${topic.image}")`}} onClick={()=>goToPage(topic.page)}><span className="topic-thumb-number">0{index+1}</span><span className="topic-thumb-shade"/><span className="topic-thumb-copy"><small>{topic.label}</small><strong>{topic.title}</strong><span className="topic-thumb-open">Explore topic <ArrowUpRight size={14}/></span></span></button>)}
        </div>
      </section>

      <section className="home-showcase page-width" aria-label="Research portfolio preview">
        <div className="home-quick-links">
          <button onClick={() => goToPage("interests")}><span className="quick-icon mint"><Dna size={20}/></span><span><strong>Research interests</strong><small>Explore key topics</small></span><ArrowRight size={16}/></button>
          <button onClick={() => goToPage("publications")}><span className="quick-icon lilac"><BookOpen size={20}/></span><span><strong>Selected publications</strong><small>Browse academic work</small></span><ArrowRight size={16}/></button>
          <button onClick={() => goToPage("training")}><span className="quick-icon peach"><GraduationCap size={20}/></span><span><strong>Training & workshops</strong><small>Learning and collaboration</small></span><ArrowRight size={16}/></button>
          <button onClick={() => goToPage("contact")}><span className="quick-icon blue"><Mail size={20}/></span><span><strong>Contact & collaboration</strong><small>Start a conversation</small></span><ArrowRight size={16}/></button>
        </div>
        <div className="home-research-preview">
          <div><span className="eyebrow">RESEARCH AREAS</span><h3>Explore the questions<br/>behind the data.</h3></div>
          <div className="research-preview-cards">
            {[{name:"Genomics & Bioinformatics",icon:Dna,style:"rp-green"},{name:"Statistical Modelling",icon:ChartNoAxesCombined,style:"rp-blue"},{name:"Machine Learning",icon:Network,style:"rp-violet"}].map(({name,icon:Icon,style},i)=><button key={name} className={`research-preview-card ${style}`} onClick={() => goToPage("interests")}><span className="preview-number">0{i+1}</span><Icon size={26}/><strong>{name}</strong><span className="preview-explore">Explore area <ArrowUpRight size={15}/></span></button>)}
          </div>
        </div>

        {/* ── ACTIVE RESEARCH PIPELINE ── */}
        <div className="research-pipeline-bar">
          <div className="pipeline-title">
            <span className="status-dot"></span> <strong>ACTIVE LAB PIPELINES:</strong>
          </div>
          <div className="pipeline-chips">
            <span className="pipeline-chip active">RNAi Crop Genomics <i>· Active</i></span>
            <span className="pipeline-chip ongoing">Alzheimer's Drug Targets <i>· In Silico</i></span>
            <span className="pipeline-chip active">Respiratory Disease Biomarkers <i>· Active</i></span>
            <span className="pipeline-chip published">Lectin Superfamily <i>· Published</i></span>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="page-width stats-grid">
          {stats.map((item) => <div className="stat-item" key={item.label}><span className="stat-number">{item.value}</span><span className="stat-label">{item.label}</span><span className="stat-note">{item.note}</span></div>)}
        </div>
      </section>

      {/* ── BALANCED PROFILE & EDUCATION SECTION ── */}
      <section className="intro-section page-width" id="about">
        <div className="intro-label">
          <span className="eyebrow">01 — ACADEMIC PROFILE</span>

          <div className="profile-photo-wrapper">
            <img
              className="teacher-profile-image-large"
              src="/feefaysal.jpg"
              alt="Fee Faysal Ahmed"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div className="profile-designation">
              <strong>Fee Faysal Ahmed</strong>
              <span>Lecturer, Dept. of Mathematics, JUST</span>
            </div>
          </div>

          <div className="profile-quick-contact-card">
            <span className="quick-card-title">DIRECT CONTACT & PROFILES</span>

            <a href="mailto:ffa.math@just.edu.bd" className="quick-contact-item">
              <Mail size={16} />
              <div>
                <small>EMAIL</small>
                <strong>ffa.math@just.edu.bd</strong>
              </div>
            </a>

            <a href="tel:+8801747091195" className="quick-contact-item">
              <Phone size={16} />
              <div>
                <small>PHONE</small>
                <strong>+880 1747-091195</strong>
              </div>
            </a>

            <div className="quick-contact-item">
              <MapPin size={16} />
              <div>
                <small>OFFICE</small>
                <strong>Room 532, Bangabandhu Academic Bldg, JUST</strong>
              </div>
            </div>

            <div className="profile-card-action-links">
              <a href={links.just} target="_blank" rel="noreferrer" className="action-pill just-pill">
                JUST Profile <ArrowUpRight size={13}/>
              </a>
              <a href={links.researchGate} target="_blank" rel="noreferrer" className="action-pill rg-pill">
                ResearchGate <ArrowUpRight size={13}/>
              </a>
            </div>
          </div>

          <aside className="thesis-card profile-thesis-side">
            <span className="eyebrow">M.SC. THESIS</span>
            <Atom size={28}/>
            <h3>Protein-Protein Interactions</h3>
            <p className="thesis-topic-tag">Statistical Modeling × Drug Discovery</p>
            <p>Predictive statistical methods with computational drug discovery.</p>
          </aside>
        </div>

        <div className="intro-copy">
          <h2>Statistics meets <span className="muted-text">the life sciences.</span></h2>
          <p className="intro-minimal-lead">
            The Data Science & Biochemistry Lab bridges advanced statistical inference, bioinformatics, and machine learning to drive scientific discovery in genomics, public health, and computational therapeutics.
          </p>

          <div className="bio-callout">
            <Quote size={22}/>
            <p>“Dedicated to empowering precision medicine and agricultural innovation through robust data science.”<span>— Core Lab Mission</span></p>
          </div>

          <div className="profile-researchgate-box">
            <div className="rg-box-title">
              <Network size={16} /> <strong>ResearchGate Impact & Overview</strong>
            </div>
            <div className="profile-rg-grid">
              {stats.map((item) => (
                <div className="profile-rg-item" key={item.label}>
                  <span className="profile-rg-number">{item.value}</span>
                  <strong className="profile-rg-label">{item.label}</strong>
                  <small className="profile-rg-note">{item.note}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-education-wrapper">
            <div className="profile-section-subhead">
              <GraduationCap size={20} />
              <h3>Educational Background</h3>
            </div>
            <div className="timeline">
              {education.map((e) => (
                <article className="education-item" key={e.period}>
                  <span className="timeline-dot"/>
                  <span className="education-period">{e.period}</span>
                  <div>
                    <h3>{e.degree}</h3>
                    <p>{e.place}</p>
                  </div>
                  <GraduationCap size={18}/>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="research-section page-width" id="research">
        <div className="section-heading"><span className="eyebrow">02 — RESEARCH INTERESTS</span><h2>Quantitative methods.<br /><span className="muted-text">Biological questions.</span></h2><p>Research areas are based on the interests listed on the official JUST profile and the skills displayed on ResearchGate.</p></div>
        <div className="research-grid">{interests.map(({icon: Icon, title, text}, i) => <article className={`research-card research-card-${i+1}`} key={title}><div className="card-top"><span>0{i+1} / 04</span><Icon size={24}/></div><h3>{title}</h3><p>{text}</p><span className="card-arrow"><ArrowDownRight size={20}/></span></article>)}</div>
      </section>

      <section className="publication-section" id="publications">
        <div className="page-width">
          <div className="section-heading publication-heading"><span className="eyebrow">03 — SELECTED PUBLICATIONS</span><h2>Research that <span className="muted-text">travels.</span></h2><p>Selected records surfaced on ResearchGate. Use the profile link for the complete, current publication list and publication-level metadata.</p></div>
          <div className="publication-controls"><label className="search-field"><span className="sr-only">Search publications</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search title, journal, topic…" /></label><select value={year} onChange={(e)=>setYear(e.target.value)} aria-label="Filter by year"><option>All</option><option>2026</option><option>2025</option><option>2024</option><option>2023</option></select><span className="results-count">{filteredPublications.length} selected records</span></div>
          <div className="publication-list">{filteredPublications.map((p,i)=><article className="publication-row" key={p.title}><span className="pub-year">{p.year}</span><div className="publication-main"><span className="pub-meta">{p.journal} <i>·</i> {p.tag}</span><h3>{p.title}</h3><a href={p.href} target="_blank" rel="noreferrer" className="publication-link">View publication <ArrowUpRight size={15}/></a></div><span className="pub-index">{String(i+1).padStart(2,"0")}</span></article>)}</div>
          <div className="all-publications"><div><BookOpen size={23}/><div><strong>Explore the complete publication record</strong><span>ResearchGate lists 54 publications on the profile snapshot reviewed in October 2026.</span></div></div><a className="button button-primary" href={links.researchGate} target="_blank" rel="noreferrer">View all publications <ArrowRight size={16}/></a></div>
        </div>
      </section>

      <section className="education-section page-width" id="education">
        <div className="section-heading"><span className="eyebrow">04 — EDUCATION</span><h2>A foundation in <span className="muted-text">statistics.</span></h2><p>Education history as listed on the official JUST profile.</p></div>
        <div className="education-layout"><div className="timeline">{education.map((e,i)=><article className="education-item" key={e.period}><span className="timeline-dot"/><span className="education-period">{e.period}</span><div><h3>{e.degree}</h3><p>{e.place}</p></div><GraduationCap size={20}/></article>)}</div><aside className="thesis-card"><span className="eyebrow">M.SC. THESIS</span><Atom size={36}/><h3>Protein-Protein Interactions Prediction Using Statistical Modeling and Its Implications in Drug Discovery</h3><p>A statistical modelling thesis connecting predictive methods with computational drug discovery.</p><a href={links.just} target="_blank" rel="noreferrer">Official academic profile <ArrowUpRight size={15}/></a></aside></div>
      </section>

      <section className="skills-section">
        <div className="page-width skills-layout"><div><span className="eyebrow">05 — METHODS & TOOLS</span><h2>Tools for <span>evidence.</span></h2><p>Skills and software listed in the official biography and ResearchGate expertise section. This is a profile summary, not a certification claim.</p></div><div className="skill-cloud">{skills.map((s,i)=><span key={s} className={`skill-chip skill-${i%4}`}>{s}</span>)}</div></div>
      </section>

      <section className="awards-section page-width" id="awards">
        <div className="section-heading"><span className="eyebrow">06 — RECOGNITION & SERVICE</span><h2>Milestones beyond <span className="muted-text">the page.</span></h2></div>
        <div className="awards-grid">{awards.map(([date,title,desc])=><article className="award-card" key={title}><span className="award-year">{date}</span><Award size={23}/><h3>{title}</h3><p>{desc}</p></article>)}</div>
        <div className="additional-info"><div><BriefcaseBusiness size={20}/><div><strong>Academic and extracurricular activity</strong><p>Participated in statistical lecture series, seminars and workshops; served as Assistant Sports Secretary of the Statistical Association at Rajshahi University (2015–2016); and is listed as a regular blood donor with Swajon and Badhon.</p></div></div><div><CalendarDays size={20}/><div><strong>Professional training</strong><p>Top-up IT training in web development (October 2016) under the LICT project of Bangladesh Computer Council, with NASSCOM IT-ITES Sector Skill Council certification noted in the JUST profile.</p></div></div></div>
      </section>

     {/* ── COMPACT & MINIMAL TRAINING SECTION ── */}
      <section className="training-section page-width" id="training">
        <div className="section-heading"><span className="eyebrow">07 — TRAINING & WORKSHOPS</span><h2>Practical skills for <span className="muted-text">researchers.</span></h2><p>Proposed short courses and workshop formats for students, early-career researchers and interdisciplinary teams. Contact the instructor to discuss availability, delivery mode and a tailored syllabus.</p></div>
        <div className="training-intro"><div className="training-intro-icon"><Users size={24}/></div><div><strong>Research-focused, hands-on learning</strong><p>Sessions can be tailored for beginner, intermediate or research-project levels. Topics and schedules are confirmed with participants before registration.</p></div><span className="training-status">Enquire about a session</span></div>

        <div className="training-grid">

          {/* Card 1: R Programming */}
          <article className="training-card">
            <div className="training-card-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80')` }}>
              <span className="training-status-pill running">Running</span>
            </div>
            <div className="training-card-body">
              <span className="training-sub-tag">PROGRAMMING</span>
              <h3>R Programming & Biostatistics</h3>
              <p>Data cleaning, ggplot2 visualisation and hypothesis testing in R.</p>

              <div className="training-seat-available-box">
                <strong>12 / 30 seats available</strong>
              </div>
              <button type="button" className="training-enquire-btn" onClick={() => openCourseModal({
                title: "R Programming & Biostatistics",
                seats: "12 / 30 seats available",
                level: "Beginner–Intermediate",
                syllabus: ["R Fundamentals & Tidyverse", "Data Cleaning and Manipulation", "Publication-ready Data Visualization (ggplot2)", "Hypothesis Testing & Statistical Inference"],
                howToJoin: ["নিচের ফর্মটি পূরণ করে সাবমিট করুন।", "২৪ ঘণ্টার মধ্যে কনফার্মেশন ও পেমেন্ট বিবরণী পাবেন।", "সেশন শুরুর পূর্বে গুগল মিট লিংক প্রদান করা হবে।"]
              })}>
                Enquire about training <ArrowUpRight size={14}/>
              </button>
            </div>
          </article>

          {/* Card 2: Python */}
          <article className="training-card">
            <div className="training-card-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80')` }}>
              <span className="training-status-pill running">Running</span>
            </div>
            <div className="training-card-body">
              <span className="training-sub-tag">DATA ANALYSIS</span>
              <h3>Python for Data Analysis</h3>
              <p>Research data workflows with Pandas, NumPy and Jupyter.</p>

              <div className="training-seat-available-box">
                <strong style={{ color: "#d97706" }}>3 / 25 seats available</strong>
              </div>
              <button type="button" className="training-enquire-btn" onClick={() => openCourseModal({
                title: "Python for Data Analysis",
                seats: "3 / 25 seats available",
                level: "Beginner–Intermediate",
                syllabus: ["Python & Jupyter basics", "Data manipulation with Pandas & NumPy", "Exploratory Data Analysis (EDA)", "Visualization with Seaborn & Matplotlib"],
                howToJoin: ["আবেদন ফর্মটি পূরণ করুন (মাত্র ৩টি সিট বাকি)।", "ইমেইলে চূড়ান্ত সিট বরাদ্দ নিশ্চিত করা হবে।", "অনলাইন ক্লাসরুম ইনভাইটেশন লিংক দেওয়া হবে।"]
              })}>
                Enquire about training <ArrowUpRight size={14}/>
              </button>
            </div>
          </article>

          {/* Card 3: Genomics (High quality real DNA/Bio image link) */}
          <article className="training-card">
            <div className="training-card-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=700&q=80')` }}>
              <span className="training-status-pill upcoming">Upcoming</span>
            </div>
            <div className="training-card-body">
              <span className="training-sub-tag">LIFE SCIENCES</span>
              <h3>Genomics & Bioinformatics</h3>
              <p>Computational biology workflows and genomic data analysis.</p>

              <div className="training-seat-available-box">
                <strong>13 / 25 seats available</strong>
              </div>
              <button type="button" className="training-enquire-btn" onClick={() => openCourseModal({
                title: "Genomics & Bioinformatics",
                seats: "13 / 25 seats available",
                level: "Introductory",
                syllabus: ["Biological data formats & QC concepts", "Sequence alignment & BLAST algorithms", "Genome-wide gene family identification", "Interpreting and visualising genomic results"],
                howToJoin: ["ফর্মে আপনার শিক্ষা ও গবেষণার বিবরণ দিন।", "ল্যাব টিম থেকে কনফার্মেশন ও শিডিউল মেইল করা হবে।", "অনলাইন সেশনে অংশগ্রহণের লিংক পাবেন।"]
              })}>
                Enquire about training <ArrowUpRight size={14}/>
              </button>
            </div>
          </article>

          {/* Card 4: Public Health */}
          <article className="training-card">
            <div className="training-card-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80')` }}>
              <span className="training-status-pill upcoming">Upcoming</span>
            </div>
            <div className="training-card-body">
              <span className="training-sub-tag">HEALTH DATA</span>
              <h3>Public Health Data Analysis</h3>
              <p>Quantitative approaches, regression & health study reporting.</p>

              <div className="training-seat-available-box">
                <strong>16 / 30 seats available</strong>
              </div>
              <button type="button" className="training-enquire-btn" onClick={() => openCourseModal({
                title: "Public Health Data Analysis",
                seats: "16 / 30 seats available",
                level: "Beginner–Intermediate",
                syllabus: ["Health study designs & data preparation", "Odds Ratio & Relative Risk calculations", "Logistic regression interpretation", "Publication-ready reporting tables"],
                howToJoin: ["আবেদন ফর্ম পূরণ করুন।", "ব্যাচ শিডিউল ইমেইলে কনফার্ম করা হবে।", "সেশন শুরুর পূর্বে গুগল মিট লিংক পাবেন।"]
              })}>
                Enquire about training <ArrowUpRight size={14}/>
              </button>
            </div>
          </article>

          {/* Card 5: SPSS / STATA */}
          <article className="training-card">
            <div className="training-card-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80')` }}>
              <span className="training-status-pill running">Running</span>
            </div>
            <div className="training-card-body">
              <span className="training-sub-tag">STATISTICS</span>
              <h3>Statistical Modelling (SPSS/STATA)</h3>
              <p>Practical procedures, regression and model inference for thesis.</p>

              <div className="training-seat-available-box">
                <strong>8 / 25 seats available</strong>
              </div>
              <button type="button" className="training-enquire-btn" onClick={() => openCourseModal({
                title: "Statistical Modelling with SPSS / STATA",
                seats: "8 / 25 seats available",
                level: "Intermediate",
                syllabus: ["Data setup, coding & assumption tests", "ANOVA, ANCOVA & correlation models", "Linear and Logistic regression modelling", "Output table drafting for academic thesis"],
                howToJoin: ["সফটওয়্যার পছন্দ (SPSS বা STATA) উল্লেখ করে ফর্ম জমা দিন।", "ল্যাব টিম কর্তৃক গাইডলাইন ইমেইল করা হবে।", "লাইভ হ্যান্ডস-অন সেশন লিংক দেওয়া হবে।"]
              })}>
                Enquire about training <ArrowUpRight size={14}/>
              </button>
            </div>
          </article>

          {/* Card 6: Team Workshop */}
          <article className="training-card">
            <div className="training-card-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80')` }}>
              <span className="training-status-pill custom">Custom</span>
            </div>
            <div className="training-card-body">
              <span className="training-sub-tag">CUSTOM WORKSHOP</span>
              <h3>Training for your team</h3>
              <p>Tailored workshops for university labs or research groups.</p>

              <div className="training-seat-available-box">
                <strong>Custom Group Capacity</strong>
              </div>
              <button type="button" className="training-enquire-btn" onClick={() => openCourseModal({
                title: "Training for your team",
                seats: "Custom Group Capacity",
                level: "Group enquiry",
                syllabus: ["Customized syllabus based on team project", "Departmental dataset review & hands-on exercises", "Co-mentorship for paper publication"],
                howToJoin: ["টিমের প্রতিনিধির নাম ও প্রয়োজনীয়তা ফর্মে লিখুন।", "আলোচনার মাধ্যমে দিনক্ষণ ও সিলেবাস নির্ধারণ করা হবে।", "অনলাইন বা অফলাইন কর্মশালা আয়োজন করা হবে।"]
              })}>
                Discuss requirements <ArrowUpRight size={14}/>
              </button>
            </div>
          </article>

        </div>
        <p className="training-disclaimer">These are proposed training topics, not a statement that registration is currently open. Dates, fees, certificates, capacity and delivery format should be confirmed directly before advertising or enrolment.</p>
      </section>
      {/* ── TRAINING DETAILS & REGISTRATION MODAL ── */}
      {activeModalCourse && (
        <div className="training-modal-overlay" onClick={closeCourseModal}>
          <div className="training-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="training-modal-close" onClick={closeCourseModal} aria-label="Close modal">
              <X size={20} />
            </button>

            <div className="modal-header-section">
              <span className="eyebrow">TRAINING SESSION DETAILS</span>
              <h2>{activeModalCourse.title}</h2>
              <div className="modal-meta-row">
                <span className="modal-seat-highlight">{activeModalCourse.seats}</span>
                <span className="modal-level-tag">{activeModalCourse.level}</span>
              </div>
            </div>

            <div className="modal-content-grid">
              {/* বাম কলাম: সিলেবাস এবং যোগ দেওয়ার নিয়ম */}
              <div className="modal-left-details">
                <div className="modal-detail-box">
                  <h4>ট্রেনিংয়ের ভেতরে যা যা থাকবে (Syllabus & Topics):</h4>
                  <ul className="modal-syllabus-list">
                    {activeModalCourse.syllabus.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="modal-detail-box">
                  <h4>যেভাবে যোগ দেবেন (How to Join):</h4>
                  <ol className="modal-instructions-list">
                    {activeModalCourse.howToJoin.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* ডান কলাম: আবেদন ফর্ম */}
              <div className="modal-right-form">
                <div className="modal-form-wrapper">
                  {isFormSubmitted ? (
                    <div className="modal-success-box">
                      <div className="success-badge">✓</div>
                      <h3>আবেদন সম্পন্ন হয়েছে!</h3>
                      <p>ধন্যবাদ <strong>{applicant.name || "শিক্ষার্থী"}</strong>। আপনার তথ্য গৃহীত হয়েছে। দ্রুত আপনার সাথে ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করা হবে।</p>
                      <button type="button" className="button button-primary" onClick={closeCourseModal}>ঠিক আছে</button>
                    </div>
                  ) : (
                    <>
                      <h3>সেশনে যোগদানের আবেদন ফর্ম</h3>
                      <p className="form-sub-text">সিট নিশ্চিত করতে নিচের তথ্যগুলো পূরণ করুন:</p>

                      <form onSubmit={(e) => { e.preventDefault(); setIsFormSubmitted(true); }} className="training-direct-form">
                        <div className="field-block">
                          <label>আপনার পূর্ণ নাম *</label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: মোঃ সাকিব হোসেন"
                            value={applicant.name}
                            onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                          />
                        </div>

                        <div className="field-block">
                          <label>ইমেইল অ্যাড্রেস *</label>
                          <input
                            type="email"
                            required
                            placeholder="yourname@gmail.com"
                            value={applicant.email}
                            onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                          />
                        </div>

                        <div className="field-block">
                          <label>হোয়াটসঅ্যাপ / ফোন নম্বর *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+880 1XXXXXXXXX"
                            value={applicant.phone}
                            onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                          />
                        </div>

                        <div className="field-block">
                          <label>শিক্ষা প্রতিষ্ঠান / কর্মস্থল</label>
                          <input
                            type="text"
                            placeholder="যেমন: JUST / Department of Statistics"
                            value={applicant.institution}
                            onChange={(e) => setApplicant({ ...applicant, institution: e.target.value })}
                          />
                        </div>

                        <div className="field-block">
                          <label>মন্তব্য বা কোনো প্রশ্ন (ঐচ্ছিক)</label>
                          <textarea
                            rows="2"
                            placeholder="আপনার কোনো প্রশ্ন থাকলে লিখুন..."
                            value={applicant.message}
                            onChange={(e) => setApplicant({ ...applicant, message: e.target.value })}
                          />
                        </div>

                        <button type="submit" className="button button-primary submit-enroll-btn">
                          Submit Application <ArrowUpRight size={15}/>
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="services-section page-width" id="services">
        <div className="section-heading"><span className="eyebrow">SERVICES & COLLABORATION</span><h2>Choose what you <span className="muted-text">need support with.</span></h2><p>Select one or more areas below. Selected cards gain a colour highlight; click again to remove a selection. This creates a shortlist for an enquiry and does not imply a booked or confirmed service.</p></div>
        <div className="service-selection-bar"><div><strong>{selectedServices.length} selected</strong><span>{selectedServices.length ? selectedServices.join(" · ") : "Choose cards to build your enquiry"}</span></div><button type="button" className="clear-services" onClick={() => setSelectedServices([])} disabled={!selectedServices.length}>Clear selection <X size={14}/></button></div>
        <div className="services-grid">{serviceOptions.map(({title,category,text,icon: Icon,color}) => { const selected = selectedServices.includes(title); return <button type="button" key={title} aria-pressed={selected} className={`service-card service-${color}${selected ? " is-selected" : ""}`} onClick={() => toggleService(title)}><span className="service-icon"><Icon size={23}/></span><span className="service-category">{category}</span><strong>{title}</strong><span className="service-description">{text}</span><span className="service-select-indicator">{selected ? <><BadgeCheck size={16}/> Selected — click to remove</> : <>＋ Select service</>}</span></button>; })}</div>
        <div className="services-enquiry"><div><span className="eyebrow">YOUR SHORTLIST</span><h3>{selectedServices.length ? "Ready to discuss your requirements?" : "Build a tailored request"}</h3><p>{selectedServices.length ? "Your selected topics will be included in the email enquiry." : "Select the service cards that match your project or training needs."}</p></div><a className={`button button-primary${selectedServices.length ? "" : " button-disabled"}`} href={`mailto:ffa.math@just.edu.bd?subject=${encodeURIComponent("Research and Training Enquiry")}&body=${encodeURIComponent("Hello,\n\nI would like to enquire about the following service(s):\n- " + (selectedServices.length ? selectedServices.join("\n- ") : "Please discuss available services with me") + "\n\nPlease share further details and availability.\n\nThank you.")}`}>Send enquiry <ArrowUpRight size={16}/></a></div>
      </section>

      {/* ── NOTICES SECTION (OFFICIAL NOTICE BOARD) ── */}
      <section className="notices-section page-width" id="notices">
        <div className="section-heading notices-heading">
          <span className="eyebrow"><Bell size={15}/> OFFICIAL NOTICE BOARD</span>
          <h2>Notices & <span className="muted-text">Downloads.</span></h2>
          <p>Academic announcements, circulars, class schedules, and research materials.</p>
        </div>

        <div className="notice-board-container">
          <div className="notice-board-header">
            <div className="notice-header-left">
              <span className="notice-board-badge"><Bell size={14} className="notice-pulse" /> LIVE NOTICES</span>
              <span className="notice-total-count">{notices.length} Notice(s) Published</span>
            </div>
            <div className="notice-search-box">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search notices..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {notices.length > 0 ? (
            <div className="notice-list-table">
              {notices
                .filter((n) =>
                  !query ||
                  n.title.toLowerCase().includes(query.toLowerCase()) ||
                  (n.category && n.category.toLowerCase().includes(query.toLowerCase()))
                )
                .map((notice, index) => {
                  const fileExtension = (notice.file || "").split(".").pop()?.toUpperCase() || "PDF";




  return (
                    <article className="notice-row" key={`${notice.title}-${index}`}>
                      <div className="notice-left-col">
                        <span className="notice-index-num">{String(index + 1).padStart(2, '0')}</span>
                        <span className={`notice-cat-tag cat-${(notice.category || 'general').toLowerCase()}`}>
                          {notice.category || "Notice"}
                        </span>
                        <h3 className="notice-single-title" title={notice.title}>
                          {notice.title}
                        </h3>
                        <span className="notice-format-badge">{fileExtension}</span>
                      </div>

                      <div className="notice-right-col">
                        <span className="notice-date-text">
                          <CalendarDays size={14} />
                          {notice.date || "Date not specified"}
                        </span>

                        <div className="notice-btn-group">
                          <a
                            href={notice.file}
                            target="_blank"
                            rel="noreferrer"
                            className="notice-btn notice-view-btn"
                            title="View document"
                          >
                            <ExternalLink size={14}/> <span>View</span>
                          </a>
                          <a
                            href={notice.file}
                            download
                            className="notice-btn notice-download-btn"
                            title="Download document"
                          >
                            <FileDown size={14}/> <span>Download</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          ) : (
            <div className="notices-empty-state">
              <span className="notices-empty-icon"><FileDown size={28}/></span>
              <h3>No notices found</h3>
              <p>New notices will be listed here automatically when published.</p>
            </div>
          )}
        </div>

        <p className="notices-admin-note">
          <strong>Tip:</strong> Place files in <code>public/notices/</code> and update records in <code>src/data/notices.js</code> (PDF, DOCX, XLSX supported).
        </p>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-orb"><div className="contact-orb-inner"><Network size={43}/></div></div>
        <div className="page-width contact-inner">
          <span className="eyebrow">07 — CONNECT</span>
          <h2>Questions, collaboration<br />or research <span className="gradient-text">ideas?</span></h2>
          <p>For the latest academic information, contact details and research updates, please use the official university profile.</p>
          <div className="contact-cards">
            <a href="mailto:ffa.math@just.edu.bd"><Mail size={19}/><span><small>EMAIL</small><strong>ffa.math@just.edu.bd</strong></span><ArrowUpRight size={16}/></a>
            <a href="tel:+8801747091195"><Phone size={19}/><span><small>PHONE</small><strong>+880 1747-091195</strong></span><ArrowUpRight size={16}/></a>
            <a href={links.contact} target="_blank" rel="noreferrer"><MapPin size={19}/><span><small>OFFICE</small><strong>Room 532, Bangabandhu Sheikh Mujib Academic Building, JUST</strong></span><ArrowUpRight size={16}/></a>
          </div>
          <div className="contact-actions">
            <a className="button button-primary" href={links.just} target="_blank" rel="noreferrer">Official JUST profile <ExternalLink size={15}/></a>
            <a className="button button-glass" href={links.researchGate} target="_blank" rel="noreferrer">ResearchGate <ExternalLink size={15}/></a>
          </div>
        </div>
      </section>

      <footer className="site-footer professional-footer">
        <div className="footer-main-grid">
          <div className="footer-identity">
            <a className="brand footer-brand" href="#home" onClick={(e)=>{e.preventDefault();goToPage("home");}}>
              <span className="brand-mark lab-brand-mark">
                <img src="/Final.jpg" alt="Data Science & Biochemistry Lab" onError={(e)=>{e.currentTarget.style.display="none";}}/>
                <Atom className="brand-fallback-icon" size={21}/>
              </span>
              <span className="brand-name">
                DATA SCIENCE & BIOCHEMISTRY LAB
                <span>INTERDISCIPLINARY COMPUTATIONAL RESEARCH</span>
              </span>
            </a>
            <p className="footer-summary">Statistics, bioinformatics and computational research — connecting quantitative methods with biological and public-health questions.</p>
            <div className="footer-social-links">
              <a href={links.researchGate} target="_blank" rel="noreferrer"><Network size={15}/> ResearchGate <ExternalLink size={12}/></a>
              <a href={links.just} target="_blank" rel="noreferrer"><GraduationCap size={15}/> JUST profile <ExternalLink size={12}/></a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <button onClick={()=>goToPage("home")}>Home</button>
            <button onClick={()=>goToPage("profile")}>Profile</button>
            <a href={links.researchGate} target="_blank" rel="noreferrer">Research profile <ExternalLink size={12}/></a>
            <button onClick={()=>goToPage("publications")}>Publications</button>
            <button onClick={()=>goToPage("education")}>Education</button>
          </div>
          <div className="footer-column">
            <h3>Research & Learning</h3>
            <button onClick={()=>goToPage("interests")}>Research interests</button>
            <button onClick={()=>goToPage("methods")}>Methods & software</button>
            <button onClick={()=>goToPage("training")}>Training sessions</button>
            <button onClick={()=>goToPage("notices")}>Notices & documents</button>
            <button onClick={()=>goToPage("services")}>Services & collaboration</button>
            <button onClick={()=>goToPage("awards")}>Awards & recognition</button>
          </div>
          <div className="footer-column footer-contact-column">
            <h3>Get in touch</h3>
            <a href="mailto:ffa.math@just.edu.bd"><Mail size={15}/> ffa.math@just.edu.bd</a>
            <a href="tel:+8801747091195"><Phone size={15}/> +880 1747-091195</a>
            <a href={links.contact} target="_blank" rel="noreferrer"><MapPin size={15}/> University contact details <ExternalLink size={12}/></a>
            <button className="footer-contact-cta" onClick={()=>goToPage("contact")}>Contact & collaboration <ArrowUpRight size={15}/></button>
          </div>
        </div>
        <div className="footer-bottomline">
          <span>© {new Date().getFullYear()} Data Science & Biochemistry Lab · JUST</span>
          <span>STATISTICS <i>×</i> BIOINFORMATICS <i>×</i> COMPUTATIONAL RESEARCH</span>
          <button onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}>Back to top ↑</button>
        </div>
        <p className="footer-disclaimer">Profile information is provided for academic discovery. Publication metrics may change over time; consult the linked official profiles for the latest details.</p>
      </footer>
    </main>
  );
}