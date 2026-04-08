import { useState, useEffect } from "react"
import { Calendar, ExternalLink, Github, Eye, Tag, FileText } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { GlassCard } from "../ui/glass-card"
import { userAPI, transformUser } from "../../services/api"
import { ImageWithFallback } from "../figma/ImageWithFallback"

export function ProjectCard({ project, onViewProject, showOwner = false }) {
  const [owner, setOwner] = useState(null)

  useEffect(() => {
    if (showOwner && project.ownerId) {
      userAPI.getById(project.ownerId)
        .then(data => setOwner(transformUser(data)))
        .catch(() => setOwner(null))
    }
  }, [showOwner, project.ownerId])

  const handleView = () => {
    onViewProject?.(project)
  }

  const getStatusColor = visibility => {
    switch (visibility) {
      case "public":
        return "bg-green-100 text-green-700"
      case "mentor-only":
        return "bg-yellow-100 text-yellow-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <GlassCard
      className="group hover:scale-[1.02] transition-all duration-200 cursor-pointer"
      onClick={handleView}
    >
      <div className="p-0">
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <ImageWithFallback
            src={project.coverImageURL}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(project.visibility)}>
              {project.visibility.replace("-", " ")}
            </Badge>
          </div>
          {project.progress < 100 && (
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Owner */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
              {project.title}
            </h3>
            {showOwner && owner && (
              <p className="text-sm text-muted-foreground">by {owner.name}</p>
            )}
          </div>

          {/* Abstract */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {project.abstract}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(project.updatedAt).toLocaleDateString()}
            </div>
            {project.published && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {Math.floor(Math.random() * 100) + 50} views
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 text-white border-0"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                color: '#fff',
                border: 'none',
              }}
              onClick={e => {
                e.stopPropagation()
                handleView()
              }}
            >
              View Project
            </Button>
            {project.repoLink && (
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 hover:bg-white/20"
                onClick={e => {
                  e.stopPropagation()
                  window.open(project.repoLink, "_blank")
                }}
              >
                <Github className="w-4 h-4" />
              </Button>
            )}
            {project.demoLink && (
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 hover:bg-white/20"
                onClick={e => {
                  e.stopPropagation()
                  window.open(project.demoLink, "_blank")
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
            {project.documentURL && (
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 hover:bg-white/20 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400"
                onClick={e => {
                  e.stopPropagation()
                  window.open(project.documentURL, "_blank")
                }}
              >
                <FileText className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
