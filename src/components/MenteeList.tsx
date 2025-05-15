
import React, { useState } from 'react';
import { AttendanceRecord } from '@/services/googleSheetsService';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import MenteeDetailDialog from '@/components/MenteeDetailDialog';
import WeekBadge from '@/components/WeekBadge';

interface MenteeListProps {
  mentees: AttendanceRecord[];
  isLoading: boolean;
}

const MenteeList: React.FC<MenteeListProps> = ({ mentees, isLoading }) => {
  const [selectedMentee, setSelectedMentee] = useState<AttendanceRecord | null>(null);
  
  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'P0': return 'bg-red-100 text-red-800 border-red-200';
      case 'P1': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P2': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'P3': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Support Needed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Call Later': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'DNR': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRowClick = (mentee: AttendanceRecord) => {
    setSelectedMentee(mentee);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg text-muted-foreground">Loading mentee data...</p>
      </div>
    );
  }

  if (mentees.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-card">
        <p className="text-lg text-muted-foreground">No mentees match the current filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Week</TableHead>
              <TableHead className="hidden md:table-cell">Last Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentees.map((mentee) => (
              <TableRow 
                key={mentee.id} 
                onClick={() => handleRowClick(mentee)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{mentee.name}</TableCell>
                <TableCell className="hidden md:table-cell">{mentee.email}</TableCell>
                <TableCell className="hidden lg:table-cell">{mentee.phone}</TableCell>
                <TableCell>
                  {mentee.priority ? (
                    <Badge className={`${getPriorityColor(mentee.priority)}`}>
                      {mentee.priority}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(mentee.status)}`}>
                    {mentee.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {mentee.currentWeek && (
                    <WeekBadge 
                      week={mentee.currentWeek} 
                      status={mentee.status === 'Completed' ? 'completed' : 'active'}
                    />
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {mentee.lastAttendance ? 
                    new Date(mentee.lastAttendance).toLocaleDateString() : 
                    'Never'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMentee && (
        <MenteeDetailDialog 
          mentee={selectedMentee} 
          isOpen={!!selectedMentee} 
          onClose={() => setSelectedMentee(null)} 
        />
      )}
    </>
  );
};

export default MenteeList;
