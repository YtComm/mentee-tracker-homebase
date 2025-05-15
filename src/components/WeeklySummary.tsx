
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { googleSheetsService } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Download, FileText } from 'lucide-react';

const WeeklySummary: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [format, setFormat] = useState('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    setIsLoading(true);
    
    // Mock download process
    setTimeout(() => {
      toast({
        title: "Report generated",
        description: `Weekly summary for ${selectedWeek} has been downloaded.`
      });
      setIsLoading(false);
    }, 1500);
  };

  // Mock data for report preview
  const summaryData = {
    totalMentees: 128,
    attendanceRate: selectedWeek === 'week1' ? '85%' : selectedWeek === 'week2' ? '78%' : selectedWeek === 'week3' ? '80%' : selectedWeek === 'week4' ? '72%' : '76%',
    followUpsCompleted: selectedWeek === 'week1' ? 12 : selectedWeek === 'week2' ? 18 : selectedWeek === 'week3' ? 15 : selectedWeek === 'week4' ? 20 : 14,
    highlightStats: [
      `${selectedWeek === 'week1' ? 8 : selectedWeek === 'week2' ? 12 : selectedWeek === 'week3' ? 9 : selectedWeek === 'week4' ? 14 : 10} mentees need immediate support`,
      `${selectedWeek === 'week1' ? 15 : selectedWeek === 'week2' ? 18 : selectedWeek === 'week3' ? 22 : selectedWeek === 'week4' ? 16 : 19} mentees improved attendance`,
      `${selectedWeek === 'week1' ? 5 : selectedWeek === 'week2' ? 7 : selectedWeek === 'week3' ? 8 : selectedWeek === 'week4' ? 4 : 6} mentees completed all requirements`
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary Report</CardTitle>
        <CardDescription>Generate and download attendance and follow-up reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="week-select">Select Week</label>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger id="week-select" className="w-full">
                <SelectValue placeholder="Select a week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Week</SelectItem>
                <SelectItem value="week1">Week 1</SelectItem>
                <SelectItem value="week2">Week 2</SelectItem>
                <SelectItem value="week3">Week 3</SelectItem>
                <SelectItem value="week4">Week 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="format-select">File Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format-select" className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report Preview */}
          <div className="mt-4 p-4 border rounded-md">
            <div className="flex items-center mb-4">
              <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Report Preview</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Mentees:</span>
                <span className="font-medium">{summaryData.totalMentees}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Attendance Rate:</span>
                <span className="font-medium">{summaryData.attendanceRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Follow-ups Completed:</span>
                <span className="font-medium">{summaryData.followUpsCompleted}</span>
              </div>
              
              <div className="pt-2 mt-2 border-t">
                <p className="text-xs font-medium mb-1">Highlights:</p>
                <ul className="text-xs space-y-1">
                  {summaryData.highlightStats.map((stat, index) => (
                    <li key={index} className="text-muted-foreground">• {stat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" className="flex items-center gap-2">
          <Calendar size={16} />
          <span>Change Date Range</span>
        </Button>
        <Button onClick={handleDownload} disabled={isLoading} className="flex items-center gap-2">
          <Download size={16} />
          <span>{isLoading ? 'Generating...' : 'Download Report'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WeeklySummary;
