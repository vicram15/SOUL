import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  district: string;
  education_status: 'none' | 'primary' | 'secondary' | 'higher_secondary' | 'vocational';
  health_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

interface ChartsSectionProps {
  children: Child[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ children }) => {
  // Process data for charts
  const districtData = children.reduce((acc, child) => {
    const district = child.district;
    acc[district] = (acc[district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(districtData).map(([district, count]) => ({
    district: district.split(' ')[0], // Shorten names for display
    count,
  }));

  const educationData = children.reduce((acc, child) => {
    const status = child.education_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(educationData).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    value,
  }));

  const genderData = children.reduce((acc, child) => {
    const gender = child.gender;
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderChartData = Object.entries(genderData).map(([gender, count]) => ({
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    count,
  }));

  // Age distribution data
  const ageRanges = {
    '0-5': 0,
    '6-10': 0,
    '11-15': 0,
    '16-18': 0,
  };

  children.forEach(child => {
    if (child.age <= 5) ageRanges['0-5']++;
    else if (child.age <= 10) ageRanges['6-10']++;
    else if (child.age <= 15) ageRanges['11-15']++;
    else ageRanges['16-18']++;
  });

  const ageChartData = Object.entries(ageRanges).map(([range, count]) => ({
    ageRange: range,
    count,
  }));

  const COLORS = ['hsl(200, 98%, 39%)', 'hsl(156, 73%, 59%)', 'hsl(39, 100%, 60%)', 'hsl(348, 83%, 47%)', 'hsl(261, 83%, 58%)'];

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-slide-up">
      {/* Children by District */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Children by District</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(200, 98%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Education Status */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Education Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gender" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(156, 73%, 59%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age Distribution */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Age Group Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageRange" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(200, 98%, 39%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(200, 98%, 39%)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};