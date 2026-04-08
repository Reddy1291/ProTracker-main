import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Share2,
  Eye,
  Calendar,
  Tag,
  MessageSquare,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Textarea } from "../ui/textarea"
import { GlassCard } from "../ui/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { userAPI, milestoneAPI, feedbackAPI, assignmentAPI, transformUser, transformMilestone, transformFeedback } from "../../services/api"
import { CreateMilestoneModal } from "./CreateMilestoneModal"
import { useAuth } from "../../hooks/useAuth"
import { ImageWithFallback } from "../figma/ImageWithFallback"
import { toast } from "sonner"

export function ProjectDetail({ project, onBack, onEdit }) {
  const { user } = useAuth()
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  const [owner, setOwner] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [feedback, setFeedback] = useState([])
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [isAssignedMentor, setIsAssignedMentor] = useState(false)

  const isOwner = user?.id === project.ownerId
  const isFacultyOrAdmin = user?.role === "faculty" || user?.role === "admin"
  const canGiveFeedback = isFacultyOrAdmin && isAssignedMentor

  const fetchDetails = async () => {
    try {
      if (project.ownerId) {
        const ownerData = await userAPI.getById(project.ownerId)
        setOwner(transformUser(ownerData))
      }
      const msData = await milestoneAPI.getByProject(project.id)
      setMilestones(msData.map(transformMilestone))

      const fbData = await feedbackAPI.getByProject(project.id)
      setFeedback(fbData.map(transformFeedback))

      // Check faculty assignment
      if (user && (user.role === 'faculty' || user.role === 'admin') && project.ownerId) {
        try {
          const assignCheck = await assignmentAPI.checkAssignment(user.id, project.ownerId)
          setIsAssignedMentor(assignCheck.assigned)
        } catch (e) {
          setIsAssignedMentor(false)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [project.id])

  const completedMilestones = milestones.filter(m => m.status === "completed")
  const progressPercentage =
    milestones.length > 0
      ? (completedMilestones.length / milestones.length) * 100
      : 0

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim() || !canGiveFeedback) return

    setIsSubmittingFeedback(true)

    try {
      await feedbackAPI.create({
        content: feedbackText,
        type: "general",
        status: "open",
        rating: 5,
        authorId: user.id
      }, project.id)

      toast.success("Feedback submitted successfully!")
      setFeedbackText("")
      fetchDetails() // Reload feedback
    } catch (e) {
      const errorMsg = e.response?.data?.message || "Failed to submit feedback"
      toast.error(errorMsg)
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const handleIncreaseMilestoneProgress = async (milestone) => {
    let newPercent = milestone.percentComplete + 25
    let newStatus = milestone.status
    if (newPercent >= 100) {
      newPercent = 100
      newStatus = "completed"
    } else if (newPercent > 0) {
      newStatus = "in-progress"
    }

    try {
      await milestoneAPI.update(milestone.id, {
        ...milestone,
        percentComplete: newPercent,
        status: newStatus
      })
      fetchDetails()
      toast.success("Progress updated!")
    } catch (e) {
      toast.error("Failed to update progress")
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Project link copied to clipboard!")
  }

  const getStatusIcon = status => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "review":
        return <Eye className="w-4 h-4 text-orange-500" />
      case "planned":
        return <AlertCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "review":
        return "bg-orange-100 text-orange-700"
      case "planned":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleShare}
                className="border-white/20 hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              {project.repoLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(project.repoLink, "_blank")}
                  className="border-white/20 hover:bg-white/20"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Code
                </Button>
              )}

              {project.demoLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(project.demoLink, "_blank")}
                  className="border-white/20 hover:bg-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Demo
                </Button>
              )}

              {project.documentURL && (
                <Button
                  variant="outline"
                  onClick={() => window.open(project.documentURL, "_blank")}
                  className="border-white/20 text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Document
                </Button>
              )}

              {isOwner && onEdit && (
                <Button
                  onClick={onEdit}
                  className="text-white border-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}
                >
                  Edit Project
                </Button>
              )}
            </div>
          </div>

          {/* Project Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image */}
            <div className="lg:col-span-1">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={project.coverImageURL}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    className={
                      project.visibility === "public"
                        ? "bg-green-100 text-green-700"
                        : project.visibility === "mentor-only"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }
                  >
                    {project.visibility.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

              {/* Owner & Metadata */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={owner?.avatarURL || undefined} alt={owner?.name} />
                    <AvatarFallback>
                      {owner?.name
                        ?.split(" ")
                        .map(n => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{owner?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {owner?.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>

                {project.published && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="w-4 h-4 mr-2" />
                    {Math.floor(Math.random() * 500) + 100} views
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Project Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Abstract */}
              <p className="text-muted-foreground leading-relaxed">
                {project.abstract}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <GlassCard>
          <div className="p-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
          </div>
        </GlassCard>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Project Details
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="space-y-2">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="border-white/20"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div>
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        className={
                          project.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {project.published ? "Published" : "Draft"}
                      </Badge>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Milestones</span>
                      <span className="font-medium">
                        {completedMilestones.length}/{milestones.length}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Feedback</span>
                      <span className="font-medium">{feedback.length}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Milestones</h3>
                {(isOwner || canGiveFeedback) && (
                  <Button
                    variant="outline"
                    className="border-white/20 hover:bg-white/20"
                    onClick={() => setShowMilestoneModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {canGiveFeedback ? "Assign Task" : "Add Milestone"}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="flex items-start space-x-4 p-4 bg-white/30 rounded-xl"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
                      {getStatusIcon(milestone.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.replace("-", " ")}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {milestone.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                        <span className="font-medium">
                          {milestone.percentComplete}% complete
                        </span>
                      </div>

                      {milestone.percentComplete > 0 &&
                        milestone.percentComplete < 100 && (
                          <Progress
                            value={milestone.percentComplete}
                            className="h-2 mt-2"
                          />
                        )}

                      {isOwner && milestone.status !== "completed" && (
                        <div className="mt-4">
                          <Button 
                            size="sm" 
                            onClick={() => handleIncreaseMilestoneProgress(milestone)}
                            className="bg-green-500 hover:bg-green-600 text-white border-0"
                          >
                            Mark Task Done (+25% Progress)
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="media">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Media Gallery</h3>

              {project.media.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.media.map((mediaUrl, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-xl overflow-hidden"
                    >
                      <ImageWithFallback
                        src={mediaUrl}
                        alt={`${project.title} media ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No media uploaded yet</p>
                  {isOwner && (
                    <Button
                      variant="outline"
                      className="mt-4 border-white/20 hover:bg-white/20"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Media
                    </Button>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="feedback">
          <div className="space-y-6">
            {/* Feedback Form / Assignment Check */}
            {canGiveFeedback ? (
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Leave Feedback</h3>

                  <div className="space-y-4">
                    <Textarea
                      placeholder="Share your thoughts, suggestions, or ask questions..."
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      className="min-h-[100px] bg-white/50 border-white/20 backdrop-blur-sm"
                    />

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitFeedback}
                        disabled={!feedbackText.trim() || isSubmittingFeedback}
                        className="text-white border-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}
                      >
                        {isSubmittingFeedback ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ) : isFacultyOrAdmin ? (
              <GlassCard>
                <div className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">Mentor Access Required</h3>
                  <p className="text-muted-foreground">
                    You must be assigned as a mentor to this student to provide feedback on their project.
                  </p>
                </div>
              </GlassCard>
            ) : null}

            {/* Existing Feedback */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">
                  Feedback & Comments
                </h3>

                {feedback.length > 0 ? (
                  <div className="space-y-6">
                    {feedback.map(item => {
                      return (
                        <FeedbackItem key={item.id} item={item} isOwner={isOwner} />
                      )
                    })}
                  </div>

                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No feedback yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Assigned faculty mentors can leave feedback to help improve this
                      project
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>

      <CreateMilestoneModal
        open={showMilestoneModal}
        onOpenChange={setShowMilestoneModal}
        projectId={project.id}
        onSuccess={fetchDetails}
      />
    </div>
  )
}

function FeedbackItem({ item, isOwner }) {
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    import("../../services/api").then(({ userAPI, transformUser }) => {
      userAPI.getById(item.authorId).then(data => setAuthor(transformUser(data))).catch(console.error)
    })
  }, [item.authorId])

  return (
    <div key={item.id} className="flex space-x-4">
      <Avatar>
        <AvatarImage src={author?.avatarURL || undefined} alt={author?.name} />
        <AvatarFallback>
          {author?.name?.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-3">
          <span className="font-medium">{author?.name}</span>
          <Badge variant="secondary">{author?.role}</Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(item.timestamp).toLocaleDateString()}
          </span>
          {item.rating && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-1">Rating:</span>
              <span className="text-sm font-medium">{item.rating}/5</span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {item.content}
        </p>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-xs hover:bg-white/20">Reply</Button>
          {item.status === "open" && isOwner && (
            <Button variant="ghost" size="sm" className="text-xs hover:bg-white/20">Mark as Resolved</Button>
          )}
        </div>
      </div>
    </div>
  )
}
