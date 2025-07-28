import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, Heart, TrendingUp, MapPin, Users } from 'lucide-react';

interface CSRSuggestionsProps {
  userProfile: any;
  children: any[];
}

export const CSRSuggestions: React.FC<CSRSuggestionsProps> = ({ userProfile, children }) => {
  // Generate smart suggestions based on user profile and data trends
  const generateSuggestions = () => {
    const suggestions = [
      {
        id: 1,
        title: 'Education Crisis in Rural Maharashtra',
        description: '78 children without primary education need immediate intervention',
        impact: 'High',
        urgency: 'Critical',
        estimatedCost: 180000,
        children: 78,
        region: 'Rural Maharashtra',
        category: 'Education',
        icon: <Users className="h-5 w-5" />,
        reasons: [
          'Highest concentration of uneducated children',
          'Low funding coverage (53%)',
          'Matches your previous education-focused donations'
        ],
        expectedOutcomes: [
          'School enrollment for 78 children',
          'Provision of educational materials',
          'Teacher training programs'
        ]
      },
      {
        id: 2,
        title: 'Healthcare Support in Urban Mumbai',
        description: '23 children require critical healthcare interventions',
        impact: 'High',
        urgency: 'Immediate',
        estimatedCost: 125000,
        children: 23,
        region: 'Urban Mumbai',
        category: 'Healthcare',
        icon: <Heart className="h-5 w-5" />,
        reasons: [
          '15 children in critical health condition',
          'Urban healthcare costs are rising',
          'Your organization has medical industry connections'
        ],
        expectedOutcomes: [
          'Medical treatment for critical cases',
          'Regular health checkups',
          'Vaccination programs'
        ]
      },
      {
        id: 3,
        title: 'Digital Literacy Program - Bangalore',
        description: 'Bridge the digital divide for 45 children in urban areas',
        impact: 'Medium',
        urgency: 'Moderate',
        estimatedCost: 95000,
        children: 45,
        region: 'Bangalore Urban',
        category: 'Digital Education',
        icon: <TrendingUp className="h-5 w-5" />,
        reasons: [
          'Growing demand for digital skills',
          'Tech industry presence in Bangalore',
          'Aligns with future skill requirements'
        ],
        expectedOutcomes: [
          'Computer literacy for 45 children',
          'Digital learning resources',
          'Future job readiness'
        ]
      }
    ];

    return suggestions;
  };

  const suggestions = generateSuggestions();

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'immediate': return 'destructive';
      case 'moderate': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-hero text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Smart CSR Recommendations for {userProfile?.organization_name}
          </CardTitle>
          <p className="text-white/90">
            AI-powered suggestions based on current needs, your contribution history, and maximum impact potential
          </p>
        </CardHeader>
      </Card>

      {/* Suggestions */}
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <Card key={suggestion.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {suggestion.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">{suggestion.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant={getImpactColor(suggestion.impact)}>
                    {suggestion.impact} Impact
                  </Badge>
                  <Badge variant={getUrgencyColor(suggestion.urgency)}>
                    {suggestion.urgency}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">₹{(suggestion.estimatedCost / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-muted-foreground">Estimated Cost</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{suggestion.children}</div>
                  <div className="text-xs text-muted-foreground">Children Helped</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-bold text-primary flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {suggestion.region}
                  </div>
                  <div className="text-xs text-muted-foreground">Target Region</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-bold text-primary">{suggestion.category}</div>
                  <div className="text-xs text-muted-foreground">Focus Area</div>
                </div>
              </div>

              {/* Why This Suggestion */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Why this makes maximum impact:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {suggestion.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full mt-2"></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Outcomes */}
              <div>
                <h4 className="font-medium mb-2">Expected Outcomes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {suggestion.expectedOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2"></div>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
                  Contribute ₹{(suggestion.estimatedCost / 1000).toFixed(0)}K
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
                <Button variant="outline">
                  Partial Funding
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Impact Summary */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Potential Combined Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">146</div>
              <div className="text-sm text-emerald-700">Children Helped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">₹4L</div>
              <div className="text-sm text-emerald-700">Total Investment</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">3</div>
              <div className="text-sm text-emerald-700">Regions Covered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">85%</div>
              <div className="text-sm text-emerald-700">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};