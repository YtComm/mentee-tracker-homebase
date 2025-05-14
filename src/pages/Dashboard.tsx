
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { googleSheetsService, AttendanceRecord } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import MenteeList from '@/components/MenteeList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentees, setMentees] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMenteeData();
  }, []);

  const loadMenteeData = async () => {
    try {
      setIsLoading(true);
      const data = await googleSheetsService.getAttendanceData();
      const categorizedData = googleSheetsService.categorizeMentees(data);
      setMentees(categorizedData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load mentee data',
        description: 'There was an error loading mentee data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsLoading(true);
      const refreshedData = await googleSheetsService.refreshData();
      setMentees(refreshedData);
      toast({
        title: 'Data refreshed',
        description: 'The latest attendance data has been loaded.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to refresh data',
        description: 'There was an error refreshing the data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveNotes = async () => {
    try {
      await googleSheetsService.archiveNotes();
      toast({
        title: 'Notes archived',
        description: 'Weekly notes have been archived to the Data Dump sheet.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to archive notes',
        description: 'There was an error archiving the notes. Please try again.'
      });
    }
  };

  // Filter mentees based on selected criteria
  const filteredMentees = mentees.filter(mentee => {
    // Filter by priority
    if (filterPriority && mentee.priority !== filterPriority) {
      return false;
    }

    // Filter by status
    if (filterStatus && mentee.status !== filterStatus) {
      return false;
    }

    // Filter by search term (name or email)
    if (searchTerm && 
        !mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !mentee.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Count mentees in each priority category
  const priorityCounts = {
    P0: mentees.filter(m => m.priority === 'P0').length,
    P1: mentees.filter(m => m.priority === 'P1').length,
    P2: mentees.filter(m => m.priority === 'P2').length,
    P3: mentees.filter(m => m.priority === 'P3').length,
    total: mentees.length
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">C4 Mentee Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.name || 'User'}. Manage your mentee attendance and follow-ups.
              <Link to="/" className="ml-2 text-mentee-orange hover:underline">Back to Home</Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button 
              onClick={handleRefreshData} 
              variant="outline"
              className="flex items-center"
              disabled={isLoading}
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh Data
            </Button>
            <Button 
              onClick={handleArchiveNotes} 
              variant="outline" 
              className="flex items-center"
            >
              <Save size={16} className="mr-2" />
              Archive Notes
            </Button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 shadow-sm border">
            <div className="text-sm text-muted-foreground">Total Mentees</div>
            <div className="text-2xl font-bold">{priorityCounts.total}</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border border-red-200 bg-red-50/30">
            <div className="text-sm text-muted-foreground">P0 (Missed 4)</div>
            <div className="text-2xl font-bold">{priorityCounts.P0}</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border border-orange-200 bg-orange-50/30">
            <div className="text-sm text-muted-foreground">P1 (Missed 3)</div>
            <div className="text-2xl font-bold">{priorityCounts.P1}</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border border-yellow-200 bg-yellow-50/30">
            <div className="text-sm text-muted-foreground">P2 (Missed 2)</div>
            <div className="text-2xl font-bold">{priorityCounts.P2}</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border border-blue-200 bg-blue-50/30">
            <div className="text-sm text-muted-foreground">P3 (Missed 1)</div>
            <div className="text-2xl font-bold">{priorityCounts.P3}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filterPriority === null ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setFilterPriority(null)}
            >
              All
            </Button>
            <Button 
              variant={filterPriority === 'P0' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setFilterPriority(filterPriority === 'P0' ? null : 'P0')}
              className="border-red-300"
            >
              P0
            </Button>
            <Button 
              variant={filterPriority === 'P1' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setFilterPriority(filterPriority === 'P1' ? null : 'P1')}
              className="border-orange-300"
            >
              P1
            </Button>
            <Button 
              variant={filterPriority === 'P2' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setFilterPriority(filterPriority === 'P2' ? null : 'P2')}
              className="border-yellow-300"
            >
              P2
            </Button>
            <Button 
              variant={filterPriority === 'P3' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setFilterPriority(filterPriority === 'P3' ? null : 'P3')}
              className="border-blue-300"
            >
              P3
            </Button>
          </div>
        </div>
        
        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setFilterStatus(null)}>
            All Statuses
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setFilterStatus('In Progress')}>
            In Progress
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setFilterStatus('Call Later')}>
            Call Later
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setFilterStatus('Support Needed')}>
            Support Needed
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setFilterStatus('Completed')}>
            Completed
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setFilterStatus('DNR')}>
            DNR
          </Badge>
        </div>

        {/* Mentee List */}
        <MenteeList mentees={filteredMentees} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Dashboard;
