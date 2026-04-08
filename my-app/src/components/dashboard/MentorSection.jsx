import { useState, useEffect } from "react"
import {
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  GraduationCap,
  Mail,
  Building2,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { GlassCard } from "../ui/glass-card"
import { useAuth } from "../../hooks/useAuth"
import { useTheme } from "../../hooks/useTheme"
import { assignmentAPI, transformAssignment, transformUser } from "../../services/api"
import { toast } from "sonner"

export function MentorSection() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [facultyList, setFacultyList] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)
      const [faculty, studentAssignments] = await Promise.all([
        assignmentAPI.getFacultyList(),
        assignmentAPI.getByStudent(user.id),
      ])
      setFacultyList(faculty.map(transformUser))
      setAssignments(studentAssignments.map(transformAssignment))
    } catch (error) {
      console.error("Error fetching mentor data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const acceptedMentor = assignments.find(a => a.status === "ACCEPTED")
  const pendingRequests = assignments.filter(a => a.status === "PENDING")
  const rejectedRequests = assignments.filter(a => a.status === "REJECTED")

  const handleRequestMentor = async (facultyId) => {
    setRequesting(facultyId)
    try {
      const response = await assignmentAPI.requestMentor(user.id, facultyId)
      if (response.success) {
        toast.success("Mentor request sent!")
        fetchData()
      } else {
        toast.error(response.message || "Failed to send request")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request. You may already have a pending request.")
    } finally {
      setRequesting(null)
    }
  }

  const filteredFaculty = facultyList.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.department || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRequestStatus = (facultyId) => {
    const assignment = assignments.find(a => a.facultyId === facultyId)
    return assignment ? assignment.status : null
  }

  if (!user) return null

  if (loading) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <div style={{ animation: 'spin 1s linear infinite', width: 32, height: 32, border: '4px solid #7C3AED', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px' }}></div>
          <p className="text-muted-foreground">Loading mentor info...</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">My Mentor</h1>
          <p className="text-muted-foreground">
            Request a faculty mentor for guidance on your projects
          </p>
        </div>
      </GlassCard>

      {/* Current Mentor */}
      {acceptedMentor ? (
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck style={{ width: 20, height: 20, color: '#22C55E' }} />
              <h3 className="text-xl font-semibold">Assigned Mentor</h3>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <div className="flex items-center gap-6 p-5 rounded-xl" style={{
              background: isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
            }}>
              <img
                src={acceptedMentor.facultyAvatarURL || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                alt={acceptedMentor.facultyName}
                className="w-16 h-16 rounded-full object-cover"
                style={{ border: '3px solid rgba(34,197,94,0.3)' }}
              />
              <div className="flex-1">
                <p className="text-lg font-semibold">{acceptedMentor.facultyName}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail style={{ width: 14, height: 14 }} />
                    {acceptedMentor.facultyEmail}
                  </span>
                  {acceptedMentor.facultyDepartment && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 style={{ width: 14, height: 14 }} />
                      {acceptedMentor.facultyDepartment}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Assigned since {acceptedMentor.respondedAt ? new Date(acceptedMentor.respondedAt).toLocaleDateString() : 'recently'}
                </p>
              </div>
              <CheckCircle style={{ width: 28, height: 28, color: '#22C55E' }} />
            </div>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <GlassCard>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock style={{ width: 20, height: 20, color: '#F59E0B' }} />
                  <h3 className="text-xl font-semibold">Pending Requests</h3>
                  <Badge className="bg-yellow-100 text-yellow-700">{pendingRequests.length}</Badge>
                </div>
                <div className="space-y-3">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="flex items-center gap-4 p-4 rounded-xl" style={{
                      background: isDark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.05)',
                      border: '1px solid rgba(245,158,11,0.15)',
                    }}>
                      <img
                        src={req.facultyAvatarURL || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
                        alt={req.facultyName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{req.facultyName}</p>
                        <p className="text-sm text-muted-foreground">{req.facultyDepartment}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <Clock style={{ width: 12, height: 12, marginRight: 4 }} />
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {/* Browse Faculty */}
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <GraduationCap style={{ width: 20, height: 20, color: '#7C3AED' }} />
                  <h3 className="text-xl font-semibold">Available Faculty</h3>
                </div>
                <div style={{ position: 'relative', width: 240 }}>
                  <Search style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    width: 16, height: 16, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,16,64,0.4)'
                  }} />
                  <input
                    type="text"
                    placeholder="Search faculty..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-input-glow"
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      fontSize: 13,
                      borderRadius: 8,
                      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(124,58,237,0.12)',
                      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.04)',
                      color: isDark ? '#fff' : '#1a1040',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFaculty.map(faculty => {
                  const status = getRequestStatus(faculty.id)
                  const isDisabled = !!acceptedMentor || status === "PENDING" || status === "ACCEPTED"

                  return (
                    <div key={faculty.id} className="flex items-center gap-4 p-4 rounded-xl transition-all" style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(124,58,237,0.08)',
                    }}>
                      <img
                        src={faculty.avatarURL}
                        alt={faculty.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{faculty.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{faculty.department || 'Faculty'}</p>
                      </div>
                      {status === "PENDING" ? (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>
                      ) : status === "ACCEPTED" ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">Mentor</Badge>
                      ) : status === "REJECTED" ? (
                        <Button
                          size="sm"
                          disabled
                          variant="outline"
                          className="text-xs"
                          style={{ opacity: 0.5 }}
                        >
                          <XCircle style={{ width: 12, height: 12, marginRight: 4 }} />
                          Declined
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isDisabled || requesting === faculty.id}
                          onClick={() => handleRequestMentor(faculty.id)}
                          style={{
                            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                            color: '#fff',
                            border: 'none',
                            fontSize: 12,
                          }}
                        >
                          {requesting === faculty.id ? (
                            <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <>
                              <UserPlus style={{ width: 12, height: 12, marginRight: 4 }} />
                              Request
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>

              {filteredFaculty.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No faculty found matching your search.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}
