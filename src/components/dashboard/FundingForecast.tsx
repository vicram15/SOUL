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
  // Calculate gap for each region
  const regionalNeeds = [
    { region: 'Urban Mumbai', need: 125000, funded: 85000, gap: 125000 - 85000, children: 45 },
    { region: 'Rural Maharashtra', need: 180000, funded: 95000, gap: 180000 - 95000, children: 78 },
    { region: 'Delhi NCR', need: 95000, funded: 70000, gap: 95000 - 70000, children: 32 },
    { region: 'Bangalore Urban', need: 110000, funded: 82000, gap: 110000 - 82000, children: 38 },
    { region: 'Chennai Metro', need: 88000, funded: 65000, gap: 88000 - 65000, children: 29 },
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
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={regionalNeeds}
              layout="vertical"
              margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
              barCategoryGap={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <YAxis dataKey="region" type="category" width={140} />
              <Tooltip
                formatter={(value, name) => [`₹${(Number(value) / 1000).toFixed(1)}K`, name === 'funded' ? 'Funded' : 'Gap']}
                labelFormatter={(label) => `Region: ${label}`}
              />
              <Legend />
              <Bar dataKey="funded" stackId="a" fill="hsl(156, 73%, 59%)" name="Funded" />
              <Bar dataKey="gap" stackId="a" fill="hsl(348, 83%, 47%)" name="Gap" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-muted-foreground mt-2">
            <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: 'hsl(156, 73%, 59%)' }} /> Funded &nbsp;
            <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: 'hsl(348, 83%, 47%)' }} /> Gap
          </div>
          <div className="text-xs mt-2">
            <strong>Note:</strong> Each bar shows the total need, with the funded portion in green and the gap in red.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};