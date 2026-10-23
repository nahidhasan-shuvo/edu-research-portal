import HomeGlassIntro from "./components/HomeGlassIntro.jsx";
import { AdminLoginModal, AdminFloatingBar, InlineEditModal, PublicationUploadModal, NoticeUploadModal } from "./components/AdminPanel.jsx";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Atom, Award, BookOpen,
  BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, Dna, ExternalLink,
  FlaskConical, GraduationCap, Mail, MapPin, Menu, Microscope, Network,
  Orbit, Phone, Quote, Sparkles, X, MoreHorizontal, Code2, Users, CalendarCheck, BadgeCheck, ChevronLeft, ChevronRight, FileText, FileDown, Bell, Search, Edit3, Trash2, Camera, Plus, Calendar, ChevronDown, ChevronUp, Mic, UserCheck, Briefcase, MessageCircle, UserPlus, FileCheck, Check, Trophy
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import VideoBackground from "./components/VideoBackground.jsx";
import { notices as defaultNotices } from "./data/notices.js";

// ছবি অপটিমাইজেশন ইউটিলিটি
const compressImage = (file, maxWidth = 1000, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const links = {
  just: "https://just.edu.bd/t/feefaysalammed",
  researchGate: "https://www.researchgate.net/profile/Fee-Faysal-Ahmed-2",
  googleScholar: "https://scholar.google.com/citations?user=OtW5C_MAAAAJ&hl=en",
  justPublications: "https://just.edu.bd/t/feefaysalammed/publications",
  justEducation: "https://just.edu.bd/t/feefaysalammed/education",
  contact: "https://just.edu.bd/t/feefaysalammed/contact",
  lab: "https://just.edu.bd/t/feefaysalammed"
};

const defaultStats = [
  { value: "54", label: "ResearchGate publications", note: "Profile figure observed Oct 2026" },
  { value: "626", label: "Citations", note: "ResearchGate profile figure" },
  { value: "16.3K+", label: "ResearchGate reads", note: "Profile figure observed Oct 2026" },
  { value: "8+", label: "Research interests", note: "Bioinformatics to deep learning" }
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

// ৫টি আসল অ্যাওয়ার্ড
const initialAwardsList = [
  {
    id: "award_4ir",
    year: "Recent",
    title: "Best Paper Award",
    org: "Department of Statistics, University of Rajshahi",
    desc: "Awarded at the 8th International Conference on 'The Role of Statistics and Data Science in 4IR'.",
    badge: "CONFERENCE HONOR",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "award_deans",
    year: "2018",
    title: "Dean's Award",
    org: "Faculty of Science, University of Rajshahi",
    desc: "Conferred by Rajshahi University for achieving outstanding and extraordinary results in B.Sc. (Honours) Examination.",
    badge: "ACADEMIC EXCELLENCE",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "award_poster",
    year: "2017",
    title: "Best Poster Award",
    org: "International Scientific Committee",
    desc: "Awarded based on international scientific committee reviews, technical evaluation and scientific presentation.",
    badge: "SCIENTIFIC PRESENTATION",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "award_nst",
    year: "2017",
    title: "NST Fellowship Scholarship",
    org: "Ministry of Science and Technology, Bangladesh",
    desc: "National Science and Technology (NST) fellowship scholarship granted for postgraduate research excellence.",
    badge: "GOVERNMENT FELLOWSHIP",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "award_prob",
    year: "2013",
    title: "Outstanding Performance in Probability Theory",
    org: "Department of Statistics, University of Rajshahi",
    desc: "Achieved highest honors and outstanding problem-solving performance in theoretical Probability Theory.",
    badge: "DEPARTMENTAL MERIT",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80"
  }
];

// লেটেস্ট রিসার্চ পেপারস
const initialRealResearchPapers = [
  {
    id: "plos_one_potato",
    journal: "PLOS ONE",
    date: "February 9, 2026",
    title: "Genome-wide identification and characterization of argonaute, dicer-like, and RNA-dependent RNA polymerase gene families in potato (Solanum tuberosum)",
    desc: "Advancing RNA interference-based crop enhancement against biotic stress through genome-wide phylogeny and structural molecular dynamics.",
    tag: "OPEN ACCESS",
    paperType: "RESEARCH ARTICLE",
    publisher: "Public Library of Science",
    authors: "Md. Nahid Hasan Shuvo, Mahmudul Hassan, Md. Abu Musa, Riday Hossain, Jesmin Naher Konak, Zobaer Akond, Fee Faysal Ahmed*",
    doi: "https://doi.org/10.1371/journal.pone.0339021",
    themeColor: "#8b20bb",
    customImage: ""
  },
  {
    id: "bmc_genomic_brassica",
    journal: "BMC GENOMIC DATA (SPRINGER NATURE)",
    date: "11 June 2026",
    title: "Genome-wide identification and characterization of the RNAi gene families in Brassica rapa L.",
    desc: "Highlighting regulatory components and underlying functions involving crop improvement. Volume 27, Article 45.",
    tag: "SPRINGER NATURE",
    paperType: "RESEARCH · OPEN ACCESS",
    publisher: "Springer Nature Link",
    authors: "Zobaer Akond, Sheikh Hasna Habib, Fee Faysal Ahmed & Md. Nurul Haque Mollah",
    doi: links.researchGate,
    themeColor: "#0284c7",
    customImage: ""
  },
  {
    id: "elsevier_brick",
    journal: "ELSEVIER (CASE STUDIES IN CHEMICAL & ENV. ENG.)",
    date: "Volume 7, June 2023",
    title: "Preparation of environmental friendly plastic brick from high-density polyethylene waste",
    desc: "Innovative circular environmental engineering utilizing high-density polyethylene waste to fabricate sustainable structural bricks.",
    tag: "ELSEVIER",
    paperType: "CASE REPORT",
    publisher: "Elsevier B.V.",
    authors: "Sabiha Sarwar, Molla Rahman Shaibur, Mohammed Sadid Hossain, Md Rasel Hossain, Ishtiaque Ahmmed, Fee Faysal Ahmed, Md Akhter Hossain Sarker, Abul Hasnat Md Shamim",
    doi: links.researchGate,
    themeColor: "#ea580c",
    customImage: ""
  },
  {
    id: "pollution_dhaka",
    journal: "POLLUTION (UNIVERSITY OF TEHRAN PRESS)",
    date: "Print ISSN: 2383-451X",
    title: "Heavy Metal Pollution and Ecological Risk Assessment of the Soil and Grass from Major Riverside Areas in Megacity Dhaka, Bangladesh",
    desc: "Comprehensive ecotoxicological risk modeling, spatial heavy metal concentration mapping, and environmental sustainability analysis.",
    tag: "PEER REVIEWED",
    paperType: "RESEARCH ARTICLE",
    publisher: "The University of Tehran Press",
    authors: "Anik Roy, Md. Sabbir Hossain, Protima Sarker, Xin Liu, Fee Faysal Ahmed, Molla Rahman Shaibur, M. Khabir Uddin",
    doi: links.researchGate,
    themeColor: "#0f766e",
    customImage: ""
  }
];

const ibaiInitialCourses = [
  { id: "r_biostat", title: "R Programming & Biostatistics", tag: "PROGRAMMING", desc: "Data cleaning, ggplot2 publication graphics and statistical hypothesis testing.", fee: "2500", seats: 12, total: 30, status: "Running", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80" },
  { id: "python_ds", title: "Python for Data Analysis & AI", tag: "DATA SCIENCE", desc: "Research data workflows with Pandas, NumPy, Seaborn and machine learning prep.", fee: "3000", seats: 3, total: 25, status: "Running", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80" },
  { id: "genomics_bio", title: "Genomics & Sequence Analysis", tag: "LIFE SCIENCES", desc: "Sequence alignment, phylogenetic inference, gene family identification and motif analysis.", fee: "3500", seats: 13, total: 25, status: "Upcoming", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=700&q=80" },
  { id: "ngs_analysis", title: "NGS & RNA-Seq Data Analysis", tag: "GENOMICS", desc: "Quality control, mapping (HISAT2), quantification, and differential expression with DESeq2.", fee: "4000", seats: 9, total: 20, status: "Upcoming", image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=700&q=80" },
  { id: "cadd_drug", title: "Computer-Aided Drug Design (CADD)", tag: "CHEMINFORMATICS", desc: "Target identification, molecular docking (AutoDock Vina), ADMET and ligand screening.", fee: "3800", seats: 7, total: 20, status: "Running", image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80" },
  { id: "cancer_genomics", title: "Cancer Genomics & Precision Oncology", tag: "CLINICAL BIO", desc: "Oncogenic mutation profiling, TCGA/GEO data mining, biomarker discovery and survival analysis.", fee: "4200", seats: 6, total: 18, status: "Upcoming", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=700&q=80" },
  { id: "md_simulation", title: "Molecular Dynamics (MD) Simulation", tag: "BIOPHYSICS", desc: "Protein-ligand complex dynamics, stability analysis using GROMACS and trajectory analysis.", fee: "4500", seats: 5, total: 15, status: "Running", image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=700&q=80" },
  { id: "metagenomics", title: "Metagenomics & Microbiome Analysis", tag: "MICROBIOME", desc: "16S rRNA sequencing analysis, taxonomic classification, QIIME2 and alpha/beta diversity.", fee: "3800", seats: 8, total: 20, status: "Upcoming", image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=700&q=80" },
  { id: "ml_healthcare", title: "Machine Learning in Healthcare", tag: "AI & ML", desc: "Classification models, neural networks and predictive biomarker modeling with Scikit-learn.", fee: "3500", seats: 11, total: 25, status: "Running", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=700&q=80" },
  { id: "public_health", title: "Public Health Data Analysis", tag: "HEALTH DATA", desc: "Epidemiological study design, OR/RR calculation, logistic regression and ICMJE tables.", fee: "2500", seats: 16, total: 30, status: "Running", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80" },
  { id: "spss_stata", title: "Statistical Modelling with SPSS / STATA", tag: "STATISTICS", desc: "Parametric/non-parametric tests, ANOVA, linear regression and thesis chapter-4 drafting.", fee: "2200", seats: 8, total: 25, status: "Running", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80" },
  { id: "custom_team", title: "Training for your Team / Lab", tag: "WORKSHOP", desc: "Tailored bio-computation workshops for university departments, research labs and groups.", fee: "Custom", seats: 20, total: 50, status: "Custom", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80" }
];

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editModalConfig, setEditModalConfig] = useState(null);
  const [teamMemberEditConfig, setTeamMemberEditConfig] = useState(null);
  const [showPubModal, setShowPubModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // নোটিশ ভিউ এক্সপ্যান্ড স্টেট
  const [noticeExpanded, setNoticeExpanded] = useState(false);

  // BSDS Program Contact Modal State
  const [bsdsActiveModal, setBsdsActiveModal] = useState(null);

  // Meet The Team Banner Image ও সংখ্যাগুলো
  const [teamGroupImage, setTeamGroupImage] = useState("/teammate.jpg");
  const [teamBannerStats, setTeamBannerStats] = useState({
    members: "50+",
    countries: "12+",
    publications: "30+"
  });

  // লেটেস্ট রিসার্চ পেপারস স্টেট
  const [liveResearchPapers, setLiveResearchPapers] = useState(initialRealResearchPapers);
  const [paperEditConfig, setPaperEditConfig] = useState(null);

  // অ্যাওয়ার্ডস স্টেট
  const [liveAwards, setLiveAwards] = useState(initialAwardsList);
  const [awardEditConfig, setAwardEditConfig] = useState(null);

  // Dynamic States
  const [liveStats, setLiveStats] = useState(defaultStats);
  const [liveCourses, setLiveCourses] = useState(ibaiInitialCourses);
  const [liveNotices, setLiveNotices] = useState(null);
  const [livePublications, setLivePublications] = useState(null);
  const [liveContact, setLiveContact] = useState({
    email: "ffa.math@just.edu.bd",
    phone: "+880 1747-091195",
    office: "Room 532, Bangabandhu Academic Bldg, JUST"
  });

  const defaultTeamMembers = [
    { id: "musa", name: "Md. Nahid Hasan Shuvo", role: "Research Assistant", field: "Bioinformatics & Plant Genomics", bio: "Genome-wide identification, RNA interference (RNAi) families, and molecular target modeling in crop improvement.", image: "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=WTCJf_k-ccsC&citpid=2", scholar: "https://scholar.google.com/citations?user=WTCJf_k-ccsC&hl=en", rg: "" },
    { id: "riday", name: "Riday Hossain", role: "Research Assistant", field: "CADD & Molecular Modeling", bio: "Computational drug discovery, target identification, molecular docking and ADMET assessment for novel therapeutics.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", scholar: "", rg: "https://www.researchgate.net/profile/Riday-Hossain" },
    { id: "alamin", name: "Mahmudul Hasan", role: "Research Assistant", field: "Applied Mathematics & Modeling", bio: "Statistical data inference, biomedical regression modeling, and machine learning architectures for health data.", image: "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=c-suH8kAAAAJ&citpid=2", scholar: "https://scholar.google.com/citations?user=c-suH8kAAAAJ&hl=en", rg: "" },
    { id: "slot4", name: "Abu Musa", role: "Genomic Data Scientist", field: "Transcriptomics & RNA-Seq", bio: "Processing bulk RNA-Seq datasets, differential expression analysis and metabolic pathway visualization.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot5", name: "Research Assistant", role: "Clinical Biostatistics", field: "Epidemiological Data Modeling", bio: "Multivariable disease modeling, questionnaire survey analytics, and ICMJE medical table construction.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot6", name: "Research Assistant", role: "Molecular Dynamics", field: "GROMACS & Bio-Simulation", bio: "Macro-molecular dynamics trajectory analysis, binding free energy estimations, and protein stability.", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot7", name: "Research Assistant", role: "Computational Genomics", field: "Metagenomics & Microbiome", bio: "Microbiome sequencing pipelines, 16S taxonomic profiling, and environmental microbial diversity modeling.", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot8", name: "Research Assistant", role: "AI in Healthcare", field: "Deep Learning & Imaging", bio: "Convolutional neural networks for medical diagnostic imaging and multi-omics biological data integration.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot9", name: "Research Assistant", role: "Cheminformatics", field: "Structure-Based Drug Design", bio: "Virtual high-throughput screening, pharmacophore mapping, and in silico pharmacokinetic evaluations.", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot10", name: "Research Assistant", role: "Biostatistics", field: "Survival Analysis & Biometrics", bio: "Time-to-event analysis, clinical trial biometrics, and parametric hazard modeling for cancer prognostics.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot11", name: "Research Assistant", role: "Systems Biology", field: "Gene Regulatory Networks", bio: "Network topology inference, protein complex interaction dynamics, and pathway enrichment analytics.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" },
    { id: "slot12", name: "Research Assistant", role: "Public Health Modeling", field: "Spatial Epidemiology & GIS", bio: "Geospatial disease mapping, infectious disease transmission forecasting, and public health risk assessment.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80", scholar: "#", rg: "#" }
  ];

  const [liveTeam, setLiveTeam] = useState(defaultTeamMembers);
  const [livePi, setLivePi] = useState({
    name: "Fee Faysal Ahmed",
    role: "Principal Investigator & Lecturer",
    dept: "Dept. of Mathematics · Systems Biology & Computational Genomics",
    image: "/feefaysal.jpg",
    email: "ffa.math@just.edu.bd",
    scholar: links.googleScholar,
    rg: links.researchGate
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [piDetailsOpen, setPiDetailsOpen] = useState(false);
  const [researchChoiceOpen, setResearchChoiceOpen] = useState(false);
  const [navResearchOpen, setNavResearchOpen] = useState(false);
  const [page, setPage] = useState("home");
  const goToPage = (nextPage) => { changePage(nextPage); setMenuOpen(false); setMoreOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All");
  const [selectedServices, setSelectedServices] = useState([]);

  // Training Ticker Controls
  const tickerWrapRef = useRef(null);
  const [tickerHovered, setTickerHovered] = useState(false);
  const isDraggingTicker = useRef(false);
  const startXTicker = useRef(0);
  const scrollLeftTicker = useRef(0);
  const hasDraggedTicker = useRef(false);

  useEffect(() => {
    const el = tickerWrapRef.current;
    if (!el) return;
    let animId;
    const scrollStep = () => {
      if (!tickerHovered && !isDraggingTicker.current && el) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(scrollStep);
    };
    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [tickerHovered]);

  const handleTickerMouseDown = (e) => {
    isDraggingTicker.current = true;
    hasDraggedTicker.current = false;
    startXTicker.current = e.pageX - tickerWrapRef.current.offsetLeft;
    scrollLeftTicker.current = tickerWrapRef.current.scrollLeft;
  };

  const handleTickerMouseMove = (e) => {
    if (!isDraggingTicker.current) return;
    e.preventDefault();
    const x = e.pageX - tickerWrapRef.current.offsetLeft;
    const walk = (x - startXTicker.current) * 1.5;
    if (Math.abs(walk) > 4) hasDraggedTicker.current = true;
    tickerWrapRef.current.scrollLeft = scrollLeftTicker.current - walk;
  };

  const handleTickerMouseUp = () => {
    isDraggingTicker.current = false;
  };

  const slideTicker = (direction) => {
    if (tickerWrapRef.current) {
      tickerWrapRef.current.scrollBy({ left: direction * 330, behavior: "smooth" });
    }
  };

  // Latest Research Ticker Controls
  const researchTickerRef = useRef(null);
  const [researchTickerHovered, setResearchTickerHovered] = useState(false);
  const isDraggingResearch = useRef(false);
  const startXResearch = useRef(0);
  const scrollLeftResearch = useRef(0);
  const hasDraggedResearch = useRef(false);

  useEffect(() => {
    const el = researchTickerRef.current;
    if (!el) return;
    let animId;
    const scrollStep = () => {
      if (!researchTickerHovered && !isDraggingResearch.current && el) {
        el.scrollLeft += 0.75;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(scrollStep);
    };
    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [researchTickerHovered]);

  const handleResearchMouseDown = (e) => {
    isDraggingResearch.current = true;
    hasDraggedResearch.current = false;
    startXResearch.current = e.pageX - researchTickerRef.current.offsetLeft;
    scrollLeftResearch.current = researchTickerRef.current.scrollLeft;
  };

  const handleResearchMouseMove = (e) => {
    if (!isDraggingResearch.current) return;
    e.preventDefault();
    const x = e.pageX - researchTickerRef.current.offsetLeft;
    const walk = (x - startXResearch.current) * 1.5;
    if (Math.abs(walk) > 4) hasDraggedResearch.current = true;
    researchTickerRef.current.scrollLeft = scrollLeftResearch.current - walk;
  };

  const handleResearchMouseUp = () => {
    isDraggingResearch.current = false;
  };

  const slideResearchTicker = (direction) => {
    if (researchTickerRef.current) {
      researchTickerRef.current.scrollBy({ left: direction * 330, behavior: "smooth" });
    }
  };

  // Firebase Realtime Listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => setAdminUser(user));

    const unsubSettings = onSnapshot(collection(db, "settings"), (snapshot) => {
      snapshot.docs.forEach((docItem) => {
        if (docItem.id === "stats") {
          const d = docItem.data();
          setLiveStats([
            { value: d.publications || "54", label: "ResearchGate publications", note: "Profile figure observed Oct 2026" },
            { value: d.citations || "626", label: "Citations", note: "ResearchGate profile figure" },
            { value: d.reads || "16.3K+", label: "ResearchGate reads", note: "Profile figure observed Oct 2026" },
            { value: d.interests || "8+", label: "Research interests", note: "Bioinformatics to deep learning" }
          ]);
        }
        if (docItem.id === "ibai_courses") {
          const data = docItem.data();
          setLiveCourses(prev => prev.map(c => data[c.id] ? { ...c, fee: data[c.id].fee ?? c.fee, seats: data[c.id].seats ?? c.seats } : c));
        }
        if (docItem.id === "lab_team") {
          const remoteMembers = docItem.data().members;
          if (Array.isArray(remoteMembers) && remoteMembers.length > 0) {
            setLiveTeam(remoteMembers);
          }
        }
        if (docItem.id === "pi_profile") {
          const p = docItem.data();
          setLivePi(prev => ({ ...prev, ...p }));
        }
        if (docItem.id === "team_banner") {
          const d = docItem.data();
          if (d.image) setTeamGroupImage(d.image);
          if (d.members || d.countries || d.publications) {
            setTeamBannerStats({
              members: d.members || "50+",
              countries: d.countries || "12+",
              publications: d.publications || "30+"
            });
          }
        }
        if (docItem.id === "latest_research_papers") {
          const d = docItem.data();
          if (d && Array.isArray(d.papers) && d.papers.length > 0) {
            setLiveResearchPapers(d.papers);
          }
        }
        if (docItem.id === "awards_data") {
          const d = docItem.data();
          if (d && Array.isArray(d.awards) && d.awards.length > 0) {
            setLiveAwards(d.awards);
          }
        }
        if (docItem.id === "lab_contact") setLiveContact(docItem.data());
        if (docItem.id === "publications_data") setLivePublications(docItem.data().list || publications);
      });
    });

    const unsubNotices = onSnapshot(collection(db, "notices"), (snapshot) => {
      if (!snapshot.empty) setLiveNotices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubAuth(); unsubSettings(); unsubNotices(); };
  }, []);

  const saveLiveSetting = async (docId, data) => {
    try {
      await setDoc(doc(db, "settings", docId), data, { merge: true });
      alert("সফলভাবে ওয়েবসাইটে আপডেট ও সেভ হয়েছে! ✓");
    } catch (err) {
      console.error(err);
      alert("সেভ করতে সমস্যা হয়েছে: " + err.message);
    }
  };

  // ১. প্রিন্সিপাল ইনভেস্টিগেটর (PI) লাইভ ও ডাটাবেজ সেভ ফাংশন
  const savePiData = async (updatedPi) => {
    try {
      setLivePi(updatedPi); // সাথে সাথে ওয়েবসাইটে লাইভ পরিবর্তন
      await setDoc(doc(db, "settings", "pi_profile"), updatedPi, { merge: true }); // ডাটাবেজে স্থায়ী সেভ
      alert("প্রিন্সিপাল ইনভেস্টিগেটরের প্রোফাইল ও ছবি সফলভাবে সেভ হয়েছে! ✓");
    } catch (err) {
      console.error(err);
      alert("PI প্রোফাইল সংরক্ষণে সমস্যা: " + err.message);
    }
  };

  // ২. টিম মেম্বারদের লাইভ ও ডাটাবেজ সেভ ফাংশন
  const saveTeamMemberData = async (updatedMember) => {
    try {
      const updatedList = liveTeam.map((m) => (m.id === updatedMember.id ? updatedMember : m));
      setLiveTeam(updatedList); // সাথে সাথে ওয়েবসাইটে লাইভ পরিবর্তন
      await setDoc(doc(db, "settings", "lab_team"), { members: updatedList }, { merge: true }); // ডাটাবেজে স্থায়ী সেভ
      alert("টিম সদস্যের তথ্য ও ছবি সফলভাবে সেভ হয়েছে! ✓");
    } catch (err) {
      console.error(err);
      alert("টিম ডাটা সংরক্ষণে সমস্যা: " + err.message);
    }
  };


  // লেটেস্ট পেপার সেভ ফাংশন
  const saveResearchPaper = async (updatedPaper) => {
    try {
      const updatedList = liveResearchPapers.map(p => p.id === updatedPaper.id ? updatedPaper : p);
      setLiveResearchPapers(updatedList);
      await setDoc(doc(db, "settings", "latest_research_papers"), { papers: updatedList }, { merge: true });
      alert("রিসার্চ পেপারের তথ্য ও ছবি সফলভাবে ডাটাবেজে সেভ হয়েছে! ✓");
    } catch (err) {
      alert("সেভ এরর: " + err.message);
    }
  };

  // অ্যাওয়ার্ড সেভ ফাংশন
  const saveAwardItem = async (updatedAward) => {
    try {
      let updatedList;
      if (liveAwards.some(a => a.id === updatedAward.id)) {
        updatedList = liveAwards.map(a => a.id === updatedAward.id ? updatedAward : a);
      } else {
        updatedList = [updatedAward, ...liveAwards];
      }
      setLiveAwards(updatedList);
      await setDoc(doc(db, "settings", "awards_data"), { awards: updatedList }, { merge: true });
      alert("অ্যাওয়ার্ড সফলভাবে সেভ হয়েছে! ✓");
    } catch (err) {
      alert("অ্যাওয়ার্ড সেভ এরর: " + err.message);
    }
  };

  const deleteAwardItem = async (awardId) => {
    if (window.confirm("এই অ্যাওয়ার্ডটি মুছে ফেলতে চান?")) {
      const updatedList = liveAwards.filter(a => a.id !== awardId);
      setLiveAwards(updatedList);
      await setDoc(doc(db, "settings", "awards_data"), { awards: updatedList }, { merge: true });
      alert("অ্যাওয়ার্ড মুছে ফেলা হয়েছে!");
    }
  };

  const changePage = (nextPage) => {
    if (nextPage === page) { setMenuOpen(false); setMoreOpen(false); return; }
    const update = () => setPage(nextPage);
    if (document.startViewTransition && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  // BSDS 4 Programs Data
  const bsdsPrograms = [
    {
      id: "seminar",
      title: "On-Campus Seminar",
      desc: "Organize impactful seminars to spread computational biology literacy.",
      btnText: "Learn More",
      icon: Users,
      iconBg: "#fff7ed",
      iconColor: "#ea580c",
      linkColor: "#ea580c"
    },
    {
      id: "coordinator",
      title: "Campus Coordinator",
      desc: "Become a recognized leader and coordinate bioinformatics activities at your institution.",
      btnText: "Apply Now",
      icon: UserCheck,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      linkColor: "#16a34a"
    },
    {
      id: "talk",
      title: "Research Talk",
      desc: "Host or participate in cutting-edge research discussions and presentations.",
      btnText: "Learn More",
      icon: Mic,
      iconBg: "#faf5ff",
      iconColor: "#9333ea",
      linkColor: "#9333ea"
    },
    {
      id: "collaboration",
      title: "Collaboration",
      desc: "Spearhead the bioinformatics movement on your campus and inspire others.",
      btnText: "Apply Now",
      icon: Briefcase,
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
      linkColor: "#2563eb"
    }
  ];

  const serviceOptions = [
    { title: "IELTS & Academic English Coaching", category: "GLOBAL MOBILITY", text: "Targeted Band 7.5+ preparation, scientific writing feedback, and one-on-one speaking practice for study abroad.", icon: BookOpen, image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80", color: "blue" },
    { title: "Global Fellowship & Funded PhD Guidance", category: "HIGHER STUDY", text: "Strategic mentorship for Erasmus Mundus, DAAD, Fulbright and Commonwealth PhD/Postdoc grant applications.", icon: GraduationCap, image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80", color: "mint" },
    { title: "Bio-Data Science Research Internship", category: "RESEARCH TRACK", text: "Live co-mentored research projects on omics data analysis, variant calling, and peer-reviewed publication track.", icon: Dna, image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=700&q=80", color: "violet" },
    { title: "SOP, Motivation Letter & CV Review", category: "ACADEMIC ADVISORY", text: "Detailed professional polish for Statement of Purpose (SOP), Research Proposals, and European-standard Academic CVs.", icon: FileText, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80", color: "peach" },
    { title: "Thesis Statistical Consultation", category: "DATA METHODS", text: "End-to-end guidance for M.Sc/Ph.D. statistical inference, regression diagnostics, and thesis result interpretation.", icon: ChartNoAxesCombined, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80", color: "blue" },
    { title: "In Silico Drug Target & Docking Screening", category: "CHEMINFORMATICS", text: "Virtual screening, AutoDock Vina molecular docking, ADMET assessment, and protein-protein interaction networks.", icon: FlaskConical, image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80", color: "coral" },
    { title: "Genomic Pipeline & Server Deployment", category: "BIOINFORMATICS", text: "Automated Nextflow/Snakemake workflows deployment for RNA-Seq, Metagenomics, and GWAS on institutional HPC.", icon: Network, image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=80", color: "mint" },
    { title: "Institutional Research Collaboration", category: "COLLABORATION", text: "Joint academic projects, co-PI grant proposals, and departmental bio-computational laboratory training bootcamps.", icon: Users, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80", color: "violet" },
  ];

  const toggleService = (title) => setSelectedServices((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  const activeNotices = liveNotices || defaultNotices;
  const filteredPublications = (livePublications || publications).filter((p) =>
    (year === "All" || p.year === year) &&
    `${p.title} ${p.journal} ${p.tag}`.toLowerCase().includes(query.toLowerCase())
  );
  const closeMenu = () => { setMenuOpen(false); setMoreOpen(false); };

  return (
    <main data-page={page}>
      {/* ── HEADER (লোগোর নিচের অতিরিক্ত চিহ্ন অপসারণ) ── */}
      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand-mark lab-brand-mark">
            <img src="/Final.jpg" alt="Data Science & Biochemistry Lab" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </span>
          <span className="brand-name">
            DATA SCIENCE RESEARCH & TRAINING LAB
            <span>JUST · INTERDISCIPLINARY COMPUTATIONAL RESEARCH</span>
          </span>
        </a>

        <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "navigation navigation-open" : "navigation"}>
          <a className={page === "home" ? "active" : ""} href="#home" onClick={(e) => { e.preventDefault(); goToPage("home"); }}>Home</a>
          <a className={page === "profile" ? "active" : ""} href="#about" onClick={(e) => { e.preventDefault(); goToPage("profile"); }}>Profile</a>

          <div className="nav-dropdown-wrap" style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setNavResearchOpen(!navResearchOpen)}
              style={{ minHeight: "38px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "0 12px", borderRadius: "999px", background: "none", border: "none", color: "#526955", fontSize: "14.5px", fontWeight: "750", cursor: "pointer" }}
            >
              Research <ChevronRight size={11} style={{ transform: navResearchOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}/>
            </button>
            {navResearchOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: "0", background: "#fbfdf9", border: "1px solid rgba(49,83,52,0.18)", borderRadius: "14px", padding: "8px", display: "flex", flexDirection: "column", gap: "4px", minWidth: "185px", boxShadow: "0 14px 35px rgba(20,40,25,0.15)", zIndex: 1000 }}>
                <a href={links.googleScholar} target="_blank" rel="noreferrer" onClick={() => setNavResearchOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", color: "#16311e", fontSize: "13px", fontWeight: "750", textDecoration: "none" }}>
                  🎓 Google Scholar <ExternalLink size={12}/>
                </a>
                <a href={links.researchGate} target="_blank" rel="noreferrer" onClick={() => setNavResearchOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", color: "#16311e", fontSize: "13px", fontWeight: "750", textDecoration: "none" }}>
                  🔬 ResearchGate <ExternalLink size={12}/>
                </a>
              </div>
            )}
          </div>

          <a className={page === "publications" ? "active" : ""} href="#publications" onClick={(e) => { e.preventDefault(); goToPage("publications"); }}>Publications</a>
          <a className={page === "awards" ? "active" : ""} href="#awards" onClick={(e) => { e.preventDefault(); goToPage("awards"); }}>Awards</a>
          <a className={page === "training" ? "active" : ""} href="#training" onClick={(e) => { e.preventDefault(); goToPage("training"); }}>Training & IBAI</a>
          <a className={page === "notices" ? "active" : ""} href="#notices" onClick={(e) => { e.preventDefault(); goToPage("notices"); }}>Notices</a>
          <a className={page === "services" ? "active" : ""} href="#services" onClick={(e) => { e.preventDefault(); goToPage("services"); }}>Services</a>
          <a className="nav-contact" href="#contact" onClick={(e) => { e.preventDefault(); goToPage("contact"); }}>Contact <ArrowUpRight size={14} /></a>

          <div className="more-menu-wrap">
            <button className="more-menu-button" onClick={() => setMoreOpen(!moreOpen)}><MoreHorizontal size={23}/></button>
            {moreOpen && <div className="more-menu-panel">
              <span className="more-menu-label">EXPLORE PROFILE</span>
              <button onClick={() => goToPage("interests")}>Research interests</button>
              <button onClick={() => goToPage("methods")}>Methods & software</button>
              <button onClick={() => goToPage("awards")}>Awards & service</button>
              <button onClick={() => goToPage("training")}>Training sessions</button>
              <button onClick={() => goToPage("notices")}>Notices & documents</button>
              <button onClick={() => goToPage("services")}>Services & collaboration</button>
              <button onClick={() => { setShowLoginModal(true); setMoreOpen(false); }} style={{ color: "#2f5a3d", fontWeight: "bold", textAlign: "left", width: "100%", padding: "10px" }}>
                ✏️ Admin Live Edit Mode
              </button>
              <a href={links.googleScholar} target="_blank" rel="noreferrer" onClick={closeMenu}>Google Scholar <ExternalLink size={14}/></a>
              <a href={links.researchGate} target="_blank" rel="noreferrer" onClick={closeMenu}>ResearchGate <ExternalLink size={14}/></a>
            </div>}
          </div>
        </nav>
      </header>

      {/* ── BACK BUTTON ── */}
      {page !== "home" && (
        <div className="page-back-bar page-width">
          <button type="button" className="global-back-button" onClick={() => goToPage("home")} title="Go back to Home">
            <ChevronLeft size={18} />
            <span>Back to Home</span>
          </button>
          <span className="current-page-tag">VIEWING / <strong>{page.toUpperCase()}</strong></span>
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <section className="hero hero-reference-layout" id="home">
        <VideoBackground className="hero-full-video-background" />

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
              {[
                {n:"01",title:"R Programming & Biostatistics",tone:"mint"},
                {n:"02",title:"Python for Data Analysis",tone:"blue"},
                {n:"03",title:"Genomics & Bioinformatics",tone:"violet"},
                {n:"04",title:"Public Health Data Analysis",tone:"peach"},
                {n:"05",title:"Machine Learning for Research",tone:"mint"},
                {n:"06",title:"Deep Learning Fundamentals",tone:"blue"},
                {n:"07",title:"SPSS / STATA Modelling",tone:"violet"},
                {n:"08",title:"Custom Research Workshop",tone:"peach"}
              ].map(item => (
                <button type="button" key={item.n} className={`phone-training-option phone-tone-${item.tone}`} onClick={() => goToPage("training")}>
                  <span>{item.n}</span>
                  <strong>{item.title}</strong>
                  <ArrowRight size={13}/>
                </button>
              ))}
            </div>
            <button type="button" className="phone-training-cta" onClick={() => goToPage("training")}>
              View all training sessions <ArrowUpRight size={13}/>
            </button>
          </div>
        </div>

        <div className="hero-content page-width">
          <div className="hero-topline"><span className="status-dot" /> JUST · BIOINFORMATICS & INTELLIGENCE</div>
          <h1 className="adobe-max-title">Where Data Meets <span className="adobe-gradient">Discovery.</span></h1>
          <p className="adobe-max-lead">Pioneering the intersection of statistical modeling, genomics, and artificial intelligence at Jashore University of Science and Technology.</p>
          <div className="hero-actions">
            <button type="button" className="button button-primary adobe-btn" onClick={() => setResearchChoiceOpen(true)}>
              Explore Research <ArrowUpRight size={17} />
            </button>
            <a className="button button-glass adobe-btn-ghost" href="#publications" onClick={(e) => { e.preventDefault(); goToPage("publications"); }}>
              Publications <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── HOME GLASS INTRO SECTION ── */}
      {page === "home" && (
        <HomeGlassIntro goToPage={goToPage} stats={liveStats} />
      )}

      {/* ── HOME RUNNING TRAINING TICKER (IBAI) ── */}
      {page === "home" && (
        <section className="home-training-ticker-section page-width" style={{ padding: "40px 0 65px" }}>
          <div className="section-heading" style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="eyebrow" style={{ color: "#255734" }}>BIOINFORMATICS & AI INTERNSHIP (IBAI)</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: "850", color: "#142c1b", margin: "6px 0 4px" }}>
                Hands-On Research & <span style={{ color: "#2563eb" }}>Training Programs.</span>
              </h2>
              <p style={{ fontSize: "14px", color: "#5a7362", margin: 0 }}>
                Practical bio-data computation, AI workflows, and applied biostatistics—drag with mouse or click arrows to explore.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => slideTicker(-1)}
                title="Previous"
                style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid rgba(49,83,52,0.22)", background: "#ffffff", color: "#1e4d2b", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => slideTicker(1)}
                title="Next"
                style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1.5px solid rgba(49,83,52,0.22)", background: "#ffffff", color: "#1e4d2b", display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            className="dawn-live-ticker-wrap"
            ref={tickerWrapRef}
            onMouseEnter={() => setTickerHovered(true)}
            onMouseLeave={() => { setTickerHovered(false); isDraggingTicker.current = false; }}
            onMouseDown={handleTickerMouseDown}
            onMouseMove={handleTickerMouseMove}
            onMouseUp={handleTickerMouseUp}
          >
            <div className="dawn-live-ticker-track">
              {liveCourses.concat(liveCourses).map((course, idx) => (
                <div
                  className="dawn-service-card"
                  key={course.id + "-" + idx}
                  onClick={() => {
                    if (hasDraggedTicker.current) return;
                    goToPage("training");
                  }}
                >
                  <div className="dawn-service-media" style={{ backgroundImage: `url("${course.image}")` }}>
                    <span className="dawn-service-tag">{course.tag}</span>
                  </div>
                  <div className="dawn-service-body">
                    <h3 className="dawn-service-title">{course.title}</h3>
                    <p className="dawn-service-desc">{course.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #d2e8d9", paddingTop: "8px", marginTop: "auto", fontSize: "12px", color: "#166534", fontWeight: "bold" }}>
                      <span>Fee: {course.fee === "Custom" ? "Custom" : "৳ " + course.fee + " BDT"}</span>
                      <span>Seats: {course.seats} left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BSDS PROGRAM (COMMUNITY & LEADERSHIP) ── */}
      {page === "home" && (
        <section className="bsds-program-section page-width" style={{ padding: "45px 0 65px" }}>
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 38px" }}>
            <span style={{ font: "12px var(--mono)", fontWeight: "800", color: "#16a34a", letterSpacing: "0.14em", textTransform: "uppercase", display: "inline-block", marginBottom: "8px" }}>
              COMMUNITY & LEADERSHIP
            </span>
            <h2 style={{ fontSize: "clamp(32px, 4.2vw, 48px)", fontWeight: "850", color: "#0f172a", letterSpacing: "-0.04em", margin: "0 0 12px" }}>
              BSDS Program
            </h2>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#475569", margin: 0 }}>
              Bioinformatics Skill Development System. Empowering students, fostering leadership, and spreading knowledge across campuses.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "22px" }}>
            {bsdsPrograms.map((prog) => {
              const IconComponent = prog.icon;
              return (
                <div
                  key={prog.id}
                  onClick={() => setBsdsActiveModal(prog)}
                  style={{
                    background: "#ffffff",
                    borderRadius: "22px",
                    border: "1.5px solid #edf2f7",
                    padding: "32px 24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                    cursor: "pointer",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 16px 36px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.borderColor = prog.linkColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.03)";
                    e.currentTarget.style.borderColor = "#edf2f7";
                  }}
                >
                  <div style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "16px",
                    background: prog.iconBg,
                    color: prog.iconColor,
                    display: "grid",
                    placeItems: "center",
                    marginBottom: "20px"
                  }}>
                    <IconComponent size={26} strokeWidth={2.2} />
                  </div>

                  <h3 style={{ fontSize: "18.5px", fontWeight: "850", color: "#0f172a", margin: "0 0 10px" }}>
                    {prog.title}
                  </h3>

                  <p style={{ fontSize: "13.5px", lineHeight: "1.65", color: "#64748b", margin: "0 0 24px", flex: 1 }}>
                    {prog.desc}
                  </p>

                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13.5px",
                    fontWeight: "800",
                    color: prog.linkColor
                  }}>
                    {prog.btnText} <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── MEET THE TEAM SHOWCASE (WITH EXACT teammate.jpg & PROFILE CONNECTION) ── */}
      {page === "home" && (
        <section className="home-team-showcase-section page-width" style={{ padding: "60px 0 85px", position: "relative" }}>
          {adminUser && (
            <button
              onClick={() => setEditModalConfig({
                title: "টিম সেকশনের সংখ্যা পরিবর্তন করুন",
                fields: [
                  { key: "members", label: "Team Members (যেমন: 50+)" },
                  { key: "countries", label: "Countries (যেমন: 12+)" },
                  { key: "publications", label: "Publications (যেমন: 30+)" },
                ],
                initialData: teamBannerStats,
                onSave: async (data) => {
                  setTeamBannerStats(data);
                  await setDoc(doc(db, "settings", "team_banner"), data, { merge: true });
                  alert("টিম পরিসংখ্যান সফলভাবে আপডেট হয়েছে! ✓");
                }
              })}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 10,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
              }}
            >
              <Edit3 size={13} /> Edit Stats
            </button>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(36px, 5vw, 68px)",
            alignItems: "center"
          }}>
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                padding: "6px 16px",
                borderRadius: "999px",
                color: "#2563eb",
                fontFamily: "var(--mono)",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "0.12em",
                marginBottom: "16px"
              }}>
                MEET THE TEAM
              </div>

              <h2 style={{
                fontSize: "clamp(34px, 4.4vw, 54px)",
                fontWeight: "850",
                color: "#0f172a",
                lineHeight: "1.12",
                letterSpacing: "-0.04em",
                margin: "0 0 20px"
              }}>
                Driven by passion,<br />
                <span style={{ color: "#2563eb" }}>united by science.</span>
              </h2>

              <p style={{
                fontSize: "15.5px",
                lineHeight: "1.75",
                color: "#475569",
                margin: "0 0 32px"
              }}>
                Our interdisciplinary team brings together <strong style={{ color: "#0f172a" }}>bioinformaticians</strong>, <strong style={{ color: "#0f172a" }}>computational chemists</strong>, <strong style={{ color: "#0f172a" }}>clinical researchers</strong>, and <strong style={{ color: "#0f172a" }}>software engineers</strong> — all united by a shared mission to advance life sciences through cutting-edge technology and open collaboration.
              </p>

              <div style={{
                display: "flex",
                gap: "clamp(24px, 4vw, 42px)",
                alignItems: "center",
                marginBottom: "36px",
                paddingBottom: "28px",
                borderBottom: "1px solid #e2e8f0"
              }}>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: "850", color: "#1d4ed8", fontFamily: "var(--mono)", lineHeight: 1 }}>
                    {teamBannerStats.members}
                  </div>
                  <small style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Team Members</small>
                </div>
                <div style={{ width: "1px", height: "34px", background: "#cbd5e1" }}></div>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: "850", color: "#1d4ed8", fontFamily: "var(--mono)", lineHeight: 1 }}>
                    {teamBannerStats.countries}
                  </div>
                  <small style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Countries</small>
                </div>
                <div style={{ width: "1px", height: "34px", background: "#cbd5e1" }}></div>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: "850", color: "#1d4ed8", fontFamily: "var(--mono)", lineHeight: 1 }}>
                    {teamBannerStats.publications}
                  </div>
                  <small style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Publications</small>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => goToPage("profile")}
                  style={{
                    padding: "13px 30px",
                    borderRadius: "14px",
                    background: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: "800",
                    fontSize: "14.5px",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
                    transition: "transform 0.2s ease, background 0.2s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1d4ed8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.transform = "none"; }}
                >
                  Meet the Team
                </button>

                <button
                  type="button"
                  onClick={() => goToPage("contact")}
                  style={{
                    padding: "13px 28px",
                    borderRadius: "14px",
                    background: "#ffffff",
                    color: "#1e293b",
                    border: "1.5px solid #cbd5e1",
                    fontWeight: "800",
                    fontSize: "14.5px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#1e293b"; }}
                >
                  Join Us
                </button>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                position: "relative",
                borderRadius: "28px",
                overflow: "hidden",
                border: "4px solid #ffffff",
                boxShadow: "0 22px 50px rgba(0, 0, 0, 0.12)",
                background: "#f8fafc",
                minHeight: "320px"
              }}>
                <img
                  src={teamGroupImage}
                  alt="Research Lab Members & Scholars"
                  style={{
                    width: "100%",
                    height: "clamp(320px, 42vw, 440px)",
                    objectFit: "cover",
                    objectPosition: "center 28%",
                    display: "block"
                  }}
                  onError={(e) => {
                    if (e.currentTarget.src.includes("teammate.jpg")) {
                      e.currentTarget.src = "/team-meet.jpg";
                    } else if (e.currentTarget.src.includes("team-meet.jpg")) {
                      e.currentTarget.src = "/Final.jpg";
                    }
                  }}
                />

                {adminUser && (
                  <label
                    title="Change Group Photo Directly"
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      zIndex: 10,
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "#2563eb",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      border: "2.5px solid #ffffff",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.35)"
                    }}
                  >
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const compressed = await compressImage(file, 1000, 0.82);
                            setTeamGroupImage(compressed);
                            await setDoc(doc(db, "settings", "team_banner"), { image: compressed }, { merge: true });
                            alert("টিম ফটো সফলভাবে লাইভ আপডেট ও সেভ হয়েছে! ✓");
                          } catch (err) {
                            alert("ছবি আপলোড এরর: " + err.message);
                          }
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div style={{
                position: "absolute",
                bottom: "-16px",
                left: "-14px",
                background: "#ffffff",
                borderRadius: "18px",
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 14px 35px rgba(0, 0, 0, 0.12)",
                border: "1px solid #f1f5f9"
              }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "grid",
                  placeItems: "center"
                }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <span style={{ fontSize: "9.5px", fontWeight: "800", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block" }}>
                    GROWING TEAM
                  </span>
                  <strong style={{ fontSize: "14.5px", fontWeight: "850", color: "#0f172a", display: "block" }}>
                    {teamBannerStats.members} Members
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST RESEARCH (আপনার ৪টি স্ক্রিনশটের আসল পেপার স্ন্যাপশট + এডিটেবল মোড) ── */}
      {page === "home" && (
        <section className="latest-research-section page-width" style={{ padding: "80px 0 65px", position: "relative" }}>
          <div className="section-heading" style={{ marginBottom: "26px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="eyebrow" style={{ color: "#2563eb" }}>PUBLICATIONS & INSIGHTS</span>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 42px)", fontWeight: "850", color: "#0f172a", margin: "6px 0 4px" }}>
                Latest Research
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                type="button"
                onClick={() => goToPage("publications")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: "14.5px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0"
                }}
              >
                View All Research <ArrowRight size={16} />
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => slideResearchTicker(-1)}
                  title="Previous Research"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "1.5px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#334155",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => slideResearchTicker(1)}
                  title="Next Research"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "1.5px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#334155",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div
            className="dawn-live-ticker-wrap"
            ref={researchTickerRef}
            onMouseEnter={() => setResearchTickerHovered(true)}
            onMouseLeave={() => { setResearchTickerHovered(false); isDraggingResearch.current = false; }}
            onMouseDown={handleResearchMouseDown}
            onMouseMove={handleResearchMouseMove}
            onMouseUp={handleResearchMouseUp}
            style={{ padding: "8px 0 20px" }}
          >
            <div className="dawn-live-ticker-track" style={{ gap: "22px" }}>
              {liveResearchPapers.concat(liveResearchPapers).map((paper, idx) => (
                <div
                  key={paper.id + "-" + idx}
                  style={{
                    width: "330px",
                    minWidth: "330px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1.5px solid #edf2f7",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                    padding: "18px 18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                    position: "relative"
                  }}
                  onClick={() => {
                    if (hasDraggedResearch.current) return;
                    window.open(paper.doi, "_blank");
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 18px 40px rgba(37, 99, 235, 0.15)";
                    e.currentTarget.style.borderColor = paper.themeColor || "#93c5fd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.06)";
                    e.currentTarget.style.borderColor = "#edf2f7";
                  }}
                >
                  {adminUser && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPaperEditConfig(paper);
                      }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        zIndex: 10,
                        background: "#1e293b",
                        color: "#fff",
                        border: "none",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Edit3 size={11} /> Edit Paper
                    </button>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", padding: "0 2px" }}>
                    <span style={{
                      fontFamily: "var(--mono)",
                      fontSize: "10.5px",
                      fontWeight: "800",
                      color: paper.themeColor || "#2563eb",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {paper.journal}
                    </span>
                    <span style={{ fontSize: "9px", fontWeight: "800", color: "#166534", background: "#dcfce7", border: "1px solid #bbf7d0", padding: "1px 7px", borderRadius: "999px" }}>
                      {paper.tag}
                    </span>
                  </div>

                  <div style={{
                    width: "100%",
                    height: "175px",
                    background: "#ffffff",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: paper.customImage ? "0" : "12px 14px",
                    marginBottom: "14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    {paper.customImage ? (
                      <img src={paper.customImage} alt={paper.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px solid ${paper.themeColor || "#0f172a"}`, paddingBottom: "4px", marginBottom: "8px" }}>
                            <span style={{ font: "13px 'Times New Roman', serif", fontWeight: "900", color: paper.themeColor || "#0f172a", letterSpacing: "-0.03em" }}>
                              {paper.journal.split(" ")[0]} {paper.publisher}
                            </span>
                            <span style={{ font: "8.5px var(--mono)", fontWeight: "800", color: "#1e3a8a", background: "#e0f2fe", padding: "1px 5px", borderRadius: "3px" }}>
                              {paper.paperType}
                            </span>
                          </div>

                          <h4 style={{
                            fontFamily: "'Times New Roman', serif",
                            fontSize: "12px",
                            fontWeight: "900",
                            color: "#0f172a",
                            lineHeight: "1.3",
                            margin: "0 0 4px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}>
                            {paper.title}
                          </h4>

                          <p style={{ font: "9px sans-serif", fontWeight: "700", color: "#334155", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {paper.authors}
                          </p>
                        </div>

                        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "5px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "8px" }}>
                          <p style={{ font: "7.5px sans-serif", color: "#475569", lineHeight: "1.3", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {paper.desc}
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "3px", justifyContent: "center" }}>
                            <div style={{ height: "3px", background: "#cbd5e1", borderRadius: "2px", width: "90%" }}></div>
                            <div style={{ height: "3px", background: "#e2e8f0", borderRadius: "2px", width: "100%" }}></div>
                            <div style={{ height: "3px", background: "#cbd5e1", borderRadius: "2px", width: "75%" }}></div>
                          </div>
                        </div>
                      </>
                    )}

                    {adminUser && (
                      <label
                        onClick={(e) => e.stopPropagation()}
                        title="Upload Direct Screenshot for this Paper"
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          right: "6px",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#2563eb",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          cursor: "pointer",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                        }}
                      >
                        <Camera size={15} />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              try {
                                const compressed = await compressImage(file, 900, 0.82);
                                await saveResearchPaper({ ...paper, customImage: compressed });
                              } catch (err) {
                                alert("আপলোড এরর: " + err.message);
                              }
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#64748b", fontWeight: "600", marginBottom: "6px", padding: "0 2px" }}>
                    <Calendar size={12} color="#94a3b8" />
                    <span>{paper.date}</span>
                  </div>

                  <h3 style={{
                    fontSize: "14.5px",
                    fontWeight: "800",
                    color: "#0f172a",
                    lineHeight: "1.4",
                    margin: "0 0 8px",
                    padding: "0 2px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {paper.title}
                  </h3>

                  <p style={{
                    fontSize: "12px",
                    lineHeight: "1.6",
                    color: "#64748b",
                    margin: "0 0 16px",
                    padding: "0 2px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flex: 1
                  }}>
                    {paper.desc}
                  </p>

                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#2563eb",
                    marginTop: "auto",
                    padding: "0 2px"
                  }}>
                    Read Paper <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "12px" }}>
            <span style={{ width: "20px", height: "6px", borderRadius: "999px", background: "#2563eb" }}></span>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#cbd5e1" }}></span>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#cbd5e1" }}></span>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#cbd5e1" }}></span>
          </div>
        </section>
      )}

      {/* ── AWARDS SECTION (HONORS & RECOGNITIONS) ── */}
      <section className="awards-section page-width" id="awards" style={{ padding: "40px 0 100px", position: "relative" }}>
        <div className="section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "36px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(234, 179, 8, 0.12)", border: "1px solid rgba(234, 179, 8, 0.35)", padding: "5px 14px", borderRadius: "999px", marginBottom: "12px" }}>
              <Trophy size={14} color="#ca8a04" />
              <span style={{ font: "11px var(--mono)", fontWeight: "800", color: "#a16207", letterSpacing: "0.1em" }}>
                HONORS & DISTINCTIONS
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: "850", color: "#0f172a", margin: "4px 0" }}>
              Academic & Research <span style={{ color: "#ca8a04" }}>Awards.</span>
            </h2>
            <p style={{ fontSize: "15px", color: "#556f5c", margin: 0, maxWidth: "680px" }}>
              Distinguished recognitions, fellowships, and academic accolades honoring contributions to computational statistics, 4IR data science, and mathematical genetics.
            </p>
          </div>

          {adminUser && (
            <button
              onClick={() => setAwardEditConfig({
                id: "award_" + Date.now(),
                year: "2026",
                title: "",
                org: "",
                desc: "",
                badge: "MERIT AWARD",
                image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80"
              })}
              style={{
                background: "linear-gradient(135deg, #245032, #1b3d26)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 6px 18px rgba(36,80,50,0.3)"
              }}
            >
              <Plus size={16}/> Add New Award
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {liveAwards.map((award) => (
            <div
              key={award.id}
              style={{
                background: "#ffffff",
                borderRadius: "22px",
                border: "1.5px solid rgba(49,83,52,0.16)",
                padding: "24px",
                boxShadow: "0 8px 24px rgba(20, 45, 25, 0.05)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 36px rgba(36, 80, 50, 0.12)";
                e.currentTarget.style.borderColor = "#ca8a04";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(20, 45, 25, 0.05)";
                e.currentTarget.style.borderColor = "rgba(49,83,52,0.16)";
              }}
            >
              {adminUser && (
                <div style={{ position: "absolute", top: "14px", right: "14px", display: "flex", gap: "6px", zIndex: 10 }}>
                  <button
                    onClick={() => setAwardEditConfig(award)}
                    style={{ background: "#f0f5ed", border: "1px solid #c5d9c8", color: "#234f30", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    <Edit3 size={11} /> Edit
                  </button>
                  <button
                    onClick={() => deleteAwardItem(award.id)}
                    style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", padding: "4px 8px", borderRadius: "999px", fontSize: "11px", cursor: "pointer" }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ font: "10px var(--mono)", fontWeight: "800", color: "#ca8a04", background: "#fefce8", border: "1px solid #fef08a", padding: "3px 10px", borderRadius: "999px", letterSpacing: "0.08em" }}>
                  {award.badge || "HONOR"}
                </span>
                <span style={{ font: "13px var(--mono)", fontWeight: "850", color: "#245032" }}>
                  {award.year}
                </span>
              </div>

              <div style={{ width: "100%", height: "150px", borderRadius: "14px", overflow: "hidden", marginBottom: "16px", position: "relative", border: "1px solid #e2e8f0" }}>
                <img src={award.image} alt={award.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {adminUser && (
                  <label
                    title="Change Award Certificate Photo"
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#245032",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      border: "2px solid #fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                    }}
                  >
                    <Camera size={15}/>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const compressed = await compressImage(file, 800, 0.8);
                            await saveAwardItem({ ...award, image: compressed });
                          } catch (err) {
                            alert("ছবি আপলোড এরর: " + err.message);
                          }
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <h3 style={{ fontSize: "17.5px", fontWeight: "850", color: "#142d1c", margin: "0 0 4px", lineHeight: "1.35" }}>
                {award.title}
              </h3>
              <span style={{ fontSize: "12.5px", fontWeight: "750", color: "#2563eb", display: "block", marginBottom: "10px" }}>
                {award.org}
              </span>
              <p style={{ fontSize: "13px", lineHeight: "1.65", color: "#556f5c", margin: 0, flex: 1 }}>
                {award.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="stats-strip" style={{ position: "relative" }}>
        {adminUser && (
          <button
            onClick={() => setEditModalConfig({
              title: "পরিসংখ্যান সংখ্যা এডিট করুন",
              fields: [
                { key: "publications", label: "ResearchGate Publications" },
                { key: "citations", label: "Total Citations" },
                { key: "reads", label: "ResearchGate Reads" },
                { key: "interests", label: "Research Interests Count" },
              ],
              initialData: {
                publications: liveStats[0].value,
                citations: liveStats[1].value,
                reads: liveStats[2].value,
                interests: liveStats[3].value
              },
              onSave: (data) => saveLiveSetting("stats", data)
            })}
            style={{
              position: "absolute",
              top: "12px",
              right: "20px",
              zIndex: 10,
              background: "#245032",
              color: "#fff",
              border: "none",
              padding: "7px 14px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            <Edit3 size={12}/> Edit Numbers
          </button>
        )}

        <div className="stats-intro">
          <span className="stats-intro-eyebrow">
            <Microscope size={15}/>
            RESEARCH &amp; ACADEMIC IMPACT
          </span>

          <h2>
            Research That Makes <span>an Impact.</span>
          </h2>

          <p>
            Exploring the intersection of bioinformatics, genomics,
            statistical modelling and deep learning through research,
            scientific discovery and academic collaboration.
          </p>
        </div>

        <div className="page-width stats-grid">
          {liveStats.map((item, index) => {
            const StatIcon = [BookOpen, Quote, ChartNoAxesCombined, Dna][index % 4];
            return (
              <div className="stat-item" key={item.label}>
                <span className="stat-icon">
                  <StatIcon size={22} strokeWidth={1.8}/>
                </span>
                <span className="stat-number">{item.value}</span>
                <span className="stat-label">{item.label}</span>
                <span className="stat-note">{item.note}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PROFILE & TEAM ── */}
      <section className="intro-section page-width" id="about" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "45px", paddingTop: "50px" }}>
        <div style={{ textAlign: "center", maxWidth: "780px", width: "100%", background: "#ffffff", border: "1.5px solid rgba(49,83,52,0.18)", borderRadius: "28px", padding: "36px 26px", boxShadow: "0 18px 45px rgba(0,0,0,0.06)", position: "relative" }}>
          {adminUser && (
            <button onClick={() => setTeamMemberEditConfig({ title: "প্রিন্সিপাল ইনভেস্টিগেটরের প্রোফাইল এডিট", data: livePi, isPi: true })} style={{ position: "absolute", top: "18px", right: "20px", background: "#245032", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
              <Edit3 size={11}/> Edit PI
            </button>
          )}

          <span style={{ font: "11px var(--mono)", fontWeight: "800", color: "#1e528a", background: "#eef3fa", padding: "5px 16px", borderRadius: "999px", display: "inline-block", marginBottom: "12px" }}>
            OUR TEAM & LEADERSHIP
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: "850", color: "#111", margin: "0 0 6px" }}>Meet the Principal Investigator</h2>

          <div style={{ position: "relative", width: "145px", height: "145px", margin: "0 auto 16px" }}>
            <img src={livePi.image} alt={livePi.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: "4px solid #ffffff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }} onError={(e) => { e.currentTarget.src = "/feefaysal.jpg"; }} />
            {adminUser && (
              <label title="Change Profile Picture" style={{ position: "absolute", bottom: "4px", left: "4px", width: "34px", height: "34px", borderRadius: "50%", background: "#245032", color: "#fff", zIndex: 10, display: "grid", placeItems: "center", cursor: "pointer", border: "2px solid #fff" }}>
                <Camera size={16}/>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const compressed = await compressImage(file, 450, 0.8);
                      await savePiData({ ...livePi, image: compressed });
                    } catch (err) {
                      alert("ছবি লোড করতে সমস্যা হয়েছে: " + err.message);
                    }
                  }
                }} />
              </label>
            )}
          </div>

          <h3 style={{ fontSize: "22px", fontWeight: "850", color: "#142d1c", margin: "0 0 4px" }}>{livePi.name}</h3>
          <span style={{ fontSize: "14px", fontWeight: "800", color: "#2563eb", display: "block", marginBottom: "4px" }}>{livePi.role}</span>
          <small style={{ fontSize: "12.5px", color: "#556f5c", display: "block", marginBottom: "16px" }}>{livePi.dept}</small>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            <a href={"mailto:" + livePi.email} style={{ padding: "6px 16px", borderRadius: "999px", background: "#e8f0fe", color: "#1d4ed8", fontSize: "12px", fontWeight: "750", textDecoration: "none" }}>Email</a>
            <a href={livePi.scholar || links.googleScholar} target="_blank" rel="noreferrer" style={{ padding: "6px 16px", borderRadius: "999px", background: "#f3e8ff", color: "#7e22ce", fontSize: "12px", fontWeight: "750", textDecoration: "none" }}>Google Scholar ↗</a>
            <a href={livePi.rg || links.researchGate} target="_blank" rel="noreferrer" style={{ padding: "6px 16px", borderRadius: "999px", background: "#eef5e8", color: "#234f30", fontSize: "12px", fontWeight: "750", textDecoration: "none" }}>ResearchGate ↗</a>
            <a href={links.just} target="_blank" rel="noreferrer" style={{ padding: "6px 16px", borderRadius: "999px", background: "#f1f5f9", color: "#0f172a", fontSize: "12px", fontWeight: "750", textDecoration: "none" }}>Official JUST Profile ↗</a>
          </div>

          <button
            type="button"
            onClick={() => setPiDetailsOpen(!piDetailsOpen)}
            style={{ background: piDetailsOpen ? "#1e4d2b" : "#245032", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "999px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(36,80,50,0.25)" }}
          >
            {piDetailsOpen ? "▲ Hide Full Dossier" : "▼ View Full PI Profile & Thesis Details"}
          </button>

          {piDetailsOpen && (
            <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1.5px dashed rgba(49,83,52,0.2)", textAlign: "left", animation: "page-arrive 0.3s ease" }}>
              <div style={{ marginBottom: "22px" }}>
                <span className="eyebrow" style={{ color: "#255734" }}>FACULTY BIOGRAPHY & RESEARCH FOCUS</span>
                <p style={{ fontSize: "13.5px", color: "#3f5647", lineHeight: "1.75", margin: "6px 0 0", textAlign: "justify" }}>
                  Fee Faysal Ahmed is a Lecturer in the Department of Mathematics at Jashore University of Science and Technology (JUST), Bangladesh. He specializes in computational biostatistics, machine learning in life sciences, and statistical genetics. His research bridges mathematical modeling and high-throughput biological data—focusing on genome-wide gene family identifications, protein-protein interaction (PPI) networks, and in silico drug discovery.
                </p>
              </div>

              <div style={{ background: "#f8fbf7", border: "1.5px solid rgba(49,83,52,0.2)", borderRadius: "16px", padding: "18px 20px", marginBottom: "22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Atom size={20} color="#255734" />
                  <strong style={{ fontSize: "11px", font: "var(--mono)", color: "#1b4d2a" }}>M.SC. THESIS RESEARCH (DISTINCTION)</strong>
                </div>
                <h4 style={{ fontSize: "15.5px", fontWeight: "800", color: "#142d1c", margin: "0 0 6px" }}>
                  Protein-Protein Interactions Prediction Using Statistical Modeling and Its Implications in Drug Discovery
                </h4>
                <a href={links.just} target="_blank" rel="noreferrer" style={{ fontSize: "12px", fontWeight: "bold", color: "#255734", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  Verified on JUST University Portal <ExternalLink size={12}/>
                </a>
              </div>

              <div style={{ marginBottom: "22px" }}>
                <span className="eyebrow" style={{ color: "#255734" }}>ACADEMIC QUALIFICATIONS</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginTop: "8px" }}>
                  <div style={{ background: "#ffffff", border: "1px solid #dce8df", borderRadius: "12px", padding: "14px" }}>
                    <strong style={{ fontSize: "14px", color: "#16311e", display: "block" }}>M.Sc. in Statistics (Thesis Track)</strong>
                    <span style={{ fontSize: "12px", color: "#556f5c" }}>University of Rajshahi (2016–2017)</span>
                    <small style={{ fontSize: "11px", color: "#1b4d2a", fontWeight: "bold", display: "block" }}>CGPA: 3.73 / 4.00 · 1st Class</small>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #dce8df", borderRadius: "12px", padding: "14px" }}>
                    <strong style={{ fontSize: "14px", color: "#16311e", display: "block" }}>B.Sc. (Honours) in Statistics</strong>
                    <span style={{ fontSize: "12px", color: "#556f5c" }}>University of Rajshahi (2012–2016)</span>
                    <small style={{ fontSize: "11px", color: "#1b4d2a", fontWeight: "bold", display: "block" }}>1st Class 1st · Faculty Dean’s Award</small>
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px", background: "#f4f8f3", borderRadius: "14px", border: "1px solid #d5e6db", marginBottom: "20px" }}>
                <span style={{ fontSize: "11px", font: "var(--mono)", fontWeight: "bold", color: "#255734", display: "block", marginBottom: "8px" }}>COURSES TAUGHT AT JUST</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["Biostatistics", "Probability Theory", "Numerical Analysis", "Linear Algebra", "Statistical Inference", "Applied Regression"].map((course, i) => (
                    <span key={i} style={{ fontSize: "11.5px", background: "#fff", border: "1px solid #c8dcd0", padding: "3px 8px", borderRadius: "6px", color: "#1a4023", fontWeight: "600" }}>✓ {course}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 12 RESEARCH ASSISTANTS */}
        <div style={{ width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <span className="eyebrow" style={{ color: "#255734" }}>LAB FELLOWS & SCHOLARS</span>
            <h2 style={{ fontSize: "28px", fontWeight: "850", color: "#142c1b", margin: "6px 0 4px" }}>Research Assistants (12 Members)</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "22px" }}>
            {liveTeam.map((member) => (
              <div key={member.id} style={{ background: "#ffffff", borderRadius: "20px", border: "1.5px solid rgba(49,83,52,0.16)", padding: "22px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
                {adminUser && (
                  <button onClick={() => setTeamMemberEditConfig({ title: "সদস্যের তথ্য ও ছবি এডিট", data: member, isPi: false })} style={{ position: "absolute", top: "14px", right: "14px", background: "#f0f5ed", border: "1px solid #c5d9c8", color: "#234f30", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
                    <Edit3 size={11} /> Edit
                  </button>
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                    <div style={{ position: "relative" }}>
                      <img src={member.image} alt={member.name} style={{ width: "62px", height: "62px", borderRadius: "50%", objectFit: "cover", border: "2px solid #38ef7d" }} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"; }} />
                      {adminUser && (
                        <label title="Change Photo" style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "24px", height: "24px", borderRadius: "50%", background: "#245032", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", border: "1.5px solid #fff" }}>
                          <Camera size={12}/>
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              try {
                                const compressed = await compressImage(file, 300, 0.75);
                                await saveTeamMemberData({ ...member, image: compressed });
                              } catch (err) {
                                alert("ছবি আপলোড এরর: " + err.message);
                              }
                            }
                          }} />
                        </label>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "17px", fontWeight: "850", color: "#16311e", margin: "0 0 2px" }}>{member.name}</h4>
                      <span style={{ fontSize: "12px", fontWeight: "750", color: "#2563eb", display: "block" }}>{member.role}</span>
                      <small style={{ fontSize: "11px", color: "#5d7363" }}>{member.field}</small>
                    </div>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#556f5c", lineHeight: "1.6", margin: "0 0 14px" }}>{member.bio}</p>
                </div>

                <div style={{ display: "flex", gap: "8px", paddingTop: "10px", borderTop: "1px dashed rgba(49,83,52,0.15)" }}>
                  {member.scholar ? (
                    <a href={member.scholar} target="_blank" rel="noreferrer" style={{ flex: 1, padding: "7px", borderRadius: "8px", background: "#f3e8ff", color: "#7e22ce", fontSize: "11px", fontWeight: "750", textDecoration: "none", textAlign: "center" }}>Scholar ↗</a>
                  ) : <span style={{ flex: 1, padding: "7px", borderRadius: "8px", background: "#f8fbf7", color: "#8da491", fontSize: "11px", textAlign: "center" }}>No Scholar</span>}
                  {member.rg ? (
                    <a href={member.rg} target="_blank" rel="noreferrer" style={{ flex: 1, padding: "7px", borderRadius: "8px", background: "#eef5e8", color: "#234f30", fontSize: "11px", fontWeight: "750", textDecoration: "none", textAlign: "center" }}>ResearchGate ↗</a>
                  ) : <span style={{ flex: 1, padding: "7px", borderRadius: "8px", background: "#f8fbf7", color: "#8da491", fontSize: "11px", textAlign: "center" }}>No RG</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PUBLICATIONS ── */}
      <section className="publication-section" id="publications">
        <div className="page-width">
          <div className="section-heading publication-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span className="eyebrow">03 — SELECTED PUBLICATIONS</span>
              <h2>Research that <span className="muted-text">travels.</span></h2>
            </div>
            {adminUser && (
              <button onClick={() => setShowPubModal(true)} style={{ background: "#245032", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Plus size={13}/> Add New Publication
              </button>
            )}
          </div>
          <div className="publication-list">
            {filteredPublications.map((p, i) => (
              <article className="publication-row" key={p.title}>
                <span className="pub-year">{p.year}</span>
                <div className="publication-main">
                  <span className="pub-meta">{p.journal} <i>·</i> {p.tag}</span>
                  <h3>{p.title}</h3>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <a href={p.href} target="_blank" rel="noreferrer" className="publication-link">View publication <ArrowUpRight size={15}/></a>
                    {adminUser && (
                      <button onClick={async () => {
                        if (window.confirm("এই পাবলিকেশনটি মুছে ফেলতে চান?")) {
                          const currentList = livePublications || publications;
                          const updated = currentList.filter(item => item.title !== p.title);
                          setLivePublications(updated);
                          await setDoc(doc(db, "settings", "publications_data"), { list: updated }, { merge: true });
                          alert("পাবলিকেশন মুছে ফেলা হয়েছে!");
                        }
                      }} style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#dc2626", padding: "4px 8px", borderRadius: "6px", cursor: "pointer" }} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINING & IBAI PROGRAMS ── */}
      <section className="training-section page-width" id="training" style={{ paddingBottom: "100px", marginBottom: "40px" }}>
        <div className="section-heading"><span className="eyebrow">BIOINFORMATICS & AI INTERNSHIP (IBAI)</span><h2>Professional Training & <span className="muted-text">Workshops.</span></h2></div>
        <div className="training-grid">
          {liveCourses.map((course) => (
            <article className="training-card" key={course.id}>
              <div className="training-card-banner" style={{ backgroundImage: `url('${course.image}')` }}>
                <span className={`training-status-pill ${course.status.toLowerCase()}`}>{course.status}</span>
              </div>
              <div className="training-card-body">
                <span className="training-sub-tag">{course.tag}</span>
                <h3>{course.title}</h3>
                <p>{course.desc}</p>
                <div className="training-seat-available-box" style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "8px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#617c69" }}>Course Fee:</span>
                    <strong style={{ color: "#173b22", fontSize: "13px" }}>{course.fee === "Custom" ? "Custom" : `৳ ${course.fee} BDT`}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#617c69" }}>Seats:</span>
                    <strong style={{ color: course.seats <= 5 ? "#d97706" : "#1b6334" }}>{course.seats} / {course.total} left</strong>
                  </div>
                </div>
                <button type="button" className="training-enquire-btn" onClick={() => goToPage("contact")}>
                  Enquire & Enroll <ArrowUpRight size={14}/>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section page-width" id="services" style={{ paddingBottom: "95px", marginBottom: "30px" }}>
        <div className="section-heading"><span className="eyebrow">SERVICES & COLLABORATION</span><h2>Choose what you <span className="muted-text">need support with.</span></h2></div>
        <div className="services-grid">
          {serviceOptions.map(({ title, category, text, icon: Icon, image, color }) => {
            const selected = selectedServices.includes(title);
            return (
              <button type="button" key={title} className={`service-card service-${color}${selected ? " is-selected" : ""}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(10,24,16,0.3) 10%, rgba(8,18,12,0.92) 65%), url("${image}")`, backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "hidden" }} onClick={() => toggleService(title)}>
                <span className="service-icon"><Icon size={23}/></span>
                <span className="service-category">{category}</span>
                <strong>{title}</strong>
                <span className="service-description">{text}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── NOTICES (3-ITEM HEIGHT + INTERNAL SCROLL + SEE MORE EXPANDER) ── */}
      <section className="notices-section page-width" id="notices" style={{ padding: "60px 0 95px" }}>
        <div className="section-heading notices-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "26px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.35)", padding: "5px 14px", borderRadius: "999px", marginBottom: "10px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 10px #22c55e", display: "inline-block" }}></span>
              <span style={{ font: "11px var(--mono)", fontWeight: "800", color: "#166534", letterSpacing: "0.1em" }}>
                OFFICIAL NOTICE & CIRCULAR BOARD ({activeNotices.length} NOTICES)
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.8vw, 42px)", fontWeight: "850", color: "#132c1b", margin: "4px 0" }}>
              Notices & <span style={{ background: "linear-gradient(105deg, #16a34a, #2563eb)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>Downloads.</span>
            </h2>
            <p style={{ fontSize: "14px", color: "#587261", margin: 0 }}>
              Stay updated with academic schedules, seminar notifications, and official laboratory announcements.
            </p>
          </div>
          {adminUser && (
            <button onClick={() => setShowNoticeModal(true)} style={{ background: "linear-gradient(135deg, #22c55e, #15803d)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 6px 18px rgba(34, 197, 94, 0.35)" }}>
              <Plus size={16}/> Upload New Notice
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxHeight: noticeExpanded ? "none" : "345px",
            overflowY: noticeExpanded ? "visible" : "auto",
            paddingRight: "6px",
            paddingBottom: "4px",
            scrollBehavior: "smooth"
          }}
        >
          {activeNotices.map((notice, index) => (
            <article
              key={notice.id || index}
              style={{
                background: "#ffffff",
                border: "1.5px solid rgba(49, 83, 52, 0.16)",
                borderRadius: "18px",
                padding: "16px 22px",
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                alignItems: "center",
                gap: "18px",
                boxShadow: "0 6px 20px rgba(20, 45, 25, 0.04)",
                transition: "all 0.22s ease",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(22, 101, 52, 0.12)";
                e.currentTarget.style.borderColor = "#22c55e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(20, 45, 25, 0.04)";
                e.currentTarget.style.borderColor = "rgba(49, 83, 52, 0.16)";
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "linear-gradient(180deg, #22c55e, #2563eb)" }}></div>

              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #eef9f1, #e0f2fe)", border: "1px solid rgba(34, 197, 94, 0.25)", display: "grid", placeItems: "center", color: "#166534", flexShrink: 0 }}>
                <FileText size={22} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ font: "9px var(--mono)", fontWeight: "800", background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff", padding: "2px 7px", borderRadius: "5px", letterSpacing: "0.08em" }}>
                    OFFICIAL
                  </span>
                  <span style={{ font: "10px var(--mono)", fontWeight: "800", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "2px 9px", borderRadius: "999px" }}>
                    {notice.category || "Academic"}
                  </span>
                  <span style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={11} color="#9ca3af" /> {notice.date || "Spring 2026"}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: "15.5px", fontWeight: "800", color: "#111827", lineHeight: "1.35" }}>
                  {notice.title}
                </h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <a
                  href={notice.file}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "9px",
                    background: "#f0fdf4",
                    border: "1.5px solid #86efac",
                    color: "#166534",
                    fontSize: "12px",
                    fontWeight: "800",
                    textDecoration: "none",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#dcfce7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
                >
                  <ExternalLink size={13}/> View Document
                </a>

                <a
                  href={notice.file}
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "9px",
                    background: "linear-gradient(135deg, #15803d, #14532d)",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "800",
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(22, 101, 52, 0.25)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                >
                  <FileDown size={13}/> Download PDF
                </a>

                {adminUser && notice.id && (
                  <button
                    onClick={async () => {
                      if (window.confirm("এই নোটিশটি ডিলিট করতে চান?")) {
                        await deleteDoc(doc(db, "notices", notice.id));
                        alert("নোটিশ মুছে ফেলা হয়েছে!");
                      }
                    }}
                    style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#dc2626", padding: "7px 9px", borderRadius: "9px", cursor: "pointer", display: "grid", placeItems: "center" }}
                    title="Delete Notice"
                  >
                    <Trash2 size={14}/>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {activeNotices.length > 3 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "22px" }}>
            <button
              type="button"
              onClick={() => setNoticeExpanded(!noticeExpanded)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 24px",
                borderRadius: "999px",
                background: "#ffffff",
                border: "1.5px solid rgba(49, 83, 52, 0.25)",
                color: "#166534",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(20, 45, 25, 0.08)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0fdf4";
                e.currentTarget.style.borderColor = "#22c55e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(49, 83, 52, 0.25)";
              }}
            >
              {noticeExpanded ? (
                <>Show Less (Latest 3) <ChevronUp size={16} /></>
              ) : (
                <>See More Notices ({activeNotices.length - 3} More Available) <ChevronDown size={16} /></>
              )}
            </button>
          </div>
        )}
      </section>

      {/* ── CONTACT (হোমপেজে সরাসরি হোয়াটসঅ্যাপ আইকন ও লিংক) ── */}
      <section className="contact-section" id="contact">
        <div className="page-width contact-inner" style={{ position: "relative" }}>
          {adminUser && (
            <button onClick={() => setEditModalConfig({
              title: "কন্টাক্ট ও অফিস ইনফরমেশন এডিট",
              fields: [
                { key: "email", label: "ল্যাব ইমেইল" },
                { key: "phone", label: "ফোন / হোয়াটসঅ্যাপ নম্বর" },
                { key: "office", label: "অফিস / রুম নং" }
              ],
              initialData: liveContact,
              onSave: async (data) => {
                setLiveContact(data);
                await setDoc(doc(db, "settings", "lab_contact"), data, { merge: true });
                alert("কন্টাক্ট ইনফরমেশন সেভ হয়েছে! ✓");
              }
            })} style={{ position: "absolute", top: "10px", right: "20px", background: "#245032", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "999px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
              <Edit3 size={11}/> Edit Contact Info
            </button>
          )}

          <span className="eyebrow">CONNECT</span>
          <h2>Questions, collaboration or research <span className="gradient-text">ideas?</span></h2>
          <div className="contact-cards">
            <a href={"mailto:" + liveContact.email}>
              <Mail size={20} color="#2563eb" />
              <span><small>OFFICIAL EMAIL</small><strong>{liveContact.email}</strong></span>
              <ArrowUpRight size={16}/>
            </a>

            <a href="https://wa.me/8801747091195?text=Hello%20Fee%20Faysal%20Ahmed%20Sir" target="_blank" rel="noreferrer" style={{ borderColor: "rgba(37, 211, 102, 0.4)" }}>
              <MessageCircle size={22} color="#25D366" />
              <span><small style={{ color: "#16a34a", fontWeight: "800" }}>WHATSAPP & DIRECT CALL</small><strong>{liveContact.phone}</strong></span>
              <ArrowUpRight size={16}/>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer professional-footer">
        <div className="footer-main-grid">
          <div className="footer-identity">
            <a className="brand footer-brand" href="#home" onClick={closeMenu}>
              <span className="brand-mark lab-brand-mark">
                <img src="/Final.jpg" alt="Data Science & Biochemistry Lab" onError={(e)=>{e.currentTarget.style.display="none";}}/>
              </span>
              <span className="brand-name">
                DATA SCIENCE RESEARCH & TRAINING LAB
                <span>JUST · INTERDISCIPLINARY COMPUTATIONAL RESEARCH</span>
              </span>
            </a>
            <p className="footer-summary">Statistics, bioinformatics and computational research at Jashore University of Science and Technology.</p>
          </div>
          <div className="footer-column">
            <h4>Quick Navigation</h4>
            <div className="footer-link-list">
              <button onClick={()=>goToPage("home")}>Home</button>
              <button onClick={()=>goToPage("profile")}>Team & Leadership</button>
              <button onClick={()=>goToPage("publications")}>Publications</button>
              <button onClick={()=>goToPage("training")}>Training & IBAI</button>
            </div>
          </div>
          <div className="footer-column">
            <h4>Inquiries</h4>
            <div className="footer-contact-items">
              <a href={"mailto:" + liveContact.email} className="footer-contact-link"><Mail size={14}/> <span>{liveContact.email}</span></a>
              <a href="https://wa.me/8801747091195?text=Hello" target="_blank" rel="noreferrer" className="footer-contact-link"><MessageCircle size={15} color="#25D366"/> <span>{liveContact.phone}</span></a>
            </div>
          </div>
        </div>
        <div className="footer-bottomline">
          <span>© {new Date().getFullYear()} Data Science Research & Training Lab · JUST</span>
        </div>
      </footer>

      {/* ── BSDS PROGRAM INTERACTIVE MODAL (EMAIL & WHATSAPP) ── */}
      {bsdsActiveModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999999,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: "20px"
          }}
          onClick={() => setBsdsActiveModal(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "32px",
              width: "100%",
              maxWidth: "460px",
              position: "relative",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBsdsActiveModal(null)}
              style={{ position: "absolute", top: "18px", right: "18px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
            >
              <X size={20}/>
            </button>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span style={{ font: "11px var(--mono)", fontWeight: "800", color: "#16a34a", background: "#f0fdf4", padding: "4px 14px", borderRadius: "999px", display: "inline-block", marginBottom: "8px" }}>
                BSDS PROGRAM INQUIRY
              </span>
              <h3 style={{ margin: "0 0 6px", fontSize: "21px", fontWeight: "850", color: "#0f172a" }}>
                {bsdsActiveModal.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
                {bsdsActiveModal.desc}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a
                href={`https://wa.me/8801747091195?text=${encodeURIComponent(`Hello Fee Faysal Ahmed Sir,\nI am interested in the BSDS Program: "${bsdsActiveModal.title}". Could you please guide me on how to proceed?`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: "#25D366",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "800",
                  fontSize: "14px",
                  boxShadow: "0 8px 20px rgba(37, 211, 102, 0.3)",
                  transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <MessageCircle size={24} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "14px", fontWeight: "800" }}>Contact via WhatsApp</div>
                    <small style={{ fontSize: "11px", opacity: 0.9 }}>+880 1747-091195 (Direct)</small>
                  </div>
                </div>
                <ArrowRight size={18} />
              </a>

              <a
                href={`mailto:${liveContact.email}?subject=${encodeURIComponent(`BSDS Program Inquiry: ${bsdsActiveModal.title}`)}&body=${encodeURIComponent(`Dear Fee Faysal Ahmed,\n\nI am writing to inquire about the BSDS Program opportunity for "${bsdsActiveModal.title}".\n\nName:\nInstitution/Department:\nPhone Number:\nMessage:\n\nThank you.`)}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: "#16311e",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "800",
                  fontSize: "14px",
                  boxShadow: "0 8px 20px rgba(22, 49, 30, 0.25)",
                  transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Mail size={24} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "14px", fontWeight: "800" }}>Send Official Email</div>
                    <small style={{ fontSize: "11px", opacity: 0.85 }}>{liveContact.email}</small>
                  </div>
                </div>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING WIDGETS & MODALS ── */}
      <a href="https://wa.me/8801747091195?text=Hello" target="_blank" rel="noreferrer" className="floating-whatsapp-btn" aria-label="WhatsApp">
        <span className="whatsapp-pulse-ring"></span>💬
      </a>

      <AdminFloatingBar user={adminUser} onLogout={() => signOut(auth)} />
      <AdminLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={() => {}} />

      {/* INLINE EDIT MODAL */}
      {editModalConfig && (
        <InlineEditModal
          isOpen={true}
          title={editModalConfig.title}
          fields={editModalConfig.fields}
          initialData={editModalConfig.initialData}
          onSave={editModalConfig.onSave}
          onClose={() => setEditModalConfig(null)}
        />
      )}

      {/* LATEST RESEARCH PAPER EDIT MODAL */}
      {paperEditConfig && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "20px" }} onClick={() => setPaperEditConfig(null)}>
          <div style={{ background: "#fff", borderRadius: "22px", padding: "28px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPaperEditConfig(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer" }}><X size={20}/></button>
            <h3 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: "800", color: "#16311e" }}>✏️ রিসার্চ পেপার এডিট ও ছবি পরিবর্তন</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ padding: "12px", background: "#f8fafc", border: "1.5px dashed #2563eb", borderRadius: "10px", textAlign: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb", display: "block", marginBottom: "6px" }}>📷 কম্পিউটার থেকে সরাসরি পেপারের স্ক্রিনশট সিলেক্ট করুন</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const compressed = await compressImage(file, 900, 0.85);
                      setPaperEditConfig(prev => ({ ...prev, customImage: compressed }));
                    } catch (err) {
                      alert("ছবি লোড এরর: " + err.message);
                    }
                  }
                }} style={{ fontSize: "12px" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>পেপার টাইটেল</label>
                <input type="text" value={paperEditConfig.title || ""} onChange={(e) => setPaperEditConfig({ ...paperEditConfig, title: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>জার্নালের নাম</label>
                <input type="text" value={paperEditConfig.journal || ""} onChange={(e) => setPaperEditConfig({ ...paperEditConfig, journal: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>লেখকদের তালিকা (Authors)</label>
                <input type="text" value={paperEditConfig.authors || ""} onChange={(e) => setPaperEditConfig({ ...paperEditConfig, authors: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>প্রকাশের তারিখ (Date)</label>
                <input type="text" value={paperEditConfig.date || ""} onChange={(e) => setPaperEditConfig({ ...paperEditConfig, date: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>DOI বা পেপারের লিংক</label>
                <input type="url" value={paperEditConfig.doi || ""} onChange={(e) => setPaperEditConfig({ ...paperEditConfig, doi: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <button onClick={async () => {
                await saveResearchPaper(paperEditConfig);
                setPaperEditConfig(null);
              }} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}>
                সংরক্ষণ করুন ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AWARDS EDIT MODAL */}
      {awardEditConfig && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "20px" }} onClick={() => setAwardEditConfig(null)}>
          <div style={{ background: "#fff", borderRadius: "22px", padding: "28px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setAwardEditConfig(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer" }}><X size={20}/></button>
            <h3 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: "800", color: "#142d1c" }}>🏆 অ্যাওয়ার্ড এডিট ও তথ্য পরিবর্তন</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ padding: "12px", background: "#fefce8", border: "1.5px dashed #ca8a04", borderRadius: "10px", textAlign: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#a16207", display: "block", marginBottom: "6px" }}>📷 কম্পিউটার থেকে সার্টিফিকেট বা মেডেলের ছবি নির্বাচন করুন</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const compressed = await compressImage(file, 800, 0.8);
                      setAwardEditConfig(prev => ({ ...prev, image: compressed }));
                    } catch (err) {
                      alert("ছবি লোড এরর: " + err.message);
                    }
                  }
                }} style={{ fontSize: "12px" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>অ্যাওয়ার্ডের নাম / Title *</label>
                <input type="text" value={awardEditConfig.title || ""} onChange={(e) => setAwardEditConfig({ ...awardEditConfig, title: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>সাল / Year *</label>
                  <input type="text" value={awardEditConfig.year || ""} onChange={(e) => setAwardEditConfig({ ...awardEditConfig, year: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>ক্যাটাগরি ব্যাজ</label>
                  <input type="text" value={awardEditConfig.badge || ""} onChange={(e) => setAwardEditConfig({ ...awardEditConfig, badge: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>প্রদানকারী প্রতিষ্ঠান / Organization</label>
                <input type="text" value={awardEditConfig.org || ""} onChange={(e) => setAwardEditConfig({ ...awardEditConfig, org: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>বিস্তারিত বিবরণ / Description</label>
                <textarea rows="3" value={awardEditConfig.desc || ""} onChange={(e) => setAwardEditConfig({ ...awardEditConfig, desc: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "12px" }} />
              </div>

              <button onClick={async () => {
                if (!awardEditConfig.title) return alert("অ্যাওয়ার্ডের নাম দিন!");
                await saveAwardItem(awardEditConfig);
                setAwardEditConfig(null);
              }} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#245032", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}>
                অ্যাওয়ার্ড সংরক্ষণ করুন ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLICATION UPLOAD MODAL */}
      <PublicationUploadModal
        isOpen={showPubModal}
        onClose={() => setShowPubModal(false)}
        onSave={async (newPub) => {
          const currentList = livePublications || publications;
          const updated = [newPub, ...currentList];
          setLivePublications(updated);
          await setDoc(doc(db, "settings", "publications_data"), { list: updated }, { merge: true });
          alert("নতুন পাবলিকেশন সফলভাবে যুক্ত হয়েছে! ✓");
        }}
      />

      {/* NOTICE UPLOAD MODAL */}
      <NoticeUploadModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        onSave={async (noticeData) => {
          await addDoc(collection(db, "notices"), noticeData);
          alert("নোটিশ সফলভাবে লাইভ পাবলিশ হয়েছে! ✓");
        }}
      />

      {/* TEAM MEMBER & PI DIRECT EDIT MODAL */}
      {teamMemberEditConfig && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "20px" }} onClick={() => setTeamMemberEditConfig(null)}>
          <div style={{ background: "#fff", borderRadius: "22px", padding: "28px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setTeamMemberEditConfig(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer" }}><X size={20}/></button>
            <h3 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: "800", color: "#16311e" }}>✏️ {teamMemberEditConfig.title}</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ padding: "12px", background: "#f4f8f3", border: "1px dashed #245032", borderRadius: "10px", textAlign: "center" }}>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#245032", display: "block", marginBottom: "6px" }}>📷 কম্পিউটার থেকে সরাসরি ছবি নির্বাচন করুন</label>
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const compressed = await compressImage(file, 400, 0.75);
                      setTeamMemberEditConfig(prev => ({ ...prev, data: { ...prev.data, image: compressed } }));
                    } catch (err) {
                      alert("ছবি লোড করতে সমস্যা: " + err.message);
                    }
                  }
                }} style={{ fontSize: "12px" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>নাম</label>
                <input type="text" value={teamMemberEditConfig.data.name || ""} onChange={(e) => setTeamMemberEditConfig({ ...teamMemberEditConfig, data: { ...teamMemberEditConfig.data, name: e.target.value } })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>পদবী</label>
                <input type="text" value={teamMemberEditConfig.data.role || ""} onChange={(e) => setTeamMemberEditConfig({ ...teamMemberEditConfig, data: { ...teamMemberEditConfig.data, role: e.target.value } })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              {teamMemberEditConfig.isPi ? (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>বিভাগ ও রিসার্চ ফোকাস</label>
                  <input type="text" value={teamMemberEditConfig.data.dept || ""} onChange={(e) => setTeamMemberEditConfig({ ...teamMemberEditConfig, data: { ...teamMemberEditConfig.data, dept: e.target.value } })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                </div>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>গবেষণা ক্ষেত্র (Field)</label>
                    <input type="text" value={teamMemberEditConfig.data.field || ""} onChange={(e) => setTeamMemberEditConfig({ ...teamMemberEditConfig, data: { ...teamMemberEditConfig.data, field: e.target.value } })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>সংক্ষিপ্ত পরিচিতি (Bio)</label>
                    <textarea rows="3" value={teamMemberEditConfig.data.bio || ""} onChange={(e) => setTeamMemberEditConfig({ ...teamMemberEditConfig, data: { ...teamMemberEditConfig.data, bio: e.target.value } })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "12px" }} />
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>Google Scholar Link</label>
                <input type="url" value={teamMemberEditConfig.data.scholar || ""} onChange={(e) => setTeamMemberEditConfig({ ...teamMemberEditConfig, data: { ...teamMemberEditConfig.data, scholar: e.target.value } })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>ResearchGate Link</label>
                <input type="url" value={teamMemberEditConfig.data.rg || ""} onChange={(e) => setTeamMemberEditConfig({ ...teamMemberEditConfig, data: { ...teamMemberEditConfig.data, rg: e.target.value } })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>

              <button onClick={async () => {
                if (teamMemberEditConfig.isPi) {
                  await savePiData(teamMemberEditConfig.data);
                } else {
                  await saveTeamMemberData(teamMemberEditConfig.data);
                }
                setTeamMemberEditConfig(null);
              }} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#245032", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}>
                সংরক্ষণ করুন ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
