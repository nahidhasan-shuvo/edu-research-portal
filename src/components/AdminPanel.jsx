import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { X, ShieldAlert, LogOut, Camera, Edit3, Trash2 } from "lucide-react";

// ১. ফেসবুক-স্টাইল অ্যাডমিন লগইন মডাল
export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (err) {
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "20px" }}>
      <div style={{ background: "#ffffff", borderRadius: "20px", padding: "34px", width: "100%", maxWidth: "390px", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#666" }}><X size={20}/></button>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <ShieldAlert size={42} color="#2f5a3d" style={{ marginBottom: "6px" }} />
          <h3 style={{ margin: "0 0 4px", fontSize: "19px", fontWeight: "800", color: "#162e1e" }}>অ্যাডমিন লাইভ মোড</h3>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>ফেসবুকের মতো লাইভ এডিট অপশন চালু করতে লগইন করুন</p>
        </div>

        {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", marginBottom: "14px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "750", display: "block", marginBottom: "4px" }}>ইমেইল</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="shuvobed8@gmail.com" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "750", display: "block", marginBottom: "4px" }}>পাসওয়ার্ড</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: "11px", borderRadius: "8px", background: "#245032", color: "#fff", border: "none", fontWeight: "800", cursor: "pointer", marginTop: "6px" }}>
            {loading ? "যাচাই হচ্ছে..." : "লগইন করে এডিট মোড অন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ২. ফেসবুক-স্টাইল টপ ফ্লোটিং ম্যানেজমেন্ট বার
export function AdminFloatingBar({ user, onLogout }) {
  if (!user) return null;

  const handleSignOut = () => {
    try {
      signOut(auth);
      if (onLogout) onLogout();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ position: "fixed", top: "86px", right: "24px", zIndex: 999999, background: "#132318", color: "#fff", padding: "8px 18px", borderRadius: "999px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.35)", border: "1.5px solid #54e380" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "750", color: "#4eed88" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4eed88", display: "inline-block", boxShadow: "0 0 8px #4eed88" }}></span>
        Edit Mode On ({user?.email || "Admin"})
      </span>
      <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
      <button onClick={handleSignOut} style={{ background: "none", border: "none", color: "#ff8787", fontWeight: "750", fontSize: "11.5px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <LogOut size={12} /> Log Out
      </button>
    </div>
  );
}

// ৩. লাইভ এডিট মডাল
export function InlineEditModal({ isOpen, title, fields, initialData, onSave, onClose }) {
  const [formData, setFormData] = useState(initialData || {});

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", display: "grid", placeItems: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "18px", padding: "26px", width: "100%", maxWidth: "440px", position: "relative", boxShadow: "0 16px 36px rgba(0,0,0,0.18)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "#666" }}><X size={18}/></button>
        <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "800", color: "#1a3321" }}>✏️ {title}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
          {fields && fields.map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#444", display: "block", marginBottom: "3px" }}>{f.label}</label>
              <input
                type={f.type || "text"}
                value={formData[f.key] ?? ""}
                onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>

        <button onClick={() => { if (onSave) onSave(formData); onClose(); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#245032", color: "#fff", border: "none", fontWeight: "750", fontSize: "13px", cursor: "pointer" }}>
          সেভ করুন ✓
        </button>
      </div>
    </div>
  );
}

// ৪. পাবলিকেশন আপলোড মডাল
export function PublicationUploadModal({ isOpen, onClose, onSave }) {
  const [pub, setPub] = useState({ title: "", journal: "", year: "2026", tag: "Plant genomics", href: "" });

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", display: "grid", placeItems: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "18px", padding: "26px", width: "100%", maxWidth: "480px", position: "relative", boxShadow: "0 16px 36px rgba(0,0,0,0.18)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "#666" }}><X size={18}/></button>
        <h3 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: "800", color: "#1a3321" }}>📚 নতুন পাবলিকেশন যোগ করুন</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "11.5px", fontWeight: "700", display: "block", marginBottom: "3px" }}>পেপার টাইটেল *</label>
            <input type="text" placeholder="যেমন: Genome-wide analysis of RNAi..." value={pub.title} onChange={(e) => setPub({ ...pub, title: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", display: "block", marginBottom: "3px" }}>জার্নাল নাম *</label>
              <input type="text" placeholder="যেমন: BMC Genomic Data" value={pub.journal} onChange={(e) => setPub({ ...pub, journal: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", display: "block", marginBottom: "3px" }}>বছর (Year) *</label>
              <input type="text" placeholder="2026" value={pub.year} onChange={(e) => setPub({ ...pub, year: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", display: "block", marginBottom: "3px" }}>ট্যাগ / ফিল্ড</label>
              <input type="text" placeholder="Plant genomics" value={pub.tag} onChange={(e) => setPub({ ...pub, tag: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", display: "block", marginBottom: "3px" }}>DOI / পেপার লিংক *</label>
              <input type="url" placeholder="https://doi.org/..." value={pub.href} onChange={(e) => setPub({ ...pub, href: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }} />
            </div>
          </div>
        </div>

        <button onClick={() => { if (!pub.title || !pub.journal) return alert("টাইটেল ও জার্নাল দিন!"); onSave(pub); onClose(); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#245032", color: "#fff", border: "none", fontWeight: "750", fontSize: "13px", cursor: "pointer" }}>
          পাবলিকেশন লাইভ সেভ করুন ✓
        </button>
      </div>
    </div>
  );
}

// ৫. সরাসরি ফাইল ব্রাউজ করে নোটিশ আপলোড মডাল
export function NoticeUploadModal({ isOpen, onClose, onSave }) {
  const [notice, setNotice] = useState({ title: "", category: "Academic", fileData: "", fileName: "", driveUrl: "" });

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999999, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", display: "grid", placeItems: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "18px", padding: "26px", width: "100%", maxWidth: "460px", position: "relative", boxShadow: "0 16px 36px rgba(0,0,0,0.18)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "#666" }}><X size={18}/></button>
        <h3 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: "800", color: "#1a3321" }}>📄 নতুন নোটিশ আপলোড</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
          <div>
            <label style={{ fontSize: "11.5px", fontWeight: "750", display: "block", marginBottom: "3px" }}>নোটিশের শিরোনাম *</label>
            <input type="text" placeholder="যেমন: Spring 2026 Examination Schedule" value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }} />
          </div>

          <div>
            <label style={{ fontSize: "11.5px", fontWeight: "750", display: "block", marginBottom: "3px" }}>ক্যাটাগরি</label>
            <select value={notice.category} onChange={(e) => setNotice({ ...notice, category: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }}>
              <option>Academic</option>
              <option>Workshop</option>
              <option>Research</option>
              <option>Circular</option>
            </select>
          </div>

          <div style={{ padding: "12px", background: "#f8fbf7", border: "1.5px dashed #245032", borderRadius: "10px", textAlign: "center" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#245032", display: "block", marginBottom: "4px" }}>
              📁 কম্পিউটার থেকে ফাইল / PDF নির্বাচন করুন
            </label>
            <input 
              type="file" 
              accept=".pdf,.docx,.xlsx,.png,.jpg" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNotice({ ...notice, fileData: reader.result, fileName: file.name });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ fontSize: "12px" }} 
            />
            {notice.fileName && <small style={{ display: "block", color: "#166534", marginTop: "4px" }}>সিলেক্টেড: {notice.fileName}</small>}
          </div>

          <div style={{ textAlign: "center", fontSize: "11px", color: "#888" }}>— অথবা —</div>

          <div>
            <label style={{ fontSize: "11.5px", fontWeight: "750", display: "block", marginBottom: "3px" }}>Google Drive / Web PDF Link</label>
            <input type="url" placeholder="https://drive.google.com/..." value={notice.driveUrl} onChange={(e) => setNotice({ ...notice, driveUrl: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "13px" }} />
          </div>
        </div>

        <button onClick={() => {
          if (!notice.title) return alert("শিরোনাম দিন!");
          const finalFile = notice.fileData || notice.driveUrl;
          if (!finalFile) return alert("অনুগ্রহ করে ফাইল ব্রাউজ করুন অথবা লিঙ্ক দিন!");
          onSave({
            title: notice.title,
            category: notice.category,
            file: finalFile,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          });
          onClose();
        }} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#245032", color: "#fff", border: "none", fontWeight: "750", fontSize: "13px", cursor: "pointer" }}>
          নোটিশ লাইভ পাবলিশ করুন ✓
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel() { return null; }
