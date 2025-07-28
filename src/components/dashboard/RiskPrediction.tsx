import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  district: string;
  location: string;
  education_status: 'none' | 'primary' | 'secondary' | 'higher_secondary' | 'vocational';
  health_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  guardian_name?: string;
  verified: boolean;
}

interface RiskPredictionProps {
  children: Child[];
}

export const RiskPrediction: React.FC<RiskPredictionProps> = ({ children }) => {
  // Risk prediction algorithm
  const calculateDropoutRisk = (child: Child) => {
    let risk = 0;
    
    // Age factor
    if (child.age > 16) risk += 30;
    else if (child.age > 14) risk += 20;
    else if (child.age < 6) risk += 10;
    
    // Education status factor
    if (child.education_status === 'none') risk += 40;
    else if (child.education_status === 'primary') risk += 25;
    
    // Health status factor
    if (child.health_status === 'poor' || child.health_status === 'critical') risk += 25;
    else if (child.health_status === 'fair') risk += 15;
    
    // Guardian presence factor
    if (!child.guardian_name) risk += 20;
    
    // Regional factor (some districts have higher dropout rates)
    const highRiskDistricts = ['Rural District A', 'Mountain Region'];
    if (highRiskDistricts.includes(child.district)) risk += 15;
    
    return Math.min(risk, 100);
  };

  const childrenWithRisk = children.map(child => ({
    ...child,
    dropoutRisk: calculateDropoutRisk(child)
  })).sort((a, b) => b.dropoutRisk - a.dropoutRisk);

  const highRiskChildren = childrenWithRisk.filter(child => child.dropoutRisk >= 70);
  const mediumRiskChildren = childrenWithRisk.filter(child => child.dropoutRisk >= 40 && child.dropoutRisk < 70);
  
  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'destructive';
    if (risk >= 40) return 'secondary';
    return 'default';
  };

  const getRiskIcon = (risk: number) => {
    if (risk >= 70) return <AlertTriangle className="h-4 w-4" />;
    if (risk >= 40) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highRiskChildren.length}</div>
            <p className="text-xs text-muted-foreground">Immediate intervention needed</p>
          </CardContent>
        </Card>
        
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Medium Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mediumRiskChildren.length}</div>
            <p className="text-xs text-muted-foreground">Close monitoring required</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Low Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {children.length - highRiskChildren.length - mediumRiskChildren.length}
            </div>
            <p className="text-xs text-muted-foreground">Stable situation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dropout Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {childrenWithRisk.slice(0, 10).map((child) => (
              <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getRiskIcon(child.dropoutRisk)}
                  <div>
                    <div className="font-medium">{child.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {child.age} years • {child.district} • {child.education_status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRiskColor(child.dropoutRisk)}>
                    {child.dropoutRisk}% risk
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};