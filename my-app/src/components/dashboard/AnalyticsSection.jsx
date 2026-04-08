import { useState, useEffect } from "react"
import { GlassCard } from "../ui/glass-card"
import { BarChart3, FolderOpen, Target, CheckCircle, Users } from "lucide-react"
import { projectAPI, userAPI, transformProject, transformUser } from "../../services/api"

export function AnalyticsSection() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const projectsData = await projectAPI.getAll()
        const projects = projectsData.map(transformProject)
        const usersData = await userAPI.getAll()
        const students = usersData.filter(u => u.role === "student")

        const totalProjects = projects.length
        const publishedProjects = projects.filter(p => p.published).length
        const totalStudents = students.length
        const avgCompletion = totalProjects > 0
          ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects)
          : 0

        setStats([
          {
            title: "Total Projects",
            value: totalProjects,
            icon: FolderOpen,
            gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)"
          },
          {
            title: "Published Projects",
            value: publishedProjects,
            icon: BarChart3,
            gradient: "linear-gradient(135deg, #EC4899, #F472B6)"
          },
          {
            title: "Average Completion",
            value: `${avgCompletion}%`,
            icon: Target,
            gradient: "linear-gradient(135deg, #10B981, #059669)"
          },
          {
            title: "Total Students",
            value: totalStudents,
            icon: Users,
            gradient: "linear-gradient(135deg, #8B5CF6, #6366F1)"
          }
        ])
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <div style={{ animation: 'spin 1s linear infinite', width: 32, height: 32, border: '4px solid #7C3AED', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px' }}></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <GlassCard key={index}>
              <div className="p-6 flex items-center space-x-4">
                <div
                  style={{ padding: 12, background: stat.gradient, borderRadius: 12 }}
                >
                  <Icon style={{ width: 24, height: 24, color: '#fff' }} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
