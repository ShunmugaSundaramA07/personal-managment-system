
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Calendar, Users, CheckSquare, Plus, MoreHorizontal } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'active' | 'completed' | 'paused';
  teamMembers: number;
  totalTasks: number;
  completedTasks: number;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreateProject = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.dueDate) {
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      progress: 0,
      dueDate: new Date(formData.dueDate).toLocaleDateString(),
      status: 'active',
      teamMembers: 1,
      totalTasks: 0,
      completedTasks: 0
    };

    setProjects([...projects, newProject]);
    setFormData({ name: '', description: '', dueDate: '' });
    setShowCreateForm(false);
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalTeamMembers = projects.reduce((sum, p) => sum + p.teamMembers, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Project Management</h2>
          <p className="text-slate-600 dark:text-slate-300">Manage your projects and track progress</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="hover:scale-105 transition-transform">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Projects</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeProjects}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Completed Projects</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedProjects}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Team Members</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalTeamMembers}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <Card className="col-span-full border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Projects Yet</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">Create your first project to get started with team collaboration and task management.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                    <span>{project.teamMembers} members</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Due: {project.dueDate}</span>
                    <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Project Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Start a new project and invite team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <Input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Project description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Input 
                  type="date" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowCreateForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} className="flex-1">
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
