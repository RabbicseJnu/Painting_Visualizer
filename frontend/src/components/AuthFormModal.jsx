// frontend/src/components/AuthFormModal.jsx
import React, { useEffect, useState } from "react";
import axios from "../api";

const field = (props) => ({
  style: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    outline: "none",
    fontSize: 14,
    ...props?.style,
  },
  ...props,
});

export default function AuthFormModal({ open, mode = "login", onClose, onSuccess }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ username: "", email: "", password: "" });
      setErr("");
      setLoading(false);
    }
  }, [open, mode]);

  if (!open) return null;

  const fmtErr = (data) => {
    if (!data) return "Something went wrong";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    const pairs = Object.entries(data).map(([k, v]) =>
      `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`
    );
    return pairs.join(" | ") || "Something went wrong";
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      if (mode === "login") {
        const { data } = await axios.post("/auth/login/", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        // signup -> normalize username on BE; FE 그대로 পাঠাই
        await axios.post("/accounts/signup/", {
          username: form.username,
          email: form.email || undefined,
          password: form.password,
        });
        const { data } = await axios.post("/auth/login/", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      onSuccess && onSuccess();
      onClose();
    } catch (e2) {
      setErr(fmtErr(e2?.response?.data));
      console.error("Auth error:", e2?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          maxWidth: "92vw",
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
        }}
      >
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>
          {mode === "login" ? "Log In" : "Sign Up"}
        </h3>

        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <input
            {...field({ placeholder: "Username", value: form.username })}
            onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
            required
          />
          {mode === "signup" && (
            <input
              {...field({ placeholder: "Email (optional)", type: "email", value: form.email })}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            />
          )}
          <input
            {...field({ placeholder: "Password (min 6)", type: "password", value: form.password })}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            required
          />

          {err && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                padding: "8px 10px",
                borderRadius: 8,
              }}
            >
              {err}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              style={{
                background: "linear-gradient(90deg,#8B5CF6,#7C3AED)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
