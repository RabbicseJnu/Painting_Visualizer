// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useNavigate,
// } from "react-router-dom";
// import axios from "./api";
// import ProjectListSidebar from "./components/ProjectListSidebar";
// import ProjectEditorPage from "./components/ProjectEditorPage";
// import UploadProject from "./components/UploadProject";

// const UploadProjectPage = ({ onUploadSuccess }) => {
//   const navigate = useNavigate();
//   const handleSuccess = (project) => {
//     if (onUploadSuccess) {
//       onUploadSuccess(project, navigate);
//     } else {
//       navigate(`/projects/${project.id}`);
//     }
//   };
//   return <UploadProject onUploadSuccess={handleSuccess} />;
// };

// const AppLayout = () => {
//   const [projects, setProjects] = useState([]);

//   const fetchProjects = async () => {
//     try {
//       const res = await axios.get("/projects/");
//       setProjects(res.data);
//     } catch (err) {
//       console.error("Failed to fetch projects", err);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   return (
//     <section
//       style={{
//         backgroundColor: "#bfe2ff",
//         paddingBottom: "20px",
//       }}
//     >
//       <h1 className="canvas-title">
//         <span style={{ color: "red" }}>R</span>
//         <span style={{ color: "orange" }}>a</span>
//         <span style={{ color: "yellow" }}>i</span>
//         <span style={{ color: "green" }}>n</span>
//         <span style={{ color: "blue" }}>b</span>
//         <span style={{ color: "indigo" }}>o</span>
//         <span style={{ color: "violet" }}>w</span>
//         <span>&nbsp;</span>
//         <span style={{ color: "crimson" }}>V</span>
//         <span style={{ color: "deeppink" }}>i</span>
//         <span style={{ color: "coral" }}>s</span>
//         <span style={{ color: "gold" }}>u</span>
//         <span style={{ color: "limegreen" }}>a</span>
//         <span style={{ color: "dodgerblue" }}>l</span>
//         <span style={{ color: "purple" }}>i</span>
//         <span style={{ color: "hotpink" }}>z</span>
//         <span style={{ color: "teal" }}>e</span>
//         <span style={{ color: "slategray" }}>r</span>
//       </h1>
//       <div style={{ display: "flex", height: "100vh" }}>
//         <div style={{ flex: 1, padding: 0 }}>
//           <Routes>
//             <Route
//               path="/projects/:id"
//               element={<ProjectEditorPage fetchProjects={fetchProjects} />}
//             />
//             <Route
//               path="/upload"
//               element={
//                 <UploadProjectPage
//                   onUploadSuccess={async (project, navigate) => {
//                     await fetchProjects();
//                     navigate(`/projects/${project?.images?.[0]?.id}`);
//                   }}
//                 />
//               }
//             />
//           </Routes>
//         </div>
//         <ProjectListSidebar projects={projects} fetchProjects={fetchProjects} />
//         {/* <ProjectListSidebar /> */}
//       </div>
//     </section>
//   );
// };

// export default function App() {
//   return (
//     <Router>
//       <AppLayout />
//     </Router>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "./api";
import Modal from "react-modal";
import {
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

import ProjectListSidebar from "./components/ProjectListSidebar";
import ProjectEditorPage from "./components/ProjectEditorPage";
import UploadProject from "./components/UploadProject";

Modal.setAppElement("#root");

/* ---------- Inline styles ---------- */
const S = {
  page: {
    minHeight: "100vh",
    position: "relative",
    margin: 0,
    background:
      "radial-gradient(1200px 600px at 20% -10%, rgba(59,130,246,0.12), transparent), " +
      "radial-gradient(1000px 600px at 90% 0%, rgba(139,92,246,0.14), transparent), " +
      "linear-gradient(180deg, #e6f0ff 0%, #f1e8ff 55%, #ffffff 100%)",
    backgroundAttachment: "fixed",
  },
  headerWrap: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "transparent",
    padding: "10px 16px",
  },
  header: {
    position: "relative",
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
  },
  brand: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 0.3,
    color: "#111827",
    textShadow: "0 1px 0 rgba(255,255,255,.6)",
  },
  brandRainbow: {
    background:
      "linear-gradient(90deg,#ef4444,#f59e0b,#10b981,#3b82f6,#8b5cf6,#ec4899)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  accountBtn: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
  },
  accountMenu: {
    position: "absolute",
    right: 0,
    marginTop: 8,
    width: 200,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    boxShadow: "0 10px 20px rgba(0,0,0,.08)",
    overflow: "hidden",
  },
  menuItem: {
    width: "100%",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: 0,
    background: "#fff",
    cursor: "pointer",
  },
  shell: {
    padding: "12px 10px 20px",
    background: "transparent",
  },
  contentRow: {
    display: "flex",
    height: "calc(100vh - 64px)",
  },
};

/* ---------- Shared modal styles ---------- */
const modalStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,.12)",
    width: "90%",
    maxWidth: "500px",
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,.45)",
    zIndex: 1000,
  },
};

/* ---------- Login / Signup modal ---------- */
const AuthFormModal = ({ open, mode, onClose, onSuccess, onSwitchMode }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState(""); // NEW: show “account created, please log in”

  useEffect(() => {
    if (open) {
      setForm({ username: "", email: "", password: "" });
      setErr("");
      setInfo("");
      setLoading(false);
    }
  }, [open, mode]);

  // Pretty-print DRF errors
  const fmtErr = (data) => {
    if (!data) return "Something went wrong";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    const rows = Object.entries(data).map(([k, v]) =>
      `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`
    );
    return rows.join(" | ") || "Something went wrong";
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setInfo("");
    try {
      if (mode === "login") {
        const { data } = await axios.post("/login/", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
        try {
          await axios.post("/accounts/claim-guest-projects/");
        } catch {}
        // 🔔 tell parent to show a toast
        onSuccess && onSuccess("login");
        onClose();
      } else {
        // DO NOT auto-login after signup
        await axios.post("/signup/", {
          username: form.username,
          email: form.email,
          password: form.password,
        });

        // Clear any tokens just in case
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        // Switch to login mode with success info
        setInfo("Account created successfully. Please log in to continue.");
        setForm((f) => ({ ...f, password: "" }));
        onSwitchMode && onSwitchMode("login");
      }
    } catch (e2) {
      setErr(fmtErr(e2?.response?.data));
      console.error("Auth error:", e2?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel={mode === "login" ? "Log in" : "Sign up"}
    >
      <div style={{ maxWidth: 440 }}>
        <h2
          style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}
        >
          {mode === "login" ? "Log In" : "Sign Up"}
        </h2>

        {info && (
          <div
            style={{
              marginTop: 10,
              color: "#065f46",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              padding: "8px 10px",
              borderRadius: 8,
            }}
          >
            {info}
          </div>
        )}

        <form onSubmit={submit} style={{ marginTop: 14 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
            Username
          </label>
          <input
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              marginTop: 6,
              marginBottom: 10,
            }}
          />

          {mode === "signup" && (
            <>
              <label
                style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}
              >
                Email (optional)
              </label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  marginTop: 6,
                  marginBottom: 10,
                }}
              />
            </>
          )}

          <label style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              marginTop: 6,
            }}
          />

          {err && (
            <div
              style={{
                marginTop: 10,
                color: "#991b1b",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "8px 10px",
                borderRadius: 8,
              }}
            >
              {err}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginTop: 14,
            }}
          >
            {/* toggle link */}
            <button
              type="button"
              onClick={() =>
                onSwitchMode && onSwitchMode(mode === "login" ? "signup" : "login")
              }
              style={{
                background: "transparent",
                border: "none",
                color: "#6b21a8",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              {mode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Log in"}
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: 0,
                  background: "linear-gradient(90deg,#8b5cf6,#7c3aed)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading
                  ? "Please wait…"
                  : mode === "login"
                  ? "Log In"
                  : "Create Account"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

/* ---------- Upload wrapper (keeps your behavior) ---------- */
const UploadProjectPage = ({ onUploadSuccess }) => {
  const navigate = useNavigate();
  const handleSuccess = (project) => {
    if (onUploadSuccess) {
      onUploadSuccess(project, navigate);
    } else {
      navigate(`/projects/${project.id}`);
    }
  };
  return <UploadProject onUploadSuccess={handleSuccess} />;
};

/* ---------- Header (centered title + right account) ---------- */
function AppHeader({ me, onLogin, onSignup, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div style={S.headerWrap}>
      <header style={S.header}>
        <h1 style={S.brand}>
          <span style={S.brandRainbow}>Rainbow</span> Visualizer
        </h1>

        <div
          ref={ref}
          style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}
        >
          <button
            title={me ? me.username : "Log in / Sign up"}
            onClick={() => setOpen((v) => !v)}
            style={S.accountBtn}
          >
            <FaUserCircle size={18} color="#6B7280" />
          </button>

          {open && (
            <div style={S.accountMenu}>
              {!me ? (
                <>
                  <button
                    style={S.menuItem}
                    onClick={() => {
                      setOpen(false);
                      onLogin();
                    }}
                  >
                    <FaSignInAlt /> Log in
                  </button>
                  <button
                    style={{ ...S.menuItem, borderTop: "1px solid #f3f4f6" }}
                    onClick={() => {
                      setOpen(false);
                      onSignup();
                    }}
                  >
                    <FaUserPlus /> Sign up
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      padding: "10px 12px",
                      fontSize: 14,
                      color: "#374151",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    Signed in as <strong>{me.username}</strong>
                  </div>
                  <button
                    style={S.menuItem}
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

const AppLayout = () => {
  const [projects, setProjects] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [me, setMe] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // 🔔 tiny toast
  const [flash, setFlash] = useState("");
  const showFlash = (msg) => {
    setFlash(msg);
    window.clearTimeout(showFlash._t);
    showFlash._t = window.setTimeout(() => setFlash(""), 2500);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };
  const openSignup = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  // accept optional evt: "login"
  const onAuthSuccess = async (evt) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setMe(user);
      await fetchProjects();
      if (evt === "login") showFlash("Logged in successfully");
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setMe(null);
    showFlash("Logged out");
  };

  return (
    <section style={S.page}>
      {/* 🔔 Toast */}
      {flash && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            background: "#065f46",
            color: "#ecfdf5",
            border: "1px solid #34d399",
            padding: "10px 14px",
            borderRadius: 10,
            boxShadow: "0 10px 20px rgba(0,0,0,.12)",
            zIndex: 1001,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {flash}
        </div>
      )}

      <AppHeader me={me} onLogin={openLogin} onSignup={openSignup} onLogout={logout} />

      <div style={S.shell}>
        <div style={S.contentRow}>
          <div style={{ flex: 1, padding: 0 }}>
            <Routes>
              <Route
                path="/projects/:id"
                element={<ProjectEditorPage fetchProjects={fetchProjects} />}
              />
              <Route
                path="/upload"
                element={
                  <UploadProjectPage
                    onUploadSuccess={async (project, navigate) => {
                      await fetchProjects();
                      navigate(`/projects/${project?.images?.[0]?.id}`);
                    }}
                  />
                }
              />
            </Routes>
          </div>

          <ProjectListSidebar projects={projects} fetchProjects={fetchProjects} />
        </div>
      </div>

      {/* Auth modal */}
      <AuthFormModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={onAuthSuccess}
        onSwitchMode={(m) => setAuthMode(m)}
      />
    </section>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}





