
import React from 'react';
import { Chart } from '@/components/ui/charts'; // Updated import path to charts 
import { googleSheetsService } from '@/services/googleSheetsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Analytics: React.FC = () => {
  // Data for attendance trend chart
  const chartData = [
    { name: 'Week 1', present: 85, absent: 15 },
    { name: 'Week 2', present: 78, absent: 22 },
    { name: 'Week 3', present: 80, absent: 20 },
    { name: 'Week 4', present: 72, absent: 28 },
  ];

  // Calculate program completion percentage
  const programCompletion = 75; // 75% complete

  // Priority distribution - transform data for better visualization
  const priorityData = [
    { name: 'P0', value: googleSheetsService.getPriorityCount('P0') },
    { name: 'P1', value: googleSheetsService.getPriorityCount('P1') },
    { name: 'P2', value: googleSheetsService.getPriorityCount('P2') },
    { name: 'P3', value: googleSheetsService.getPriorityCount('P3') },
    { name: 'None', value: googleSheetsService.getPriorityCount(null) },
  ];

  // Status distribution - transform data for better visualization
  const statusData = [
    { name: 'In Progress', value: googleSheetsService.getStatusCount('In Progress') },
    { name: 'Call Later', value: googleSheetsService.getStatusCount('Call Later') },
    { name: 'Support Needed', value: googleSheetsService.getStatusCount('Support Needed') },
    { name: 'Completed', value: googleSheetsService.getStatusCount('Completed') },
    { name: 'DNR', value: googleSheetsService.getStatusCount('DNR') },
  ];

  return (
    <div className="space-y-6">
      {/* Program Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Program Progress</CardTitle>
          <CardDescription>Overall program completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{programCompletion}%</span>
            </div>
            <Progress value={programCompletion} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Weekly Attendance</CardTitle>
          <CardDescription>4-week attendance trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <Chart 
              data={chartData}
              type="bar"
              categories={['present', 'absent']}
              index="name"
              colors={['#4ade80', '#f87171']}
              valueFormatter={(value) => `${value}%`}
              stack
            />
          </div>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Priority Distribution</CardTitle>
          <CardDescription>Mentees by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <Chart 
              data={priorityData}
              type="pie"
              category="value"
              index="name"
              colors={['#ef4444', '#f97316', '#facc15', '#60a5fa', '#d1d5db']}
              valueFormatter={(value) => `${value} mentees`}
              showLegend={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Mentees by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <Chart 
              data={statusData}
              type="donut"
              category="value"
              index="name"
              colors={['#60a5fa', '#f97316', '#ef4444', '#4ade80', '#d1d5db']}
              valueFormatter={(value) => `${value} mentees`}
              showLegend={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
