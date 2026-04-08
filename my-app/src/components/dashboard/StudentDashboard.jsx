import { useState, useEffect } from "react"
import {
  BarChart3,
  FolderOpen,
  Target,
  Users,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { GlassCard } from "../ui/glass-card"
import { ProjectCard } from "../projects/ProjectCard"
import { useAuth } from "../../hooks/useAuth"
import {
  projectAPI,
  milestoneAPI,
  feedbackAPI,
  transformProject,
  transformMilestone,
} from "../../services/api"

export function StudentDashboard({ onCreateProject, onViewProject }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [milestones, setMilestones] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch user's projects
        const projectsData = await projectAPI.getByOwner(user.id)
        const transformedProjects = projectsData.map(transformProject)
        setProjects(transformedProjects)

        // Fetch milestones and feedback for all projects
        const allMilestones = []
        const allFeedbacks = []
        for (const proj of projectsData) {
          try {
            const ms = await milestoneAPI.getByProject(proj.id)
            allMilestones.push(...ms.map(transformMilestone))
          } catch (e) { /* no milestones yet */ }
          try {
            const fb = await feedbackAPI.getByProject(proj.id)
            allFeedbacks.push(...fb)
          } catch (e) { /* no feedback yet */ }
        }
        setMilestones(allMilestones)
        setFeedbacks(allFeedbacks)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (!user) return null

  const publishedProjects = projects.filter(p => p.published)
  const completedMilestones = milestones.filter(m => m.status === "completed")
  const pendingFeedback = feedbacks.filter(f => f.status === "open")

  const avgCompletion =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length
        )
      : 0

  const recentActivity = [
    {
      type: "milestone",
      message: 'Completed milestone',
      time: "Recently",
      project: projects[0]?.title || "Your Project"
    },
    {
      type: "feedback",
      message: "Received feedback from faculty",
      time: "Recently",
      project: projects[0]?.title || "Your Project"
    },
    {
      type: "upload",
      message: "Project updated",
      time: "Recently",
      project: projects.length > 1 ? projects[1]?.title : "Your Project"
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
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name.split(" ")[0]}! 
              </h1>
              <p className="text-muted-foreground">
                Ready to work on your projects today?
              </p>
            </div>
            <Button
              onClick={onCreateProject}
              size="lg"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Project
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', borderRadius: 12 }}>
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #EC4899, #F472B6)', borderRadius: 12 }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{publishedProjects.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 12 }}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Completion</p>
                <p className="text-2xl font-bold">{avgCompletion}%</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div style={{ padding: 12, background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: 12 }}>
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Feedback
                </p>
                <p className="text-2xl font-bold">{pendingFeedback.length}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white/30 rounded-xl"
                  >
                    <div style={{ padding: 8, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: 8 }}>
                      {activity.type === "milestone" && (
                        <Target className="w-4 h-4 text-white" />
                      )}
                      {activity.type === "feedback" && (
                        <BarChart3 className="w-4 h-4 text-white" />
                      )}
                      {activity.type === "upload" && (
                        <FolderOpen className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.project}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 border-white/20 hover:bg-white/20"
                  onClick={onCreateProject}
                >
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">New Project</p>
                    <p className="text-xs text-muted-foreground">
                      Start something new
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 border-white/20 hover:bg-white/20"
                >
                  <div className="text-center">
                    <Target className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Add Milestone</p>
                    <p className="text-xs text-muted-foreground">
                      Track progress
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Progress Overview */}
        <div className="space-y-6">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Progress Overview</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Overall Completion
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {avgCompletion}%
                    </span>
                  </div>
                  <Progress value={avgCompletion} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Milestones</span>
                    <span className="text-sm text-muted-foreground">
                      {completedMilestones.length}/{milestones.length}
                    </span>
                  </div>
                  <Progress
                    value={
                      milestones.length > 0
                        ? (completedMilestones.length /
                            milestones.length) *
                          100
                        : 0
                    }
                    className="h-3"
                  />
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Completed Tasks
                    </div>
                    <span className="font-medium">
                      {completedMilestones.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>

              <div className="space-y-3">
                {milestones.filter(m => m.status !== 'completed').length > 0 ? (
                  milestones.filter(m => m.status !== 'completed').slice(0, 2).map((milestone, index) => (
                    <div key={milestone.id} className={`flex items-center justify-between p-3 ${index === 0 ? 'bg-yellow-50' : 'bg-blue-50'} rounded-lg`}>
                      <div>
                        <p className="font-medium text-sm">{milestone.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {milestone.dueDate || 'TBD'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs ${index === 0 ? 'text-yellow-600' : 'text-blue-600'} font-medium`}>
                          {milestone.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
          <Button variant="ghost">View all projects</Button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewProject={onViewProject}
              />
            ))}
          </div>
        ) : (
          <GlassCard>
            <div className="p-8 text-center">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first project to get started!</p>
              <Button onClick={onCreateProject} style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}>
                <Plus className="w-4 h-4 mr-2" /> Create Project
              </Button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
