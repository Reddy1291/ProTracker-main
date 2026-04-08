import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { projectAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Upload, FileText, Image, X, CheckCircle } from "lucide-react";

export function CreateProjectModal({ open, onOpenChange, onSuccess, project }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState(""); // "" | "creating" | "uploading" | "done"
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    abstractText: "",
    tags: "",
    repoLink: "",
    demoLink: "",
    techStack: "",
    features: "",
    coverImageURL: "",
    visibility: "public"
  });

  const resetForm = () => {
    setFormData({
      title: "",
      abstractText: "",
      tags: "",
      repoLink: "",
      demoLink: "",
      techStack: "",
      features: "",
      coverImageURL: "",
      visibility: "public"
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadPhase("");
  };

  useEffect(() => {
    if (project && open) {
      setFormData({
        title: project.title || "",
        abstractText: project.abstract || "",
        tags: project.tags?.join(", ") || "",
        repoLink: project.repoLink || "",
        demoLink: project.demoLink || "",
        techStack: project.techStack?.join(", ") || "",
        features: project.features?.join(", ") || "",
        coverImageURL: project.coverImageURL || "",
        visibility: project.visibility || "public"
      });
    } else if (!project && open) {
      resetForm();
    }
  }, [project, open]);

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a PDF, Word document, or image file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be under 20MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return null;
    if (file.type.startsWith("image/")) {
      return <Image className="w-5 h-5 text-purple-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a Project Title!");
      return;
    }
    if (!formData.abstractText.trim()) {
      toast.error("Please enter a Description!");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      let createdProject = project;

      if (project) {
        setUploadPhase("creating");
        setUploadProgress(10);
        createdProject = await projectAPI.update(project.id, formData);
        setUploadProgress(30);
      } else {
        setUploadPhase("creating");
        setUploadProgress(10);
        createdProject = await projectAPI.create(formData, user.id);
        setUploadProgress(30);
      }

      if (selectedFile && createdProject && createdProject.id) {
        setUploadPhase("uploading");
        await projectAPI.uploadDocument(createdProject.id, selectedFile, (progressEvent) => {
          const fileProgress = Math.round((progressEvent.loaded * 60) / progressEvent.total);
          setUploadProgress(30 + fileProgress); // 30-90%
        });
        setUploadProgress(95);
      } else {
        setUploadProgress(90);
      }

      setUploadPhase("done");
      setUploadProgress(100);

      await new Promise((r) => setTimeout(r, 600));

      toast.success(project ? "Project updated successfully!" : "Project created successfully!");
      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(project ? "Failed to update project." : "Failed to create project.");
      console.error(error);
      setUploadPhase("");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const getProgressLabel = () => {
    switch (uploadPhase) {
      case "creating":
        return project ? "Updating project..." : "Creating project...";
      case "uploading":
        return "Uploading file...";
      case "done":
        return "Complete!";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!loading) onOpenChange(val); }}>
      <DialogContent className="sm:max-w-[560px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{project ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in project details and upload your document or image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. AI Based Health Assistant"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="abstractText">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="abstractText"
              placeholder="Describe your project briefly..."
              value={formData.abstractText}
              onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
              disabled={loading}
              className="min-h-[80px]"
            />
          </div>

          {/* ========== FILE UPLOAD ZONE ========== */}
          <div className="space-y-2">
            <Label htmlFor="projectFileUpload">Upload Document / Image</Label>

            {!selectedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200  ${
                  dragActive
                    ? "border-[#6D8BFF] bg-blue-50/60 dark:bg-blue-900/20 scale-[1.01]"
                    : "border-slate-300 dark:border-slate-700 hover:border-[#8FD3FF] hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  id="projectFileUpload"
                  name="projectFileUpload"
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
                <div className="flex flex-col items-center gap-2">
                  <div style={{ padding: 12, background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))', borderRadius: 12 }}>
                    <Upload style={{ width: 28, height: 28, color: '#7C3AED' }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Drag & drop your file here, or <span className="text-[#6D8BFF] font-semibold">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, Word, PNG, JPG — up to 20MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    {getFileIcon(selectedFile)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  {!loading && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="coverImageURL">Course Photo URL</Label>
            <Input
              id="coverImageURL"
              placeholder="https://example.com/image.jpg"
              value={formData.coverImageURL}
              onChange={(e) => setFormData({ ...formData, coverImageURL: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Tech Stack + Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                placeholder="React, Spring Boot, MySQL"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="AI, Healthcare, WebApp"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Repo Link */}
          <div className="space-y-2">
            <Label htmlFor="repoLink">Repository Link</Label>
            <Input
              id="repoLink"
              type="text"
              placeholder="https://github.com/..."
              value={formData.repoLink}
              onChange={(e) => setFormData({ ...formData, repoLink: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* ========== PROGRESS BAR ========== */}
          {loading && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  {uploadPhase === "done" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', color: '#7C3AED' }} />
                  )}
                  {getProgressLabel()}
                </span>
                <span style={{ fontWeight: 600, color: '#7C3AED' }}>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2.5" />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { resetForm(); onOpenChange(false); }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-white border-0 min-w-[140px]"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadPhase === "uploading" ? "Uploading..." : "Creating..."}
                </span>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
