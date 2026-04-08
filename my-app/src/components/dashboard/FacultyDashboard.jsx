import { useState, useEffect } from "react"
import {
  Users,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import { GlassCard } from "../ui/glass-card"
import { ProjectCard } from "../projects/ProjectCard"
import { useAuth } from "../../hooks/useAuth"
import {
  projectAPI,
  userAPI,
  feedbackAPI,
  transformProject,
  transformUser,
} from "../../services/api"

import { toast } from "sonner"

export function FacultyDashboard({ onViewProject, onTabChange }) {
  const { user } = useAuth()
  const [allProjects, setAllProjects] = useState([])
  const [students, setStudents] = useState([])
  const [totalFeedback, setTotalFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch all projects
        const projectsData = await projectAPI.getAll()
        setAllProjects(projectsData.map(transformProject))

        // Fetch all users and filter students
        const usersData = await userAPI.getAll()
        setStudents(usersData.filter(u => u.role === "student").map(transformUser))

        // Fetch feedback given by this faculty
        try {
          const fb = await feedbackAPI.getByAuthor(user.id)
          setTotalFeedback(fb)
        } catch (e) { /* no feedback yet */ }
      } catch (error) {
        console.error("Error fetching faculty dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (!user) return null

  const pendingReviews = allProjects.filter(
    p => p.visibility === "mentor-only" && !p.published
  )

  const studentProgress = students.map(student => {
    const studentProjects = allProjects.filter(p => p.ownerId === student.id)
    const avgProgress =
      studentProjects.length > 0
        ? studentProjects.reduce((acc, p) => acc + (p.progress || 0), 0) /
          studentProjects.length
        : 0

    return {
      student,
      projectCount: studentProjects.length,
      avgProgress: Math.round(avgProgress),
      needsAttention: avgProgress < 50
    }
  })

  const recentActivity = [
    {
      type: "submission",
      message: "New project submitted for review",
      time: "Recently",
      urgent: false
    },
    {
      type: "milestone",
      message: "Student completed a milestone",
      time: "Recently",
      urgent: false
    },
    {
      type: "overdue",
      message: "Project deadline approaching",
      time: "Recently",
      urgent: true
    }
  ]

  if (loading) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <div style={{ animation: 'spin 1s linear infinite', width: 32, height: 32, border: '4px solid #7C3AED', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px' }}></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <GlassCard>
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor student progress and provide guidance
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/20"
                onClick={() => onTabChange && onTabChange('projects')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Review Queue
              </Button>
              <Button 
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                }}
                onClick={() => {
                  toast.success("Bulk Feedback form will open!")
                  if (onTabChange) onTabChange('students')
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Bulk Feedback
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', borderRadius: 12 }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 12 }}>
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{allProjects.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: 12 }}>
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">{pendingReviews.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', borderRadius: 12 }}>
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Feedback Given</p>
                <p className="text-2xl font-bold">{totalFeedback.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Student Progress</h3>
                <Button variant="ghost" size="sm" onClick={() => onTabChange && onTabChange('analytics')}>
                  Export Report
                </Button>
              </div>

              <div className="space-y-4">
                {studentProgress.length > 0 ? studentProgress.map(item => (
                  <div
                    key={item.student.id}
                    className="flex items-center justify-between p-4 bg-white/30 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.student.avatarURL}
                        alt={item.student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.projectCount} projects
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right min-w-[100px]">
                        <p className="text-sm font-medium">
                          {item.avgProgress}% complete
                        </p>
                        <Progress
                          value={item.avgProgress}
                          className="w-20 h-2 mt-1"
                        />
                      </div>

                      {item.needsAttention && (
                        <Badge variant="destructive" className="text-xs">
                          Needs Attention
                        </Badge>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 hover:bg-white/20"
                        onClick={() => {
                          const project = allProjects.find(p => p.ownerId === item.student.id)
                          if (project) {
                            onViewProject(project)
                          } else {
                            toast.error("No project found for this student")
                          }
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-4">No students registered yet</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <Button variant="ghost" size="sm" onClick={() => toast.info("Showing all recent activity")}>
                  View all
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-4 p-4 rounded-xl ${
                      activity.urgent ? "bg-red-50" : "bg-white/30"
                    }`}
                  >
                    {activity.type === "submission" ? (
                        <div style={{ padding: 8, background: activity.urgent ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: 8 }}>
                          <FolderOpen style={{ width: 16, height: 16, color: activity.urgent ? '#DC2626' : '#fff' }} />
                        </div>
                      ) : activity.type === "milestone" ? (
                        <div style={{ padding: 8, background: activity.urgent ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: 8 }}>
                          <CheckCircle style={{ width: 16, height: 16, color: activity.urgent ? '#DC2626' : '#fff' }} />
                        </div>
                      ) : (
                        <div style={{ padding: 8, background: activity.urgent ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: 8 }}>
                          <AlertCircle style={{ width: 16, height: 16, color: activity.urgent ? '#DC2626' : '#fff' }} />
                        </div>
                      )}
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                    {activity.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Review Queue & Quick Actions */}
        <div className="space-y-6">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Review Queue</h3>

              <div className="space-y-3">
                {pendingReviews.length > 0 ? pendingReviews.slice(0, 3).map(project => {
                  const owner = students.find(s => s.id === project.ownerId)
                  return (
                    <div
                      key={project.id}
                      className="p-3 bg-white/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm line-clamp-1">
                          {project.title}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          Review
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        by {owner?.name || 'Unknown'}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-6 px-2 border-white/20"
                          onClick={() => onViewProject(project)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  )
                }) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No pending reviews</p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-white/20 hover:bg-white/20"
                onClick={() => onTabChange && onTabChange('projects')}
              >
                View All Reviews
              </Button>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 hover:bg-white/20"
                  onClick={() => toast.success("Bulk Feedback tool activated")}
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Bulk Feedback
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 hover:bg-white/20"
                  onClick={() => onTabChange && onTabChange('analytics')}
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Progress Report
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 hover:bg-white/20"
                  onClick={() => toast.success("Schedule UI loaded")}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Schedule Review
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start border-white/20 hover:bg-white/20"
                  onClick={() => onTabChange && onTabChange('students')}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Manage Students
                </Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Department Stats</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {allProjects.length > 0 ? Math.round(allProjects.reduce((a, p) => a + (p.progress || 0), 0) / allProjects.length) : 0}%
                    </span>
                  </div>
                  <Progress value={allProjects.length > 0 ? Math.round(allProjects.reduce((a, p) => a + (p.progress || 0), 0) / allProjects.length) : 0} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Published</span>
                    <span className="text-sm text-muted-foreground">
                      {allProjects.length > 0 ? Math.round(allProjects.filter(p => p.published).length / allProjects.length * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={allProjects.length > 0 ? Math.round(allProjects.filter(p => p.published).length / allProjects.length * 100) : 0} className="h-3" />
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {allProjects.filter(p => p.progress >= 80).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Near Complete</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {allProjects.filter(p => p.progress < 50).length}
                      </p>
                      <p className="text-xs text-muted-foreground">At Risk</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Student Projects</h2>
          <Button variant="ghost" onClick={() => onTabChange && onTabChange('projects')}>View all projects</Button>
        </div>

        {allProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.slice(0, 6).map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewProject={onViewProject}
                showOwner={true}
              />
            ))}
          </div>
        ) : (
          <GlassCard>
            <div className="p-8 text-center">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">No student projects have been created yet.</p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
