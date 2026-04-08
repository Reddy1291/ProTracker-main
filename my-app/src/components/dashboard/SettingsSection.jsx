import { useState } from "react"
import { GlassCard } from "../ui/glass-card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { User } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { userAPI, transformUser } from "../../services/api"
import { toast } from "sonner"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

export function SettingsSection() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatarURL: user?.avatarURL || "",
    password: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (user) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        const success = await updateProfile(payload);
        if (success) {
          toast.success("Profile updated successfully!");
          setFormData(f => ({ ...f, password: "" }))
        } else {
          toast.error("Failed to update profile");
        }
      }
    } catch (e) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <GlassCard>
        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatarURL || user?.avatarURL} alt={user?.name} />
              <AvatarFallback className="text-2xl">
                {user?.name?.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <p className="text-muted-foreground">Update your personal info and preferences.</p>
            </div>
          </div>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <Label>Name</Label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <Label>Profile Picture URL</Label>
              <Input 
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatarURL}
                onChange={e => setFormData({...formData, avatarURL: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">Provide a direct link to an image to set your profile picture.</p>
            </div>
            
            <div className="pt-4 border-t border-white/20 mt-6">
              <h3 className="text-lg font-medium mb-4">Security</h3>
              <Label>Update Password</Label>
              <Input 
                type="password"
                placeholder="Enter new password (optional)"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">Leave blank to keep your current password.</p>
            </div>
            <Button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none', marginTop: 24 }}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </GlassCard>
    </div>
  )
}
