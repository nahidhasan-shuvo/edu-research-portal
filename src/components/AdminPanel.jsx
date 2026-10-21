import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

export default function AdminPanel({ onBackToSite }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("notices");

  // Notices
  const [notices, setNotices] = useState([]);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("Academic");
  const [noticeUrl, setNoticeUrl] = useState("");
  const [noticeLoading, setNoticeLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    publications: "54",
    citations: "626",
    reads: "16.3K+",
    interests: "8+"
  });

  // Profile
  const [profile, setProfile] = useState({
    name: "Fee Faysal Ahmed",
    title: "Lecturer, Dept. of Mathematics, JUST",
    email: "ffa.math@just.edu.bd",
    phone: "+880 1747-091195",
    office: "Room 532, Bangabandhu Academic Bldg, JUST"
  });

  // Seats
  const [seats, setSeats] = useState({
    r_programming: 12,
    python: 3,
    genomics: 13,
    public_health: 16,
    spss: 8
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      setUser(userCredential.user);
      fetchAllData();
    } catch (err) {
      console.error("Firebase Login Error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setAuthError("পাসওয়ার্ড অথবা ইমেইল ভুল হয়েছে! আবার চেক করুন।");
      } else if (err.code === "auth/user-not-found") {
        setAuthError("এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট তৈরি করা নেই!");
      } else if (err.code === "auth/network-request-failed") {
        setAuthError("ইন্টারনেট কানেকশন চেক করুন!");
      } else {
        setAuthError("লগইন এরর: " + (err.message || "সমস্যা হয়েছে"));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const fetchAllData = async () => {
    try {
      const noticeSnap = await getDocs(collection(db, "notices"));
      setNotices(noticeSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const settingsSnap = await getDocs(collection(db, "settings"));
      settingsSnap.docs.forEach((docItem) => {
        if (docItem.id === "stats") setStats(docItem.data());
        if (docItem.id === "profile") setProfile(docItem.data());
        if (docItem.id === "training_seats") setSeats(docItem.data());
      });
    } catch (err) {
      console.error("Firestore read error:", err);
    }
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    setNoticeLoading(true);
    try {
      const newNotice = {
        title: noticeTitle,
        category: noticeCategory,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        file: noticeUrl
      };
      await addDoc(collection(db, "notices"), newNotice);
      setNoticeTitle("");
      setNoticeUrl("");
      fetchAllData();
      alert("নোটিশ সফলভাবে পাবলিশ হয়েছে!");
    } catch (err) {
      alert("নোটিশ যোগ করতে সমস্যা হয়েছে! রুলস চেক করুন।");
    }
    setNoticeLoading(false);
  };

  const handleDeleteNotice = async (id) => {
    if (window.confirm("আপনি কি নিশ্চিত এই নোটিশটি ডিলিট করতে চান?")) {
      await deleteDoc(doc(db, "notices", id));
      fetchAllData();
    }
  };

  const handleSaveGeneral = async (docId, dataObject) => {
    try {
      await setDoc(doc(db, "settings", docId), dataObject);
      alert("সফলভাবে ডাটা সেভ হয়েছে!");
    } catch (err) {
      alert("সেভ করতে সমস্যা হয়েছে!");
    }
  };

  // ── ১. লগইন ইন্টারফেস ──
  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "85vh", fontFamily: "sans-serif" }}>
        <form onSubmit={handleLogin} style={{
          background: "#ffffff",
          border: "1px solid #d4ded6",
          borderRadius: "20px",
          padding: "36px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "38px", marginBottom: "8px" }}>🛡️</div>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#162e1e", margin: "0 0 6px" }}>অ্যাডমিন পোর্টাল</h2>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>ল্যাবের ডাটা পরিবর্তন ও নোটিশ আপলোড করতে লগইন করুন</p>
          
          {authError && (
            <div style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#dc2626", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", textAlign: "left" }}>
              ⚠️ {authError}
            </div>
          )}
          
          <div style={{ textAlign: "left", marginBottom: "14px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333", display: "block", marginBottom: "5px" }}>অ্যাডমিন ইমেইল</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="shuvobed8@gmail.com" 
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} 
            />
          </div>

          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333", display: "block", marginBottom: "5px" }}>পাসওয়ার্ড</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="আপনার পাসওয়ার্ড" 
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            style={{ 
              width: "100%", 
              padding: "12px", 
              borderRadius: "8px", 
              background: isLoggingIn ? "#688c75" : "#2f5a3d", 
              color: "#fff", 
              border: "none", 
              fontSize: "14px", 
              fontWeight: "bold", 
              cursor: isLoggingIn ? "not-allowed" : "pointer" 
            }}
          >
            {isLoggingIn ? "লগইন হচ্ছে... অপেক্ষা করুন" : "লগইন করুন"}
          </button>
          
          <button type="button" onClick={onBackToSite} style={{ background: "none", border: "none", color: "#555", marginTop: "16px", cursor: "pointer", fontSize: "13px" }}>
            ← মূল ওয়েবসাইটে ফিরে যান
          </button>
        </form>
      </div>
    );
  }

  // ── ২. সফল লগইন পরবর্তী ড্যাশবোর্ড ইন্টারফেস ──
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#ffffff", padding: "18px 24px", borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.04)", marginBottom: "20px", border: "1px solid #d4ded6"
      }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1b3322", margin: 0 }}>ল্যাব কন্ট্রোল ড্যাশবোর্ড</h2>
          <small style={{ color: "#666" }}>Logged in: <strong>{user.email}</strong></small>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onBackToSite} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #2f5a3d", background: "#fff", cursor: "pointer", fontWeight: "bold" }}>ওয়েবসাইট দেখুন</button>
          <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #dc2626", color: "#dc2626", background: "#fff", cursor: "pointer", fontWeight: "bold" }}>লগআউট</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { id: "notices", label: "🔔 নোটিশ ম্যানেজমেন্ট" },
          { id: "stats", label: "📊 পাবলিকেশন ও সাইটেশন কাউন্ট" },
          { id: "profile", label: "👤 প্রোফাইল ও যোগাযোগ তথ্য" },
          { id: "seats", label: "🎓 ট্রেনিং সিট কন্ট্রোল" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 18px", borderRadius: "10px",
              border: activeTab === tab.id ? "2px solid #2f5a3d" : "1px solid #ccc",
              background: activeTab === tab.id ? "#2f5a3d" : "#ffffff",
              color: activeTab === tab.id ? "#fff" : "#2f5a3d",
              fontWeight: "bold", cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: NOTICES */}
      {activeTab === "notices" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #d4ded6" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#162e1e", marginBottom: "14px" }}>নতুন নোটিশ যোগ করুন</h3>
            <form onSubmit={handleAddNotice} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold" }}>নোটিশের শিরোনাম *</label>
                <input type="text" required placeholder="যেমন: Fall 2026 Routine" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold" }}>ক্যাটাগরি</label>
                <select value={noticeCategory} onChange={(e) => setNoticeCategory(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}>
                  <option>Academic</option>
                  <option>Workshop</option>
                  <option>Research</option>
                  <option>Circular</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold" }}>ফাইল লিংক (Google Drive / Web link) *</label>
                <input type="url" required placeholder="https://drive.google.com/..." value={noticeUrl} onChange={(e) => setNoticeUrl(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>
              <button type="submit" disabled={noticeLoading} style={{ padding: "10px", borderRadius: "8px", background: "#2f5a3d", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "8px" }}>
                {noticeLoading ? "যোগ হচ্ছে..." : "নোটিশ পাবলিশ করুন"}
              </button>
            </form>
          </div>

          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #d4ded6" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#162e1e", marginBottom: "14px" }}>বর্তমান নোটিশসমূহ ({notices.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "350px", overflowY: "auto" }}>
              {notices.map((n) => (
                <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f8faf6", borderRadius: "8px", border: "1px solid #e2ece4" }}>
                  <div>
                    <strong style={{ fontSize: "13px", display: "block" }}>{n.title}</strong>
                    <small style={{ color: "#666" }}>{n.category} · {n.date}</small>
                  </div>
                  <button onClick={() => handleDeleteNotice(n.id)} style={{ background: "#fee2e2", border: "none", color: "#dc2626", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>মুছুন</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATS */}
      {activeTab === "stats" && (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #d4ded6", maxWidth: "550px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>ওয়েবসাইটের পরিসংখ্যান সংখ্যা এডিট করুন</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Publications:</label>
              <input type="text" value={stats.publications} onChange={(e) => setStats({ ...stats, publications: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Citations:</label>
              <input type="text" value={stats.citations} onChange={(e) => setStats({ ...stats, citations: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Reads:</label>
              <input type="text" value={stats.reads} onChange={(e) => setStats({ ...stats, reads: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>Research Interests Count:</label>
              <input type="text" value={stats.interests} onChange={(e) => setStats({ ...stats, interests: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => handleSaveGeneral("stats", stats)} style={{ padding: "10px", borderRadius: "8px", background: "#2f5a3d", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
              পরিসংখ্যান সেভ করুন
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE */}
      {activeTab === "profile" && (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #d4ded6", maxWidth: "550px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>প্রোফাইল ও যোগাযোগ তথ্য পরিবর্তন</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>পূর্ণ নাম:</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>পদবী ও বিভাগ:</label>
              <input type="text" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>ইমেইল:</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>ফোন নম্বর:</label>
              <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold" }}>অফিস রুম নং:</label>
              <input type="text" value={profile.office} onChange={(e) => setProfile({ ...profile, office: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => handleSaveGeneral("profile", profile)} style={{ padding: "10px", borderRadius: "8px", background: "#2f5a3d", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
              প্রোফাইল তথ্য সেভ করুন
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SEATS */}
      {activeTab === "seats" && (
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #d4ded6", maxWidth: "550px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>ট্রেনিং কোর্সের সিট সংখ্যা আপডেট</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { key: "r_programming", label: "R Programming & Biostatistics" },
              { key: "python", label: "Python for Data Analysis" },
              { key: "genomics", label: "Genomics & Bioinformatics" },
              { key: "public_health", label: "Public Health Data Analysis" },
              { key: "spss", label: "Statistical Modelling (SPSS/STATA)" },
            ].map((item) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f8faf6", borderRadius: "8px", border: "1px solid #e2ece4" }}>
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>{item.label}</span>
                <input
                  type="number"
                  value={seats[item.key] || 0}
                  onChange={(e) => setSeats({ ...seats, [item.key]: Number(e.target.value) })}
                  style={{ width: "70px", padding: "6px", borderRadius: "6px", border: "1px solid #ccc", textAlign: "center", fontWeight: "bold" }}
                />
              </div>
            ))}
            <button onClick={() => handleSaveGeneral("training_seats", seats)} style={{ padding: "10px", borderRadius: "8px", background: "#2f5a3d", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
              সিট সংখ্যা সেভ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
