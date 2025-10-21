// import React, { useState } from "react";
// import axios from "../api";

// const UploadProject = ({ onUploadSuccess }) => {
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [file, setFile] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Choose a file");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", desc);
//     formData.append("image_file", file);

//     try {
//       const res = await axios.post("/projects/upload/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Uploaded successfully");
//       console.log("object", res.data);
//       onUploadSuccess(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to upload");
//     }
//   };

//   return (
//     <div style={{ padding: "20px", borderRadius: "8px", display: "flex" }}>
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           Width: 400,
//           margin: "0 auto",
//           display: "flex",
//           flexDirection: "column",
//           border: "1px solid #ccc",
//           padding: "20px",
//           borderRadius: "8px",
//           backgroundColor: "#f9f9f9",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h3>Create New Project</h3>
//         <input
//           type="text"
//           placeholder="Project Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <textarea
//           placeholder="Description"
//           value={desc}
//           onChange={(e) => setDesc(e.target.value)}
//           style={{ width: "100%", height: 80, marginBottom: 10 }}
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setFile(e.target.files[0])}
//           required
//           style={{ marginBottom: 10 }}
//         />
//         <br />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// };

// export default UploadProject;

import React, { useEffect, useRef, useState } from "react";
import axios from "../api";

const MAX_TITLE = 60;
const MAX_DESC = 400;

export default function UploadProject({ onUploadSuccess }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const fileInputRef = useRef(null);
  const styleInjectedRef = useRef(false);

  // Inject component-scoped CSS once
  useEffect(() => {
    if (styleInjectedRef.current) return;
    const css = `
    @keyframes pop { 0%{transform:scale(.98);opacity:.9} 100%{transform:scale(1);opacity:1} }
    @keyframes pulseBorder { 0%{box-shadow:0 0 0 0 rgba(124,58,237,.25)} 100%{box-shadow:0 0 0 14px rgba(124,58,237,0)} }
    .ux-wrap{min-height:calc(100vh - 80px);display:grid;place-items:center;padding:24px;background:linear-gradient(120deg,#e0f2ff33,#fde1ff33);}
    .ux-card{
      width:620px; max-width:94vw;
      background: rgba(255,255,255,.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius:18px; padding:18px 18px 16px;
      border:1px solid rgba(2,6,23,.08);
      box-shadow:0 30px 80px rgba(2,6,23,.12), 0 8px 20px rgba(2,6,23,.06);
      animation: pop .18s ease-out;
    }
    .ux-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
    .ux-badge{font-size:12px;font-weight:700;color:#6d28d9;background:#ede9fe;border:1px solid #ddd6fe;padding:4px 8px;border-radius:999px}
    .ux-title{margin:0;font-size:22px;font-weight:800;letter-spacing:.2px}
    .ux-sub{margin:4px 0 2px;color:#6b7280;font-size:13px}

    .ux-field{margin:12px 0}
    .ux-float{
      position:relative;border-radius:12px;border:1px solid #e5e7eb;background:#f9fafb;
      transition:.15s; box-shadow:inset 0 1px 0 rgba(2,6,23,.02);
    }
    .ux-float:focus-within{ background:#fff; border-color:#c7d2fe; box-shadow:0 0 0 4px #eef2ff; }
    .ux-float input, .ux-float textarea{
      width:100%; border:0; outline:0; background:transparent;
      padding:24px 44px 10px 14px; font-size:14px; color:#111827; resize:vertical;
    }
    .ux-label{
      position:absolute; left:14px; top:12px; color:#9ca3af; font-size:13px; pointer-events:none; transition:.15s;
    }
    .ux-float input:not(:placeholder-shown) ~ .ux-label,
    .ux-float textarea:not(:placeholder-shown) ~ .ux-label,
    .ux-float:focus-within .ux-label{
      top:6px; font-size:11px; color:#7c3aed; font-weight:700;
    }
    .ux-counter{position:absolute;right:10px;bottom:8px;font-size:12px;color:#9ca3af}

    .ux-drop{
      display:flex;align-items:center;justify-content:center;text-align:center;gap:12px;
      min-height:170px;border:2px dashed #d1d5db;border-radius:14px;background:#fff;cursor:pointer;transition:.15s;
    }
    .ux-drop--over{ background:#f8fafc; border-color:#a78bfa; animation: pulseBorder 1.2s ease-out infinite; }
    .ux-drop-icon{font-size:30px}
    .ux-drop-sub{color:#6b7280;font-size:13px}
    .ux-drop-hint{color:#9ca3af;font-size:12px;margin-top:2px}
    .ux-preview{max-height:200px;border-radius:12px;transition: transform .15s; box-shadow:0 8px 18px rgba(2,6,23,.12)}
    .ux-preview:hover{ transform: scale(1.015) }

    .ux-help{margin:8px 0 0;padding-left:18px;color:#6b7280;font-size:13px}
    .ux-msg{display:block;color:#b91c1c;font-size:12px;margin:6px 2px 0}

    .ux-progress{position:relative;margin:12px 0;height:10px;background:#f3f4f6;border-radius:999px;overflow:hidden}
    .ux-progress > div{height:100%;background:linear-gradient(90deg,#8b5cf6,#6366f1);width:0;border-radius:999px;transition:width .15s}
    .ux-progress span{position:absolute;right:8px;top:-22px;color:#6b7280;font-size:12px}

    .ux-actions{display:flex;gap:10px;margin-top:8px}
    .ux-btn{
      flex:1;border:0;border-radius:12px;padding:12px 14px;font-weight:800;letter-spacing:.2px;cursor:pointer;transition:.15s;box-shadow:0 6px 14px rgba(124,58,237,.2);
      color:#fff;background:linear-gradient(90deg,#8b5cf6,#7c3aed);
    }
    .ux-btn:hover{ transform:translateY(-1px); filter:brightness(1.03) }
    .ux-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;box-shadow:none}
    .ux-ghost{ flex:0 0 auto; padding:12px 14px; border-radius:12px; border:1px solid #e5e7eb; background:#fff; color:#374151; font-weight:700 }
    .ux-ghost:hover{ background:#f9fafb }

    .ux-success{
      display:flex;align-items:center;gap:8px;margin:8px 0 0;
      color:#065f46;background:#ecfdf5;border:1px solid #a7f3d0;padding:10px 12px;border-radius:12px;font-size:14px
    }
    `;
    const tag = document.createElement("style");
    tag.innerHTML = css;
    document.head.appendChild(tag);
    styleInjectedRef.current = true;
  }, []);

  // preview
  useEffect(() => {
    if (!file) return setPreview(null);
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  // paste from clipboard (Ctrl/Cmd+V)
  useEffect(() => {
    const onPaste = async (e) => {
      const item = [...e.clipboardData.items].find((i) =>
        i.type.startsWith("image/")
      );
      if (item) {
        const blob = item.getAsFile();
        setFile(blob);
        setErrors((x) => ({ ...x, file: undefined }));
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Project title is required.";
    else if (title.length > MAX_TITLE) e.title = `Max ${MAX_TITLE} characters.`;
    if (desc.length > MAX_DESC) e.desc = `Max ${MAX_DESC} characters.`;
    if (!file) e.file = "Attach a cover image (you can also paste).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onDrop = (ev) => {
    ev.preventDefault();
    setDragOver(false);
    const f = ev.dataTransfer.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErrors((x) => ({ ...x, file: "Only image files are allowed." }));
      return;
    }
    setErrors((x) => ({ ...x, file: undefined }));
    setFile(f);
  };

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setFile(null);
    setPreview(null);
    setErrors({});
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setDone(false);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", desc.trim());
      formData.append("image_file", file);

      const res = await axios.post("/projects/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });

      setSubmitting(false);
      setDone(true);
      setProgress(100);
      onUploadSuccess && onUploadSuccess(res.data);
      // keep data visible; user can hit "New Project" to reset
    } catch (err) {
      setSubmitting(false);
      setErrors({
        submit:
          err.response?.data?.message ||
          err.message ||
          "Upload failed. Please try again.",
      });
    }
  };

  return (
    <div className="ux-wrap">
      <form className="ux-card" onSubmit={handleSubmit}>
        <div className="ux-head">
          <h2 className="ux-title">Create Project</h2>
        </div>

        {/* Title */}
        <div className="ux-field">
          <div className={`ux-float ${errors.title ? "ux-err" : ""}`}>
            <input
              placeholder=" "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE + 5}
              aria-invalid={!!errors.title}
            />
            <label className="ux-label">Project Title</label>
            <span className="ux-counter">{title.length}/{MAX_TITLE}</span>
          </div>
          {errors.title && <span className="ux-msg">{errors.title}</span>}
        </div>

        {/* Description */}
        <div className="ux-field">
          <div className={`ux-float ${errors.desc ? "ux-err" : ""}`}>
            <textarea
              placeholder=" "
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={MAX_DESC + 20}
              rows={4}
              aria-invalid={!!errors.desc}
            />
            <label className="ux-label">Description (optional)</label>
            <span className="ux-counter">{desc.length}/{MAX_DESC}</span>
          </div>
          {errors.desc && <span className="ux-msg">{errors.desc}</span>}
        </div>

        {/* Dropzone */}
        <div
          className={`ux-drop ${dragOver ? "ux-drop--over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
          aria-label="Upload cover image (click or drag & drop)"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="ux-preview" />
          ) : (
            <>
              <div className="ux-drop-icon">🖼️</div>
              <div>
                <div><b>Click to upload</b> or drag & drop</div>
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        {errors.file && <span className="ux-msg">{errors.file}</span>}

        {errors.submit && (
          <div className="ux-success" style={{background:"#fef2f2", color:"#991b1b", borderColor:"#fecaca"}}>
            ❗ {errors.submit}
          </div>
        )}

        {submitting && (
          <div className="ux-progress" aria-live="polite">
            <div style={{ width: `${progress}%` }} />
            <span>{progress}%</span>
          </div>
        )}

        {done && !errors.submit && (
          <div className="ux-success">✅ Project created successfully!</div>
        )}

        <div className="ux-actions">
          <button className="ux-btn" type="submit" disabled={submitting}>
            {submitting ? "Uploading…" : "Create Project"}
          </button>
          {/* <button
            type="button"
            className="ux-ghost"
            onClick={resetForm}
            disabled={submitting}
            title="Clear form"
          >
            New Project
          </button> */}
        </div>
      </form>
    </div>
  );
}
