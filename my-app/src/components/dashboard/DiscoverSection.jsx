import { useState, useEffect } from "react"
import { GlassCard } from "../ui/glass-card"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { ProjectCard } from "../projects/ProjectCard"
import { projectAPI, transformProject } from "../../services/api"

export function DiscoverSection({ searchQuery = "", onViewProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const data = await projectAPI.getPublished()
        setProjects(data.map(transformProject))
      } catch (error) {
        console.error("Error fetching published projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPublished()
  }, [])

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Discover Projects</h1>

      {loading ? (
        <GlassCard>
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#6D8BFF] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </GlassCard>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} showOwner={true} onViewProject={onViewProject} />
          ))}
        </div>
      ) : (
        <GlassCard>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No projects match your search." : "No published projects yet. Be the first to publish!"}
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
