import { useState, useRef } from "react"
import { GlassCard } from "../ui/glass-card"
import { Button } from "../ui/button"
import { FolderOpen, UploadCloud, File, Trash2 } from "lucide-react"

export function PortfolioSection() {
  const [portfolioItems, setPortfolioItems] = useState([])
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const newItem = {
      id: Date.now().toString(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      date: new Date().toLocaleDateString()
    }
    
    setPortfolioItems(prev => [...prev, newItem])
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = (id) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <Button 
          style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Upload Work
        </Button>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />
      </div>

      {portfolioItems.length === 0 ? (
        <GlassCard>
          <div className="p-8 text-center">
            <FolderOpen className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No portfolio yet</h2>
            <p className="text-muted-foreground mb-4">
              Start building your portfolio by adding your best projects and achievements.
            </p>
            <Button 
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-4 h-4 mr-2" /> Upload Work
            </Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {portfolioItems.map(item => (
            <GlassCard key={item.id}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <File className="w-6 h-6 text-[#6D8BFF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.size} • Uploaded {item.date}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
