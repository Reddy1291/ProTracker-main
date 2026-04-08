import { useState, useEffect } from "react"
import { GlassCard } from "../ui/glass-card"
import { Search, User } from "lucide-react"
import { Input } from "../ui/input"
import { userAPI, transformUser } from "../../services/api"
import { toast } from "sonner"

export function StudentsSection({ searchQuery, onViewProject, allProjects = [] }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await userAPI.getAll()
        setStudents(data.filter(u => u.role === "student").map(transformUser))
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  if (loading) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#6D8BFF] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </GlassCard>
    )
  }

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (student.department && student.department.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Search students..." 
            className="w-64 bg-white/50 border-white/20 backdrop-blur-sm" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', padding: '8px 16px', borderRadius: 8, color: '#fff', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            <Search className="w-4 h-4 inline-block mr-2" /> Search
          </button>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <GlassCard key={student.id}>
              <div className="p-6 flex flex-col items-center text-center space-y-3">
                <img
                  src={student.avatarURL}
                  alt={student.name}
                  className="w-20 h-20 rounded-full border-2 border-white/20 object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{student.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {student.department} {student.year ? `• ${student.year}` : ''}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{student.bio}</p>
                <div className="pt-2 flex flex-col space-y-2">
                  <button 
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    onClick={() => {
                      const project = allProjects.find(p => p.ownerId === student.id);
                      if (project) {
                        onViewProject(project);
                      } else {
                        toast.error(`${student.name} has not created a project yet.`);
                      }
                    }}
                  >
                    View Project / Give Review
                  </button>
                  <button 
                    className="text-sm text-gray-500 font-medium hover:underline"
                    onClick={() => toast.success(`Viewing full profile details for ${student.name} `)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard>
          <div className="p-8 text-center">
            <User className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No students match your search.</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
