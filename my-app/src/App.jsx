import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "./hooks/useAuth"
import { ThemeProvider, useTheme } from "./hooks/useTheme"
import { LandingPage } from "./components/landing/LandingPage"
import { LoginForm } from "./components/auth/LoginForm"
import { Header } from "./components/navigation/Header"
import { Sidebar } from "./components/navigation/Sidebar"
import { StudentDashboard } from "./components/dashboard/StudentDashboard"
import { FacultyDashboard } from "./components/dashboard/FacultyDashboard"
import { ProjectDetail } from "./components/projects/ProjectDetail"
import { ProjectCard } from "./components/projects/ProjectCard"
import { GlassCard } from "./components/ui/glass-card"
import { Toaster } from "./components/ui/sonner"
import { PortfolioSection } from "./components/dashboard/PortfolioSection"
import { MilestonesSection } from "./components/dashboard/MilestonesSection"
import { DiscoverSection } from "./components/dashboard/DiscoverSection"
import { SettingsSection } from "./components/dashboard/SettingsSection"
import { StudentsSection } from "./components/dashboard/StudentsSection"
import { AnalyticsSection } from "./components/dashboard/AnalyticsSection"
import { projectAPI, transformProject } from "./services/api"
import { CreateProjectModal } from "./components/projects/CreateProjectModal"
import { SparkCursor } from "./components/ui/SparkCursor"
import { MentorSection } from "./components/dashboard/MentorSection"
import { MenteesSection } from "./components/dashboard/MenteesSection"


// Animated floating orbs background
function AnimatedBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Primary orb - top right */}
      <div
        className="orb-float-1"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: 500,
          height: 500,
          background: isDark
            ? 'rgba(124, 58, 237, 0.2)'
            : 'rgba(124, 58, 237, 0.12)',
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />
      {/* Secondary orb - bottom left */}
      <div
        className="orb-float-2"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-8%',
          width: 400,
          height: 400,
          background: isDark
            ? 'rgba(236, 72, 153, 0.15)'
            : 'rgba(236, 72, 153, 0.1)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      {/* Tertiary orb - center */}
      <div
        className="orb-float-3"
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: 350,
          height: 350,
          background: isDark
            ? 'rgba(251, 191, 36, 0.08)'
            : 'rgba(251, 191, 36, 0.06)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          transform: 'translateX(-50%)',
        }}
      />
      {/* Accent orb - bottom right */}
      <div
        className="orb-float-1"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '20%',
          width: 300,
          height: 300,
          background: isDark
            ? 'rgba(96, 165, 250, 0.1)'
            : 'rgba(96, 165, 250, 0.08)',
          borderRadius: '50%',
          filter: 'blur(70px)',
        }}
      />
      {/* Mesh gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(ellipse at 20% 80%, rgba(124,58,237,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.06) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 20% 80%, rgba(124,58,237,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.04) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}


function AppContent() {
  const { user, isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [currentView, setCurrentView] = useState("landing")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState(null)
  const [userProjects, setUserProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [projectToEdit, setProjectToEdit] = useState(null)

  // Fetch projects when user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const fetchProjects = async () => {
      try {
        if (user.role === "student") {
          const data = await projectAPI.getByOwner(user.id)
          setUserProjects(data.map(transformProject))
        }
        const allData = await projectAPI.getAll()
        setAllProjects(allData.map(transformProject))
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [isAuthenticated, user])

  // Theme-aware background
  const getBackground = () => {
    if (isDark) {
      return 'linear-gradient(135deg, #0f0a1e 0%, #1a1040 30%, #1e1b4b 50%, #251445 70%, #1a0a2e 100%)'
    }
    return 'linear-gradient(135deg, #f0ecff 0%, #e8e0ff 25%, #fce7f3 50%, #ede9fe 75%, #f5f3ff 100%)'
  }

  // If not authenticated, show landing or login
  if (!isAuthenticated) {
    if (currentView === "login") {
      return (
        <>
          <SparkCursor />
          <LoginForm />
        </>
      )
    }
    return (
      <>
        <SparkCursor />
        <LandingPage onGetStarted={() => setCurrentView("login")} />
      </>
    )
  }

  // Handle project creation/editing
  const handleCreateProject = () => {
    setProjectToEdit(null)
    setShowCreateProject(true)
  }

  const handleEditProject = (project) => {
    setProjectToEdit(project)
    setShowCreateProject(true)
  }

  const handleProjectCreated = async () => {
    if (user.role === "student") {
      const data = await projectAPI.getByOwner(user.id);
      setUserProjects(data.map(transformProject));
    }
    const allData = await projectAPI.getAll()
    setAllProjects(allData.map(transformProject))
  }

  const handleViewProject = project => {
    setSelectedProject(project)
  }

  const handleBackToProjects = () => {
    setSelectedProject(null)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedProject(null) // Reset project view when switching tabs
  }

  // If viewing a specific project
  if (selectedProject) {
    return (
      <div style={{ minHeight: '100vh', background: getBackground(), transition: 'background 0.5s ease', color: isDark ? '#fff' : '#1a1040' }}>
        <AnimatedBackground />
        <SparkCursor />
        <Header />
        <div className="flex">
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <main className="flex-1 mr-4">
            <ProjectDetail
              project={selectedProject}
              onBack={handleBackToProjects}
              onEdit={() => handleEditProject(selectedProject)}
            />
          </main>
        </div>
        <Toaster />
        <CreateProjectModal
          open={showCreateProject}
          onOpenChange={setShowCreateProject}
          onSuccess={() => { handleProjectCreated(); setSelectedProject(null); }}
          project={projectToEdit}
        />
      </div>
    )
  }

  // Main dashboard view
  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return user?.role === "student" ? (
          <StudentDashboard
            onCreateProject={handleCreateProject}
            onViewProject={handleViewProject}
          />
        ) : (
          <FacultyDashboard onViewProject={handleViewProject} onTabChange={handleTabChange} />
        )

      case "projects": {
        const filteredUserP = userProjects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        const filteredAllP = allProjects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))

        if (user?.role === "student") {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Projects</h1>
              </div>
              {filteredUserP.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUserP.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewProject={handleViewProject}
                    />
                  ))}
                </div>
              ) : (
                <GlassCard>
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No projects yet. Create your first project!</p>
                  </div>
                </GlassCard>
              )}
            </div>
          )
        } else {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Projects</h1>
              </div>
              {filteredAllP.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAllP.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewProject={handleViewProject}
                      showOwner={true}
                    />
                  ))}
                </div>
              ) : (
                <GlassCard>
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No projects found.</p>
                  </div>
                </GlassCard>
              )}
            </div>
          )
        }
      }

      case "milestones":
        return <MilestonesSection projects={userProjects} onViewProject={handleViewProject} />

      case "portfolio":
        return <PortfolioSection />

      case "discover":
        return <DiscoverSection searchQuery={searchQuery} onViewProject={handleViewProject} />

      case "students":
        return <StudentsSection searchQuery={searchQuery} onViewProject={handleViewProject} allProjects={allProjects} />

      case "analytics":
        return <AnalyticsSection />

      case "settings":
        return <SettingsSection />

      case "mentor":
        return <MentorSection />

      case "mentees":
        return <MenteesSection onViewProject={handleViewProject} />

      default:
        return (
          <GlassCard>
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
              <p className="text-muted-foreground">
                The requested page could not be found.
              </p>
            </div>
          </GlassCard>
        )
    }
  }

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "students": return "Search students...";
      case "discover": return "Search discovery...";
      default: return "Search projects...";
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: getBackground(), transition: 'background 0.5s ease', color: isDark ? '#fff' : '#1a1040' }}>
      <AnimatedBackground />
      <SparkCursor />
      <Header
        onCreateProject={handleCreateProject}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={getSearchPlaceholder()}
      />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="flex-1 ml-64 p-8 mr-4">{renderMainContent()}</main>
      </div>
      <Toaster />
      <CreateProjectModal
        open={showCreateProject}
        onOpenChange={setShowCreateProject}
        onSuccess={handleProjectCreated}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
