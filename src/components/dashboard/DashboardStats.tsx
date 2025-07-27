import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Heart, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  gradient?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, gradient }) => (
  <Card className={`shadow-card transition-smooth hover:shadow-elegant ${gradient ? 'gradient-card' : ''}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="p-2 rounded-lg gradient-accent">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  stats: {
    totalChildren: number;
    educatedChildren: number;
    healthyChildren: number;
    impactGrowth: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <StatCard
        title="Total Children Helped"
        value={stats.totalChildren.toLocaleString()}
        description="Across all regions"
        icon={<Users className="h-4 w-4 text-white" />}
        gradient
      />
      <StatCard
        title="Education Support"
        value={stats.educatedChildren.toLocaleString()}
        description="Children in education programs"
        icon={<GraduationCap className="h-4 w-4 text-white" />}
      />
      <StatCard
        title="Health Care"
        value={stats.healthyChildren.toLocaleString()}
        description="Children with good health status"
        icon={<Heart className="h-4 w-4 text-white" />}
      />
      <StatCard
        title="Impact Growth"
        value={`+${stats.impactGrowth}%`}
        description="Increase this month"
        icon={<TrendingUp className="h-4 w-4 text-white" />}
      />
    </div>
  );
};