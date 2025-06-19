
import { useState, useEffect } from 'react';
import { Calendar, CheckSquare, FileText, DollarSign, BarChart3, Menu, Sun, Moon, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskManager from '@/components/TaskManager';
import CalendarView from '@/components/CalendarView';
import NotesApp from '@/components/NotesApp';
import FinanceTracker from '@/components/FinanceTracker';
import ProjectManager from '@/components/ProjectManager';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast({
      title: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'finance', label: 'Finance', icon: DollarSign },
  ];

  const stats = [
    { title: 'Total Tasks', value: '0', change: '+0%', icon: CheckSquare },
    { title: 'Completed Today', value: '0', change: '+0%', icon: CheckSquare },
    { title: 'This Month Expenses', value: '$0', change: '+0%', icon: DollarSign },
    { title: 'Notes Created', value: '0', change: '+0%', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white dark:bg-slate-800 shadow-lg border-r border-slate-200 dark:border-slate-700 min-h-screen`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ProductiveHub
                </h1>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start transition-all ${!sidebarOpen ? 'px-2' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {sidebarOpen && <span className="ml-2">{item.label}</span>}
                  </Button>
                );
              })}
            </nav>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {sidebarOpen && <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="dashboard" className="mt-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                    <p className="text-slate-600 dark:text-slate-300">Welcome back! Here's your productivity overview.</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{stat.title}</p>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {stat.change} from last month
                              </p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Jump into your most used features</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <Button onClick={() => setActiveTab('projects')} className="h-20 flex flex-col gap-2">
                        <FolderOpen className="h-6 w-6" />
                        <span>New Project</span>
                      </Button>
                      <Button onClick={() => setActiveTab('tasks')} variant="outline" className="h-20 flex flex-col gap-2">
                        <CheckSquare className="h-6 w-6" />
                        <span>Add Task</span>
                      </Button>
                      <Button onClick={() => setActiveTab('notes')} variant="outline" className="h-20 flex flex-col gap-2">
                        <FileText className="h-6 w-6" />
                        <span>New Note</span>
                      </Button>
                      <Button onClick={() => setActiveTab('finance')} variant="outline" className="h-20 flex flex-col gap-2">
                        <DollarSign className="h-6 w-6" />
                        <span>Add Expense</span>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Today's Focus</CardTitle>
                      <CardDescription>Your priority tasks for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No tasks scheduled for today</p>
                          <p className="text-sm">Add some tasks to get started!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <ProjectManager />
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <TaskManager />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <CalendarView />
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <NotesApp />
            </TabsContent>

            <TabsContent value="finance" className="mt-0">
              <FinanceTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
