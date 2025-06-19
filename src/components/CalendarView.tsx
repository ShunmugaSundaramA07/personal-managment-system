
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  color: string;
}

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync',
      date: '2024-01-15',
      time: '10:00',
      category: 'Work',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      date: '2024-01-17',
      time: '14:30',
      category: 'Health',
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Project Deadline',
      description: 'Submit final proposal',
      date: '2024-01-20',
      time: '23:59',
      category: 'Work',
      color: 'bg-red-500'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'Work'
  });

  const categories = [
    { name: 'Work', color: 'bg-blue-500' },
    { name: 'Personal', color: 'bg-purple-500' },
    { name: 'Health', color: 'bg-green-500' },
    { name: 'Finance', color: 'bg-yellow-500' },
    { name: 'Social', color: 'bg-pink-500' }
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const category = categories.find(c => c.name === newEvent.category);
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      color: category?.color || 'bg-blue-500'
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      category: 'Work'
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Event created successfully"
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar</h2>
          <p className="text-slate-600 dark:text-slate-300">Schedule and manage your events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover:scale-105 transition-transform">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newEvent.category} onValueChange={(value) => setNewEvent({...newEvent, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addEvent} className="w-full">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {daysOfWeek.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2 h-24"></div>;
                  }
                  
                  const dayEvents = getEventsForDate(day);
                  const isCurrentDay = isToday(day);
                  
                  return (
                    <div
                      key={index}
                      className={`p-2 h-24 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : ''
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-medium ${
                        isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate ${event.color}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Today's Events */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today's Events</CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(new Date()).length === 0 ? (
                <p className="text-sm text-slate-500">No events today</p>
              ) : (
                <div className="space-y-2">
                  {getEventsForDate(new Date()).map(event => (
                    <div key={event.id} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.name} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {events.filter(e => e.category === category.name).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
