import { useState, useEffect } from "react"
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  GraduationCap,
  Loader2,
  FolderOpen,
  Mail,
} from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { GlassCard } from "../ui/glass-card"
import { useAuth } from "../../hooks/useAuth"
import { useTheme } from "../../hooks/useTheme"
import { assignmentAPI, transformAssignment, projectAPI, transformProject } from "../../services/api"
import { toast } from "sonner"

export function MenteesSection({ onViewProject }) {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [menteeProjects, setMenteeProjects] = useState({})

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await assignmentAPI.getByFaculty(user.id)
      const transformed = data.map(transformAssignment)
      setAssignments(transformed)

      // Fetch projects for accepted mentees
      const accepted = transformed.filter(a => a.status === "ACCEPTED")
      const projectsMap = {}
      for (const a of accepted) {
        try {
          const projects = await projectAPI.getByOwner(a.studentId)
          projectsMap[a.studentId] = projects.map(transformProject)
        } catch (e) {
          projectsMap[a.studentId] = []
        }
      }
      setMenteeProjects(projectsMap)
    } catch (error) {
      console.error("Error fetching mentees:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const pendingRequests = assignments.filter(a => a.status === "PENDING")
  const acceptedMentees = assignments.filter(a => a.status === "ACCEPTED")
  const rejectedRequests = assignments.filter(a => a.status === "REJECTED")

  const handleAccept = async (assignmentId) => {
    setActionLoading(assignmentId)
    try {
      const response = await assignmentAPI.accept(assignmentId)
      if (response.success) {
        toast.success("Student accepted as mentee!")
        fetchData()
      }
    } catch (error) {
      toast.error("Failed to accept request")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (assignmentId) => {
    setActionLoading(assignmentId)
    try {
      const response = await assignmentAPI.reject(assignmentId)
      if (response.success) {
        toast.success("Request declined")
        fetchData()
      }
    } catch (error) {
      toast.error("Failed to reject request")
    } finally {
      setActionLoading(null)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <div style={{ animation: 'spin 1s linear infinite', width: 32, height: 32, border: '4px solid #7C3AED', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px' }}></div>
          <p className="text-muted-foreground">Loading mentee requests...</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard>
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Mentees</h1>
              <p className="text-muted-foreground">
                Manage student mentorship requests and track your mentees
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center px-4 py-2 rounded-xl" style={{
                background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
              }}>
                <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>{pendingRequests.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl" style={{
                background: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}>
                <p className="text-2xl font-bold" style={{ color: '#22C55E' }}>{acceptedMentees.length}</p>
                <p className="text-xs text-muted-foreground">Mentees</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock style={{ width: 20, height: 20, color: '#F59E0B' }} />
              <h3 className="text-xl font-semibold">Pending Requests</h3>
              <Badge className="bg-yellow-100 text-yellow-700">{pendingRequests.length} new</Badge>
            </div>

            <div className="space-y-4">
              {pendingRequests.map(req => (
                <div key={req.id} className="flex items-center gap-4 p-5 rounded-xl" style={{
                  background: isDark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.04)',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}>
                  <img
                    src={req.studentAvatarURL || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                    alt={req.studentName}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: '3px solid rgba(245,158,11,0.3)' }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{req.studentName}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail style={{ width: 13, height: 13 }} />
                        {req.studentEmail}
                      </span>
                      {req.studentDepartment && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 style={{ width: 13, height: 13 }} />
                          {req.studentDepartment}
                        </span>
                      )}
                      {req.studentYear && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <GraduationCap style={{ width: 13, height: 13 }} />
                          {req.studentYear}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Requested {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={actionLoading === req.id}
                      onClick={() => handleAccept(req.id)}
                      style={{
                        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                      }}
                    >
                      {actionLoading === req.id ? (
                        <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <UserCheck style={{ width: 14, height: 14, marginRight: 4 }} />
                          Accept
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading === req.id}
                      onClick={() => handleReject(req.id)}
                      style={{
                        borderColor: 'rgba(239,68,68,0.3)',
                        color: '#EF4444',
                      }}
                    >
                      <UserX style={{ width: 14, height: 14, marginRight: 4 }} />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Accepted Mentees */}
      <GlassCard>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users style={{ width: 20, height: 20, color: '#22C55E' }} />
            <h3 className="text-xl font-semibold">My Mentees</h3>
            <Badge className="bg-green-100 text-green-700">{acceptedMentees.length}</Badge>
          </div>

          {acceptedMentees.length > 0 ? (
            <div className="space-y-4">
              {acceptedMentees.map(mentee => {
                const projects = menteeProjects[mentee.studentId] || []
                return (
                  <div key={mentee.id} className="p-5 rounded-xl" style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(124,58,237,0.08)',
                  }}>
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={mentee.studentAvatarURL || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                        alt={mentee.studentName}
                        className="w-12 h-12 rounded-full object-cover"
                        style={{ border: '2px solid rgba(34,197,94,0.3)' }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{mentee.studentName}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {mentee.studentDepartment && (
                            <span className="flex items-center gap-1">
                              <Building2 style={{ width: 12, height: 12 }} />
                              {mentee.studentDepartment}
                            </span>
                          )}
                          {mentee.studentYear && (
                            <span className="flex items-center gap-1">
                              <GraduationCap style={{ width: 12, height: 12 }} />
                              {mentee.studentYear}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle style={{ width: 12, height: 12, marginRight: 4 }} />
                        Mentee
                      </Badge>
                    </div>

                    {/* Mentee's Projects */}
                    {projects.length > 0 ? (
                      <div className="mt-3 pt-3" style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <FolderOpen style={{ width: 12, height: 12 }} />
                          {projects.length} Project{projects.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {projects.map(p => (
                            <button
                              key={p.id}
                              onClick={() => onViewProject && onViewProject(p)}
                              className="text-xs px-3 py-1.5 rounded-lg transition-all"
                              style={{
                                background: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)',
                                border: '1px solid rgba(124,58,237,0.15)',
                                color: isDark ? '#C4B5FD' : '#7C3AED',
                                cursor: 'pointer',
                              }}
                            >
                              {p.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">No projects yet</p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users style={{ width: 48, height: 48, margin: '0 auto 16px', color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(26,16,64,0.2)' }} />
              <p className="text-muted-foreground">No mentees assigned yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Students will appear here once they request mentorship and you accept
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Rejected History */}
      {rejectedRequests.length > 0 && (
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle style={{ width: 18, height: 18, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(26,16,64,0.3)' }} />
              <h3 className="text-lg font-semibold text-muted-foreground">Declined Requests</h3>
            </div>
            <div className="space-y-2">
              {rejectedRequests.map(req => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg opacity-60">
                  <img
                    src={req.studentAvatarURL || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                    alt={req.studentName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm">{req.studentName}</span>
                  <span className="text-xs text-muted-foreground">{req.studentDepartment} • {req.studentYear}</span>
                  <Badge variant="secondary" className="text-xs ml-auto">Declined</Badge>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
