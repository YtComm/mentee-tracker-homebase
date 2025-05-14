
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, Moon, Sun, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('menteeTracker_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial dark mode - check localStorage first, then system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('menteeTracker_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('menteeTracker_theme', 'light');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center border-b">
      <div className="flex items-center">
        <Home className="h-5 w-5 mr-2 text-mentee-orange" />
        <span className="text-lg font-semibold tracking-tight">Mentee Tracker</span>
      </div>
      <div className="flex items-center">
        {user && (
          <div className="mr-4 text-sm hidden md:block">
            <span className="text-muted-foreground">Logged in as </span>
            <span className="font-medium">{user.name}</span>
          </div>
        )}
        
        {/* Dark Mode Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 rounded-full"
          onClick={toggleDarkMode}
        >
          {darkMode ? 
            <Sun className="h-5 w-5" /> : 
            <Moon className="h-5 w-5" />
          }
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={toggleDarkMode}>
              {darkMode ? 
                <Sun className="mr-2 h-4 w-4" /> : 
                <Moon className="mr-2 h-4 w-4" />
              }
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
