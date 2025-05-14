
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DashboardCard from '@/components/DashboardCard';
import { Users, CalendarCheck, UserPlus, ArrowRight, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Mock data
  const activePrograms = 3;
  const totalMentees = 128;
  const checkInsDue = 24;

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  // If not authenticated, this would never render due to the ProtectedRoute wrapper
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Mentee Tracker</h1>
          <p className="text-lg text-muted-foreground">
            Your central hub for managing mentorship programs
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* C4 Mentee Tracker - Main Card */}
          <DashboardCard
            title="C4 Mentee Tracker"
            icon={<ArrowRight size={24} />}
            large={true}
            className="bg-mentee-orange/10 border-mentee-orange/20"
            onClick={handleNavigateToDashboard}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Access detailed mentee tracking and attendance management
            </p>
            <div className="mt-auto">
              <button className="px-4 py-2 bg-mentee-orange text-white rounded-md hover:bg-mentee-orange/90 transition-colors">
                Go to Dashboard
              </button>
            </div>
          </DashboardCard>

          {/* New Program Card */}
          <DashboardCard
            title="New Program"
            icon={<PlusCircle size={24} />}
            disabled={true}
            badge="Coming Soon"
          >
            <p className="text-sm text-muted-foreground">
              Start tracking a new mentorship program
            </p>
          </DashboardCard>

          {/* Active Programs Card */}
          <DashboardCard
            title="Active Programs"
            icon={<Users size={24} />}
            onClick={() => console.log('Viewing active programs')}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold mb-1">{activePrograms}</span>
              <span className="text-sm text-muted-foreground">Programs in progress</span>
            </div>
          </DashboardCard>

          {/* Total Mentees Card */}
          <DashboardCard
            title="Total Mentees"
            icon={<UserPlus size={24} />}
            onClick={() => console.log('Viewing all mentees')}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold mb-1">{totalMentees}</span>
              <span className="text-sm text-muted-foreground">Across all programs</span>
            </div>
          </DashboardCard>

          {/* Check-ins Due Card */}
          <DashboardCard
            title="Check-ins Due"
            icon={<CalendarCheck size={24} />}
            onClick={() => console.log('Viewing check-ins')}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold mb-1">{checkInsDue}</span>
              <span className="text-sm text-muted-foreground">Pending this week</span>
            </div>
          </DashboardCard>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Mentee Tracker • All rights reserved</p>
      </footer>
    </div>
  );
};

export default Index;
