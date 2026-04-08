import { useState, useEffect } from "react"
import { GlassCard } from "../ui/glass-card"
import { Target, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { CreateMilestoneModal } from "../projects/CreateMilestoneModal"
import { projectAPI } from "../../services/api"

export function MilestonesSection({ projects, onViewProject }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  const handleAddMilestone = (projectId) => {
    setSelectedProjectId(projectId)
    setShowModal(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Milestones</h1>
      </div>

      {!projects || projects.length === 0 ? (
        <GlassCard>
          <div className="p-8 flex flex-col items-center text-center">
            <Target className="w-10 h-10 text-purple-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No projects found</h2>
            <p className="text-muted-foreground mb-4">
              Create a project first to add milestones.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <GlassCard key={project.id}>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {project.abstract?.substring(0, 100)}...
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => onViewProject(project)}>
                    View Milestones
                  </Button>
                  <Button 
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}
                    onClick={() => handleAddMilestone(project.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Milestone
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {selectedProjectId && (
        <CreateMilestoneModal
          open={showModal}
          onOpenChange={(open) => {
            setShowModal(open)
            if (!open) setSelectedProjectId(null)
          }}
          projectId={selectedProjectId}
          onSuccess={() => {
            setShowModal(false)
            setSelectedProjectId(null)
          }}
        />
      )}
    </div>
  )
}
