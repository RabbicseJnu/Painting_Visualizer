// previous-code==ProjectListSidebar;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import axios from "../api";
// import Modal from "react-modal";

// import {
//   FaTrash,
//   FaChevronDown,
//   FaChevronRight,
//   FaPlus,
//   FaImage,
//   FaLayerGroup,
// } from "react-icons/fa";
// import { FiUpload } from "react-icons/fi";

// Modal.setAppElement("#root");

// const modalStyles = {
//   content: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "white",
//     padding: "24px",
//     borderRadius: "12px",
//     boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
//     width: "90%",
//     maxWidth: "500px",
//     border: "none",
//   },
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     zIndex: 1000,
//   },
// };

// const DeleteConfirmationModal = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   itemType,
//   itemName,
//   fetchProjects,
// }) => (
//   <Modal
//     isOpen={isOpen}
//     onRequestClose={onClose}
//     contentLabel="Delete Confirmation"
//     style={modalStyles}
//   >
//     <div style={{ maxWidth: "400px" }}>
//       <h2
//         style={{
//           fontSize: "20px",
//           fontWeight: "bold",
//           marginBottom: "16px",
//           color: "#1F2937",
//         }}
//       >
//         Confirm Deletion
//       </h2>
//       <p style={{ color: "#4B5563", marginBottom: "24px" }}>
//         Are you sure you want to delete this {itemType}?{" "}
//         {itemName && (
//           <span style={{ fontWeight: "600", color: "#1F2937" }}>
//             "{itemName}"
//           </span>
//         )}{" "}
//         will be permanently removed.
//       </p>
//       <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
//         <button
//           onClick={onClose}
//           style={{
//             padding: "8px 16px",
//             fontSize: "14px",
//             fontWeight: "500",
//             color: "#374151",
//             backgroundColor: "#F3F4F6",
//             borderRadius: "8px",
//             border: "none",
//             cursor: "pointer",
//             transition: "background-color 0.2s",
//           }}
//           onMouseOver={(e) =>
//             (e.currentTarget.style.backgroundColor = "#E5E7EB")
//           }
//           onMouseOut={(e) =>
//             (e.currentTarget.style.backgroundColor = "#F3F4F6")
//           }
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           style={{
//             padding: "8px 16px",
//             fontSize: "14px",
//             fontWeight: "500",
//             color: "white",
//             backgroundColor: "#EF4444",
//             borderRadius: "8px",
//             border: "none",
//             cursor: "pointer",
//             transition: "background-color 0.2s",
//           }}
//           onMouseOver={(e) =>
//             (e.currentTarget.style.backgroundColor = "#DC2626")
//           }
//           onMouseOut={(e) =>
//             (e.currentTarget.style.backgroundColor = "#EF4444")
//           }
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   </Modal>
// );

// const UploadImageModal = ({
//   projectId,
//   isOpen,
//   onClose,
//   onSuccess,
//   fetchProjects,
// }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState(null);
//   const [title, setTitle] = useState("");

//   const navigate = useNavigate();
//   const [uploadModal, setUploadModal] = useState({
//     isOpen: false,
//     projectId: null,
//   });

//   // Open upload image modal
//   const openUploadModal = (projectId) => {
//     console.log("projectId === >", projectId);
//     setUploadModal({
//       isOpen: true,
//       projectId,
//     });
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setError("Please select a file first");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append("image_file", selectedFile);
//       formData.append("project", projectId);
//       formData.append("title", title);

//       const response = await axios.post(
//         "/images/upload-to-project/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       onClose();
//       await fetchProjects();
//       navigate(`/projects/${response?.data?.id}`);
//     } catch (err) {
//       console.error("Upload failed:", err);
//       setError(err.response?.data?.message || "Failed to upload image");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Upload Image Modal"
//       style={modalStyles}
//     >
//       <div style={{ maxWidth: "400px" }}>
//         <h2
//           style={{
//             fontSize: "20px",
//             fontWeight: "bold",
//             marginBottom: "16px",
//             color: "#1F2937",
//           }}
//         >
//           Upload New Image
//         </h2>

//         <div style={{ marginBottom: "24px" }}>
//           <label
//             style={{
//               display: "block",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "#374151",
//               marginBottom: "4px",
//             }}
//           >
//             Title
//           </label>
//           <input
//             type="text"
//             placeholder="Image Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             style={{
//               width: "100%",
//               padding: "8px 12px",
//               border: "1px solid #D1D5DB",
//               borderRadius: "8px",
//               marginBottom: "16px",
//               fontSize: "14px",
//             }}
//           />

//           <label
//             style={{
//               display: "block",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "#374151",
//               marginBottom: "4px",
//             }}
//           >
//             Image File
//           </label>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               width: "100%",
//             }}
//           >
//             <label
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 width: "100%",
//                 height: "128px",
//                 border: "2px dashed #D1D5DB",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 transition: "background-color 0.2s",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#F9FAFB")
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.backgroundColor = "white")
//               }
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <FiUpload
//                   style={{ width: "32px", height: "32px", color: "#9CA3AF" }}
//                 />
//                 <p
//                   style={{
//                     fontSize: "14px",
//                     color: "#6B7280",
//                     marginTop: "8px",
//                   }}
//                 >
//                   {selectedFile ? selectedFile.name : "Click to upload"}
//                 </p>
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 style={{ opacity: 0, position: "absolute" }}
//               />
//             </label>
//           </div>
//         </div>

//         {error && (
//           <div
//             style={{
//               color: "#EF4444",
//               fontSize: "14px",
//               backgroundColor: "#FEE2E2",
//               padding: "8px 12px",
//               borderRadius: "6px",
//               marginBottom: "16px",
//             }}
//           >
//             {error}
//           </div>
//         )}

//         <div
//           style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
//         >
//           <button
//             onClick={onClose}
//             style={{
//               padding: "8px 16px",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "#374151",
//               backgroundColor: "#F3F4F6",
//               borderRadius: "8px",
//               border: "none",
//               cursor: "pointer",
//               transition: "background-color 0.2s",
//             }}
//             onMouseOver={(e) =>
//               (e.currentTarget.style.backgroundColor = "#E5E7EB")
//             }
//             onMouseOut={(e) =>
//               (e.currentTarget.style.backgroundColor = "#F3F4F6")
//             }
//             disabled={isUploading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUpload}
//             style={{
//               padding: "8px 16px",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "white",
//               backgroundColor: "#3B82F6",
//               borderRadius: "8px",
//               border: "none",
//               cursor: "pointer",
//               transition: "background-color 0.2s",
//               opacity: isUploading || !selectedFile ? 0.5 : 1,
//             }}
//             onMouseOver={(e) =>
//               !isUploading &&
//               selectedFile &&
//               (e.currentTarget.style.backgroundColor = "#2563EB")
//             }
//             onMouseOut={(e) =>
//               !isUploading &&
//               selectedFile &&
//               (e.currentTarget.style.backgroundColor = "#3B82F6")
//             }
//             disabled={isUploading || !selectedFile}
//           >
//             {isUploading ? (
//               <span style={{ display: "flex", alignItems: "center" }}>
//                 <svg
//                   style={{
//                     animation: "spin 1s linear infinite",
//                     marginRight: "8px",
//                     width: "16px",
//                     height: "16px",
//                   }}
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     style={{ opacity: 0.25 }}
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     style={{ opacity: 0.75 }}
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Uploading...
//               </span>
//             ) : (
//               "Upload"
//             )}
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// const ProjectListSidebar = ({ projects, fetchProjects, onProjectUpdate }) => {
//   // const ProjectListSidebar = () => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const [expandedProjects, setExpandedProjects] = useState({});
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     type: null,
//     id: null,
//     name: null,
//     projectId: null,
//     imageId: null,
//   });
//   const [uploadModal, setUploadModal] = useState({
//     isOpen: false,
//     projectId: null,
//   });

//   // __________________________________________________

//   // const [projects, setProjects] = useState([]);
//   // const fetchProjects = async () => {
//   //   try {
//   //     const res = await axios.get("/projects/");
//   //     setProjects(res.data);
//   //   } catch (err) {
//   //     console.error("Failed to fetch projects", err);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchProjects();
//   // }, []);

//   // ____________________________________________________

//   const selectedId = pathname.startsWith("/projects/")
//     ? parseInt(pathname.split("/projects/")[1])
//     : null;

//   const toggleProject = (projectId) => {
//     setExpandedProjects((prev) => ({
//       ...prev,
//       [projectId]: !prev[projectId],
//     }));
//   };

//   const openDeleteModal = (
//     type,
//     id,
//     name,
//     projectId = null,
//     imageId = null
//   ) => {
//     setDeleteModal({
//       isOpen: true,
//       type,
//       id,
//       name,
//       projectId,
//       imageId,
//     });
//   };

//   // const handleDelete = async ({ fetchProjects }) => {
//   //   try {
//   //     let endpoint = "";
//   //     if (deleteModal.type === "project") {
//   //       endpoint = `/projects/${deleteModal.id}/`;
//   //     } else if (deleteModal.type === "image") {
//   //       endpoint = `/images/${deleteModal.id}/`;
//   //     } else if (deleteModal.type === "layer") {
//   //       endpoint = `/layers/${deleteModal.id}/`;
//   //     }

//   //     await axios.delete(endpoint);
//   //     // onProjectUpdate();

//   //     console.log("object response === >", deleteModal);

//   //     await fetchProjects();

//   //     if (deleteModal.type === "project" && selectedId === deleteModal.id) {
//   //       navigate("/");
//   //     } else if (
//   //       deleteModal.type === "image" &&
//   //       selectedId === deleteModal.id
//   //     ) {
//   //       navigate(`/projects/${deleteModal.projectId}`);
//   //     }
//   //   } catch (err) {
//   //     console.error("Delete failed:", err);
//   //   } finally {
//   //     setDeleteModal({ isOpen: false, type: null, id: null, name: null });
//   //   }
//   // };

//   const handleDelete = async () => {
//     try {
//       let endpoint = "";

//       if (deleteModal.type === "project") {
//         endpoint = `/projects/${deleteModal.id}/`;
//       } else if (deleteModal.type === "image") {
//         endpoint = `/images/${deleteModal.id}/`;
//       } else if (deleteModal.type === "layer") {
//         endpoint = `/layers/${deleteModal.id}/`;
//       }

//       await axios.delete(endpoint); // delete request

//       // ✅ Call fetchProjects if provided
//       if (fetchProjects) {
//         await fetchProjects();
//       }

//       // ✅ Handle navigation after deletion
//       if (deleteModal.type === "project" && selectedId === deleteModal.id) {
//         navigate("/");
//       } else if (
//         deleteModal.type === "image" &&
//         selectedId === deleteModal.id
//       ) {
//         const { id } = useParams();
//         navigate(`/projects/${id}`);
//       } else {
//         const { id } = useParams();
//         navigate(`/projects/${id}`);
//       }
//     } catch (err) {
//       setDeleteModal({ isOpen: false, type: null, id: null, name: null });
//     } finally {
//       setDeleteModal({ isOpen: false, type: null, id: null, name: null });
//       if (fetchProjects) {
//         await fetchProjects();
//       }
//       window.location.reload();
//     }
//   };

//   const openUploadModal = (projectId) => {
//     setUploadModal({ isOpen: true, projectId });
//   };

//   const handleImageUploadSuccess = (newImage) => {
//     onProjectUpdate();
//     setUploadModal({ isOpen: false, projectId: null });
//     navigate(`/projects/${newImage.id}`);
//   };

//   const selectedImage = projects
//     .flatMap((project) =>
//       project.images.map((image) => ({ ...image, projectId: project.id }))
//     )
//     .find((image) => image.id === selectedId);

//   const handleLayerClick = (layerId, imageId) => {
//     navigate(`/projects/${imageId}?layer=${layerId}`);
//     localStorage.setItem("selectedLayerId", layerId);
//   };

//   return (
//     <div
//       style={{
//         width: "288px",
//         padding: "20px",
//         borderLeft: "1px solid #f5f5f5",
//         backgroundColor: "rgb(219, 123, 123)",
//         height: "95%",
//         display: "flex",
//         flexDirection: "column",
//         boxShadow: "1px 0 3px rgba(0, 0, 0, 0.05)",
//         borderRadius: "15px", // Rounded all corners
//         marginLeft: "10px",
//       }}
//     >
//       {/* Projects Header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "16px",
//           paddingBottom: "16px",
//           borderBottom: "1px solid #F3F4F6",
//         }}
//       >
//         <h3 style={{
//           fontSize: "20px", // Increased font size
//           fontWeight: "bold",
//           color: "#1F2937",
//           margin: 0
//         }}>
//           Projects
//         </h3>
//         <button
//           onClick={() => navigate("/upload")}
//           style={{
//             padding: "8px 16px", // Increased padding
//             background: "linear-gradient(to right, #8B5CF6, #7C3AED)",
//             color: "white",
//             borderRadius: "8px",
//             border: "none",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: "6px", // Increased gap
//             fontSize: "16px", // Increased font size
//             boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//             transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.background = "linear-gradient(to right, #7C3AED, #6D28D9)";
//             e.currentTarget.style.transform = "translateY(-1px)";
//             e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.background = "linear-gradient(to right, #8B5CF6, #7C3AED)";
//             e.currentTarget.style.transform = "translateY(0)";
//             e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
//           }}
//           onMouseDown={(e) => {
//             e.currentTarget.style.transform = "translateY(1px)";
//           }}
//         >
//           <FaPlus style={{ fontSize: "14px" }} />
//           <span>New Project</span>
//         </button>
//       </div>

//       {/* Projects List */}
//       <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
//         {projects.map((project) => (
//           <div key={project.id} style={{ marginBottom: "12px" }}>
//             {/* Project Item */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "14px 16px", // Increased padding
//                 borderRadius: "10px", // Increased border radius
//                 cursor: "pointer",
//                 backgroundColor: selectedId === project.id ? "#EDE9FE" : "#F5F3FF",
//                 border: selectedId === project.id ? "2px solid #DDD6FE" : "none",
//                 transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//               }}
//               onMouseOver={(e) => {
//                 if (selectedId !== project.id) {
//                   e.currentTarget.style.backgroundColor = "#EDE9FE";
//                   e.currentTarget.style.transform = "translateY(-2px)";
//                   e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
//                 }
//               }}
//               onMouseOut={(e) => {
//                 if (selectedId !== project.id) {
//                   e.currentTarget.style.backgroundColor = "#F5F3FF";
//                   e.currentTarget.style.transform = "translateY(0)";
//                   e.currentTarget.style.boxShadow = "none";
//                 }
//               }}
//               onClick={() => toggleProject(project.id)}
//             >
//               <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
//                 {expandedProjects[project.id] ? (
//                   <FaChevronDown
//                     style={{
//                       marginRight: "12px", // Increased margin
//                       color: selectedId === project.id ? "#7C3AED" : "#8B5CF6",
//                       fontSize: "16px", // Increased font size
//                     }}
//                   />
//                 ) : (
//                   <FaChevronRight
//                     style={{
//                       marginRight: "12px", // Increased margin
//                       color: selectedId === project.id ? "#7C3AED" : "#8B5CF6",
//                       fontSize: "16px", // Increased font size
//                     }}
//                   />
//                 )}
//                 <span
//                   title={project.title}
//                   style={{
//                     flex: 1,
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                     fontWeight: "600",
//                     color: selectedId === project.id ? "#7C3AED" : "#6D28D9",
//                     fontSize: "16px", // Increased font size
//                   }}
//                 >
//                   {project.title}
//                 </span>
//               </div>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   openDeleteModal("project", project.id, project.title);
//                 }}
//                 style={{
//                   color: "#9CA3AF",
//                   marginLeft: "12px", // Increased margin
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   transition: "all 0.2s",
//                   padding: "6px", // Increased padding
//                   borderRadius: "6px", // Increased border radius
//                 }}
//                 onMouseOver={(e) => {
//                   e.currentTarget.style.color = "#EF4444";
//                   e.currentTarget.style.backgroundColor = "#FEE2E2";
//                   e.currentTarget.style.transform = "scale(1.1)";
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.color = "#9CA3AF";
//                   e.currentTarget.style.backgroundColor = "transparent";
//                   e.currentTarget.style.transform = "scale(1)";
//                 }}
//               >
//                 <FaTrash size={16} /> {/* Increased size */}
//               </button>
//             </div>

//             {expandedProjects[project.id] && (
//               <div style={{ marginLeft: "28px", marginTop: "8px" }}> {/* Increased margin */}
//                 {project.images.map((image) => (
//                   <div key={image.id} style={{ marginBottom: "8px" }}>
//                     {/* Image Item */}
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "12px 16px", // Increased padding
//                         borderRadius: "8px", // Increased border radius
//                         cursor: "pointer",
//                         backgroundColor: selectedId === image.id ? "#FEF3C7" : "#FEF9C3",
//                         border: selectedId === image.id ? "2px solid #FDE68A" : "none",
//                         transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//                       }}
//                       onMouseOver={(e) => {
//                         if (selectedId !== image.id) {
//                           e.currentTarget.style.backgroundColor = "#FEF08A";
//                           e.currentTarget.style.transform = "translateY(-2px)";
//                           e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
//                         }
//                       }}
//                       onMouseOut={(e) => {
//                         if (selectedId !== image.id) {
//                           e.currentTarget.style.backgroundColor = "#FEF9C3";
//                           e.currentTarget.style.transform = "translateY(0)";
//                           e.currentTarget.style.boxShadow = "none";
//                         }
//                       }}
//                       onClick={() => navigate(`/projects/${image.id}`)}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           flex: 1,
//                         }}
//                       >
//                         <FaImage
//                           style={{
//                             marginRight: "12px", // Increased margin
//                             color: selectedId === image.id ? "#B45309" : "#D97706",
//                             fontSize: "16px", // Increased font size
//                           }}
//                         />
//                         <span
//                           title={image.title}
//                           style={{
//                             maxWidth: "150px",
//                             flex: 1,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                             fontWeight: "600",
//                             color: selectedId === image.id ? "#B45309" : "#92400E",
//                             fontSize: "16px", // Increased font size
//                           }}
//                         >
//                           {image.title}
//                         </span>
//                       </div>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openDeleteModal("image", image.id, image.name, project.id);
//                         }}
//                         style={{
//                           color: "#9CA3AF",
//                           background: "none",
//                           border: "none",
//                           cursor: "pointer",
//                           transition: "all 0.2s",
//                           padding: "6px", // Increased padding
//                           borderRadius: "6px", // Increased border radius
//                         }}
//                         onMouseOver={(e) => {
//                           e.currentTarget.style.color = "#EF4444";
//                           e.currentTarget.style.backgroundColor = "#FEE2E2";
//                           e.currentTarget.style.transform = "scale(1.1)";
//                         }}
//                         onMouseOut={(e) => {
//                           e.currentTarget.style.color = "#9CA3AF";
//                           e.currentTarget.style.backgroundColor = "transparent";
//                           e.currentTarget.style.transform = "scale(1)";
//                         }}
//                       >
//                         <FaTrash size={16} /> {/* Increased size */}
//                       </button>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Add New Image Button */}
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     padding: "12px 16px", // Increased padding
//                     borderRadius: "8px", // Increased border radius
//                     cursor: "pointer",
//                     backgroundColor: "#F3F4F6",
//                     marginTop: "12px", // Increased margin
//                     border: "2px dashed #D1D5DB", // Thicker border
//                     transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//                   }}
//                   onClick={() => openUploadModal(project.id)}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.backgroundColor = "#E5E7EB";
//                     e.currentTarget.style.transform = "translateY(-2px)";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.backgroundColor = "#F3F4F6";
//                     e.currentTarget.style.transform = "translateY(0)";
//                   }}
//                 >
//                   <FaPlus
//                     style={{
//                       marginRight: "12px", // Increased margin
//                       color: "#6B7280",
//                       fontSize: "16px", // Increased font size
//                     }}
//                   />
//                   <span
//                     style={{
//                       color: "#4B5563",
//                       fontSize: "16px", // Increased font size
//                       fontWeight: "500",
//                     }}
//                   >
//                     Add New Image
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Layer Panel */}
//       {selectedImage && (
//         <div
//           style={{
//             borderTop: "1px solid #E5E7EB",
//             paddingTop: "16px", // Increased padding
//             marginTop: "16px",
//             maxHeight: "30%",
//             overflowY: "auto",
//           }}
//         >
//           <h4
//             style={{
//               fontSize: "20px", // Increased font size
//               fontWeight: "bold",
//               color: "#374151",
//               marginBottom: "12px", // Increased margin
//             }}
//           >
//             Layers Panel
//           </h4>
//           {selectedImage.layers?.length > 0 ? (
//             selectedImage.layers.map((layer) => (
//               <div
//                 key={layer.id}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "12px 16px",
//                   borderRadius: "8px",
//                   backgroundColor: "#ECFDF5",
//                   marginBottom: "8px",
//                   fontSize: "16px",
//                   border: "2px solid #D1FAE5",
//                   transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//                 }}
//                 onClick={() => handleLayerClick(layer.id, selectedImage.id)}
//                 onMouseOver={(e) => {
//                   e.currentTarget.style.backgroundColor = "#D1FAE5";
//                   e.currentTarget.style.transform = "translateY(-2px)";
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.backgroundColor = "#ECFDF5";
//                   e.currentTarget.style.transform = "translateY(0)";
//                 }}
//               >
//                 <span
//                   style={{
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                     fontWeight: "500",
//                     color: "#065F46",
//                   }}
//                 >
//                   {layer.name}{" "}
//                   <span
//                     style={{
//                       color: "#6B7280",
//                       fontStyle: "italic",
//                       fontSize: "14px",
//                     }}
//                   >
//                     ({layer.shape_type})
//                   </span>
//                 </span>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openDeleteModal(
//                       "layer",
//                       layer.id,
//                       layer.name,
//                       selectedImage.projectId,
//                       selectedImage.id
//                     );
//                   }}
//                   style={{
//                     color: "#9CA3AF",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     transition: "all 0.2s",
//                     padding: "6px",
//                     borderRadius: "6px",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.color = "#EF4444";
//                     e.currentTarget.style.backgroundColor = "#FEE2E2";
//                     e.currentTarget.style.transform = "scale(1.1)";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.color = "#9CA3AF";
//                     e.currentTarget.style.backgroundColor = "transparent";
//                     e.currentTarget.style.transform = "scale(1)";
//                   }}
//                 >
//                   <FaTrash size={16} />
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div
//               style={{
//                 padding: "12px 16px", // Increased padding
//                 borderRadius: "8px", // Increased border radius
//                 backgroundColor: "#F3F4F6",
//                 color: "#6B7280",
//                 fontStyle: "italic",
//                 fontSize: "16px", // Increased font size
//               }}
//             >
//               No layers found
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       <DeleteConfirmationModal
//         isOpen={deleteModal.isOpen}
//         onClose={() =>
//           setDeleteModal({ isOpen: false, type: null, id: null, name: null })
//         }
//         onConfirm={handleDelete}
//         itemType={deleteModal.type}
//         itemName={deleteModal.name}
//         fetchProjects={fetchProjects}
//       />

//       <UploadImageModal
//         projectId={uploadModal.projectId}
//         isOpen={uploadModal.isOpen}
//         onClose={() => setUploadModal({ isOpen: false, projectId: null })}
//         onSuccess={handleImageUploadSuccess}
//         fetchProjects={fetchProjects}
//       />
//     </div>
//   );
// };

// export default ProjectListSidebar;


