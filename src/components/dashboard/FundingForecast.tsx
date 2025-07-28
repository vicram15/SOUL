import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Target } from 'lucide-react';

interface FundingForecastProps {
  children: any[];
}

export const FundingForecast: React.FC<FundingForecastProps> = ({ children }) => {
  // Generate funding forecast data based on current trends
  const generateForecastData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const baseNeed = 50000 + (index * 2000); // Base funding need growing over time
      const seasonalFactor = index < 6 ? 1.2 : 0.8; // Higher need in first half of year (school enrollment)
      const predicted = index <= currentMonth;
      
      return {
        month,
        currentNeed: predicted ? baseNeed * seasonalFactor + Math.random() * 10000 : null,
        forecastNeed: baseNeed * seasonalFactor,
        actualFunding: predicted ? (baseNeed * seasonalFactor * 0.7) + Math.random() * 5000 : null,
        gap: predicted ? baseNeed * seasonalFactor * 0.3 : baseNeed * seasonalFactor * 0.4,
      };
    });
  };

  const forecastData = generateForecastData();
  
  // Regional funding needs
  const regionalNeeds = [
    { region: 'Urban Mumbai', need: 125000, funded: 85000, children: 45 },
    { region: 'Rural Maharashtra', need: 180000, funded: 95000, children: 78 },
    { region: 'Delhi NCR', need: 95000, funded: 70000, children: 32 },
    { region: 'Bangalore Urban', need: 110000, funded: 82000, children: 38 },
    { region: 'Chennai Metro', need: 88000, funded: 65000, children: 29 },
  ];

  const totalProjectedNeed = forecastData.reduce((sum, item) => sum + (item.forecastNeed || 0), 0);
  const totalFundingGap = forecastData.reduce((sum, item) => sum + (item.gap || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="gradient-accent text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Projected Annual Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalProjectedNeed / 100000).toFixed(1)}L</div>
            <p className="text-xs opacity-90">Based on current trends</p>
          </CardContent>
        </Card>
        
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Funding Gap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{(totalFundingGap / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Urgent funding required</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">+18%</div>
            <p className="text-xs text-muted-foreground">Year-over-year increase</p>
          </CardContent>
        </Card>
      </div>

      {/* Funding Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Funding Forecast & Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`₹${(Number(value) / 1000).toFixed(0)}K`, '']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="forecastNeed" 
                stroke="hsl(200, 98%, 39%)" 
                strokeWidth={3}
                name="Projected Need"
              />
              <Line 
                type="monotone" 
                dataKey="actualFunding" 
                stroke="hsl(156, 73%, 59%)" 
                strokeWidth={2}
                name="Current Funding"
              />
              <Line 
                type="monotone" 
                dataKey="gap" 
                stroke="hsl(348, 83%, 47%)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Funding Gap"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Funding Needs */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Funding Priorities</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalNeeds} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <YAxis dataKey="region" type="category" width={120} />
              <Tooltip formatter={(value) => [`₹${(Number(value) / 1000).toFixed(0)}K`, '']} />
              <Bar dataKey="need" fill="hsl(200, 98%, 39%)" name="Total Need" />
              <Bar dataKey="funded" fill="hsl(156, 73%, 59%)" name="Current Funding" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};