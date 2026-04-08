import {
  Home,
  FolderOpen,
  Target,
  User,
  Settings,
  Users,
  BarChart3,
  Search,
  GraduationCap,
  UserPlus
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useTheme } from "../../hooks/useTheme"

export function Sidebar({ activeTab, onTabChange }) {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  if (!user) return null

  const textColor = isDark ? '#fff' : '#1a1040'
  const mutedText = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,16,64,0.6)'
  const hoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.06)'

  const sidebarBg = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(255,255,255,0.55)'
  const sidebarBorder = isDark
    ? '1px solid rgba(255,255,255,0.1)'
    : '1px solid rgba(255,255,255,0.5)'
  const sidebarShadow = isDark
    ? '0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
    : '0 8px 40px rgba(124,58,237,0.06), 0 2px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)'

  const studentMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "projects", label: "My Projects", icon: FolderOpen },
    { id: "milestones", label: "Milestones", icon: Target },
    { id: "mentor", label: "My Mentor", icon: GraduationCap },
    { id: "portfolio", label: "Portfolio", icon: User },
    { id: "discover", label: "Discover", icon: Search },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  const facultyMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "mentees", label: "Mentees", icon: UserPlus },
    { id: "students", label: "Students", icon: Users },
    { id: "projects", label: "All Projects", icon: FolderOpen },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "discover", label: "Discover", icon: Search },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  const menuItems =
    user.role === "student" ? studentMenuItems : facultyMenuItems

  return (
    <div
      className="w-64 h-fit sticky top-24 ml-4"
      style={{
        background: sidebarBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: sidebarBorder,
        borderRadius: 16,
        boxShadow: sidebarShadow,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ padding: 16 }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="sidebar-nav-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.25s ease",
                  background: isActive
                    ? "linear-gradient(135deg, #7C3AED, #EC4899)"
                    : "transparent",
                  color: isActive ? "#fff" : mutedText,
                  boxShadow: isActive ? "0 4px 16px rgba(124,58,237,0.3)" : "none",
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = hoverBg
                    e.currentTarget.style.color = textColor
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = mutedText
                    e.currentTarget.style.transform = 'translateX(0)'
                  }
                }}
              >
                <Icon style={{ width: 16, height: 16, marginRight: 12 }} />
                {item.label}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 12,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 0 8px rgba(255,255,255,0.6)',
                    }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
