import { Search, Bell, Plus, Sun, Moon } from "lucide-react"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import { useAuth } from "../../hooks/useAuth"
import { useTheme } from "../../hooks/useTheme"


export function Header({ onCreateProject, showSearch = true, searchQuery, onSearchChange, searchPlaceholder="Search projects..." }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const notifications = []
  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) return null

  // Theme-aware colors
  const textColor = isDark ? '#fff' : '#1a1040'
  const mutedText = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,16,64,0.55)'
  const subtleText = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,16,64,0.35)'

  const headerBg = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(255,255,255,0.6)'
  const headerBorder = isDark
    ? '1px solid rgba(255,255,255,0.1)'
    : '1px solid rgba(255,255,255,0.5)'
  const headerShadow = isDark
    ? '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)'
    : '0 8px 40px rgba(124,58,237,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)'

  const searchBg = isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(124,58,237,0.04)'
  const searchBorder = isDark
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(124,58,237,0.12)'

  const dropdownBg = isDark
    ? 'rgba(30,27,75,0.95)'
    : 'rgba(255,255,255,0.95)'
  const dropdownBorder = isDark
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(124,58,237,0.1)'

  return (
    <div
      className="sticky top-4 z-50 mx-4 mb-6 glass-header-hover"
      style={{
        background: headerBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: headerBorder,
        borderRadius: 16,
        boxShadow: headerShadow,
        transition: 'all 0.3s ease',
      }}
    >
      <div className="flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className="logo-pulse"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>P</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: textColor, letterSpacing: '-0.01em' }}>
              ProTrackr
            </span>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-8">
            <div style={{ position: 'relative' }}>
              <Search
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: subtleText,
                  width: 16,
                  height: 16,
                }}
              />
              <input
                placeholder={searchPlaceholder}
                value={searchQuery || ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="search-input-glow"
                style={{
                  width: '100%',
                  paddingLeft: 36,
                  paddingRight: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  background: searchBg,
                  border: searchBorder,
                  borderRadius: 10,
                  backdropFilter: 'blur(8px)',
                  color: textColor,
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            style={{
              padding: 8,
              color: mutedText,
              borderRadius: 10,
              transition: 'all 0.3s ease',
            }}
          >
            {theme === "light" ? (
              <Moon style={{ width: 20, height: 20 }} />
            ) : (
              <Sun style={{ width: 20, height: 20 }} />
            )}
          </Button>

          {/* Create Project Button */}
          {user.role === "student" && (
            <button
              onClick={onCreateProject}
              className="create-btn-shimmer"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
                transition: 'all 0.3s ease',
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              New Project
            </button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative" style={{ padding: 8, color: mutedText }}>
                <Bell style={{ width: 20, height: 20 }} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      height: 20,
                      minWidth: 20,
                      padding: '0 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #EC4899, #F59E0B)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 600,
                      borderRadius: 10,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80"
              style={{
                background: dropdownBg,
                backdropFilter: 'blur(20px) saturate(180%)',
                border: dropdownBorder,
                borderRadius: 12,
              }}
            >
              <div className="p-3">
                <h4 style={{ fontWeight: 500, marginBottom: 8, color: textColor }}>Notifications</h4>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: 14, color: mutedText }}>
                    No notifications
                  </p>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 3).map(notification => (
                      <div
                        key={notification.id}
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          background: !notification.read ? 'rgba(124,58,237,0.15)' : 'transparent',
                        }}
                      >
                        <p style={{ fontSize: 14, color: textColor }}>{notification.message}</p>
                        <p style={{ fontSize: 12, color: mutedText, marginTop: 4 }}>
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar>
                  <AvatarImage src={user.avatarURL} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              style={{
                background: dropdownBg,
                backdropFilter: 'blur(20px) saturate(180%)',
                border: dropdownBorder,
                borderRadius: 12,
              }}
            >
              <div className="p-3">
                <p style={{ fontWeight: 500, color: textColor }}>{user.name}</p>
                <p style={{ fontSize: 14, color: mutedText }}>{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {user.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Portfolio</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} style={{ color: '#f87171' }}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
