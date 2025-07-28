import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, TrendingUp, Heart, GraduationCap, Shield, FileText } from 'lucide-react';

interface ImpactTrackingProps {
  userProfile: any;
}

export const ImpactTracking: React.FC<ImpactTrackingProps> = ({ userProfile }) => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Simulated user's contribution data
  const contributionData = {
    totalDonated: 285000,
    childrenHelped: 67,
    projectsSupported: 8,
    regions: ['Mumbai', 'Pune', 'Delhi'],
    contributions: [
      {
        id: 1,
        date: '2024-01-15',
        amount: 150000,
        project: 'Education Support - Mumbai',
        childrenHelped: 42,
        status: 'Completed',
        outcomes: [
          'School enrollment completed for 42 children',
          'Educational materials provided (books, uniforms)',
          'Teacher training program conducted',
          'Digital learning setup in 3 schools'
        ],
        metrics: {
          schoolEnrollment: { before: 0, after: 42 },
          literacyRate: { before: 0, after: 85 },
          attendance: { before: 0, after: 92 }
        }
      },
      {
        id: 2,
        date: '2024-02-10',
        amount: 85000,
        project: 'Healthcare Initiative - Pune',
        childrenHelped: 18,
        status: 'In Progress',
        outcomes: [
          'Medical checkups completed for 18 children',
          'Vaccination drive conducted',
          'Nutrition supplements provided',
          'Health awareness sessions held'
        ],
        metrics: {
          healthImprovement: { before: 45, after: 89 },
          vaccination: { before: 60, after: 100 },
          nutrition: { before: 30, after: 85 }
        }
      },
      {
        id: 3,
        date: '2024-03-05',
        amount: 50000,
        project: 'Identity Documentation - Delhi',
        childrenHelped: 7,
        status: 'Completed',
        outcomes: [
          'Aadhaar cards obtained for 7 children',
          'Birth certificates processed',
          'School admission facilitated',
          'Government scheme enrollment'
        ],
        metrics: {
          documentation: { before: 0, after: 100 },
          schoolAdmission: { before: 0, after: 100 },
          governmentBenefits: { before: 0, after: 85 }
        }
      }
    ]
  };

  const generateImpactReport = () => {
    const reportData = {
      executiveSummary: {
        totalImpact: contributionData.childrenHelped,
        successRate: 94,
        completionRate: 87,
        regionalCoverage: contributionData.regions.length
      },
      keyAchievements: [
        'Successfully enrolled 42 children in formal education',
        'Improved health metrics for 18 children by 44%',
        'Facilitated complete documentation for 7 undocumented children',
        'Established digital learning infrastructure in 3 schools'
      ],
      financialBreakdown: {
        education: 60,
        healthcare: 30,
        documentation: 10
      }
    };
    return reportData;
  };

  const downloadReport = (format: 'pdf' | 'excel') => {
    // Simulate report download
    const reportData = generateImpactReport();
    const filename = `${userProfile?.organization_name}_Impact_Report_${new Date().getFullYear()}.${format}`;
    
    // Create a simple CSV for demo
    if (format === 'excel') {
      const csvContent = [
        'Project,Amount,Children Helped,Status,Completion Date',
        ...contributionData.contributions.map(c => 
          `${c.project},₹${c.amount},${c.childrenHelped},${c.status},${c.date}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'default';
      case 'in progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="gradient-accent text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(contributionData.totalDonated / 100000).toFixed(1)}L</div>
            <p className="text-xs opacity-90">Across all projects</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Children Helped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{contributionData.childrenHelped}</div>
            <p className="text-xs text-muted-foreground">Direct beneficiaries</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{contributionData.projectsSupported}</div>
            <p className="text-xs text-muted-foreground">Active & completed</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{contributionData.regions.length}</div>
            <p className="text-xs text-muted-foreground">Geographic coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Impact Tracking */}
      <Tabs defaultValue="contributions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="contributions">
          <div className="space-y-4">
            {contributionData.contributions.map((contribution) => (
              <Card key={contribution.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{contribution.project}</CardTitle>
                      <p className="text-sm text-muted-foreground">Contributed on {contribution.date}</p>
                    </div>
                    <Badge variant={getStatusColor(contribution.status)}>
                      {contribution.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-primary">₹{(contribution.amount / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-muted-foreground">Amount</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-primary">{contribution.childrenHelped}</div>
                      <div className="text-xs text-muted-foreground">Children</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-primary">94%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Achieved Outcomes:</h4>
                    <ul className="text-sm space-y-1">
                      {contribution.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full mt-2"></div>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outcomes">
          <Card>
            <CardHeader>
              <CardTitle>Before & After Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contributionData.contributions.map((contribution) => (
                  <div key={contribution.id}>
                    <h4 className="font-medium mb-3">{contribution.project}</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      {Object.entries(contribution.metrics).map(([metric, data]) => (
                        <div key={metric} className="p-4 border rounded-lg">
                          <div className="text-sm font-medium mb-2 capitalize">
                            {metric.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-lg font-bold text-red-600">{data.before}%</div>
                              <div className="text-xs text-muted-foreground">Before</div>
                            </div>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <div className="text-center">
                              <div className="text-lg font-bold text-emerald-600">{data.after}%</div>
                              <div className="text-xs text-muted-foreground">After</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Download Impact Reports</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get detailed reports of your CSR contributions and their impact
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-8 w-8 text-red-600" />
                      <div>
                        <h4 className="font-medium">Annual Impact Report</h4>
                        <p className="text-sm text-muted-foreground">Comprehensive overview with metrics</p>
                      </div>
                    </div>
                    <Button onClick={() => downloadReport('pdf')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">Data Export</h4>
                        <p className="text-sm text-muted-foreground">Raw data for analysis</p>
                      </div>
                    </div>
                    <Button onClick={() => downloadReport('excel')} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </Card>
                </div>

                {/* Report Preview */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base">Report Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold">{contributionData.childrenHelped}</div>
                        <div className="text-xs text-muted-foreground">Total Impact</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">94%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">87%</div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{contributionData.regions.length}</div>
                        <div className="text-xs text-muted-foreground">Regions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};