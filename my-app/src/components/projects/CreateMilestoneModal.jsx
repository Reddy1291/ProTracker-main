import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { milestoneAPI } from "../../services/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CreateMilestoneModal({ open, onOpenChange, projectId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    percentComplete: 0,
    status: "planned"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    try {
      await milestoneAPI.create({ ...formData, percentComplete: parseInt(formData.percentComplete) }, projectId);
      toast.success("Milestone added successfully!");
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        percentComplete: 0,
        status: "planned"
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add milestone");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
          <DialogDescription className="text-muted-foreground">Add a milestone to track project progress.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Milestone Title</Label>
            <Input
              id="title"
              placeholder="e.g. Design Database Schema"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of what needs to be done..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentComplete">Percent Complete</Label>
              <Input
                id="percentComplete"
                type="number"
                min="0"
                max="100"
                value={formData.percentComplete}
                onChange={(e) => setFormData({ ...formData, percentComplete: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none' }}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Milestone"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
