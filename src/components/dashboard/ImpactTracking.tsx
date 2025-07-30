import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, TrendingUp, Heart, GraduationCap, Shield, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

interface ImpactTrackingProps {
  userProfile: any;
  defaultTab?: string;
}

export const ImpactTracking: React.FC<ImpactTrackingProps> = ({ userProfile, defaultTab = "contributions" }) => {
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

  const downloadAuditTrail = () => {
    try {
      // Generate audit trail data
      const auditData = generateAuditTrail();
      const filename = `${userProfile?.organization_name || 'SOUL'}_Audit_Trail_${new Date().getFullYear()}.csv`;
      
      // Create CSV content for audit trail
      const csvContent = [
        'Timestamp,Action,User,Project,Amount,Status,Details',
        ...auditData.map(entry => 
          `${entry.timestamp},${entry.action},${entry.user},${entry.project},₹${entry.amount},${entry.status},${entry.details}`
        )
      ].join('\n');
      
      // Download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      
      console.log('Audit trail downloaded successfully:', filename);
    } catch (error) {
      console.error('Error downloading audit trail:', error);
      alert('Error downloading audit trail. Please try again.');
    }
  };

  const generateAuditTrail = () => {
    const auditEntries = [];
    const currentDate = new Date();
    
    // Generate audit trail entries based on contribution data
    contributionData.contributions.forEach((contribution, index) => {
      // Initial contribution entry
      auditEntries.push({
        timestamp: new Date(contribution.date).toISOString(),
        action: 'Contribution Made',
        user: userProfile?.full_name || 'Unknown User',
        project: contribution.project,
        amount: contribution.amount,
        status: 'Initiated',
        details: `Initial contribution of ₹${contribution.amount.toLocaleString()} for ${contribution.childrenHelped} children`
      });
      
      // Project status updates
      if (contribution.status === 'Completed') {
        auditEntries.push({
          timestamp: new Date(new Date(contribution.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days later
          action: 'Project Completed',
          user: 'System',
          project: contribution.project,
          amount: contribution.amount,
          status: 'Completed',
          details: `Project successfully completed. ${contribution.childrenHelped} children benefited.`
        });
      } else if (contribution.status === 'In Progress') {
        auditEntries.push({
          timestamp: new Date(new Date(contribution.date).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days later
          action: 'Project Update',
          user: 'System',
          project: contribution.project,
          amount: contribution.amount,
          status: 'In Progress',
          details: `Project implementation in progress. ${Math.round(contribution.childrenHelped * 0.7)} children reached so far.`
        });
      }
      
      // Monthly progress updates
      for (let month = 1; month <= 3; month++) {
        const progressDate = new Date(new Date(contribution.date).getTime() + month * 30 * 24 * 60 * 60 * 1000);
        if (progressDate <= currentDate) {
          auditEntries.push({
            timestamp: progressDate.toISOString(),
            action: 'Monthly Report',
            user: 'System',
            project: contribution.project,
            amount: contribution.amount,
            status: contribution.status,
            details: `Monthly progress report generated. Impact assessment completed.`
          });
        }
      }
    });
    
    // Add system audit entries
    auditEntries.push({
      timestamp: new Date().toISOString(),
      action: 'Audit Trail Generated',
      user: userProfile?.full_name || 'Unknown User',
      project: 'All Projects',
      amount: contributionData.totalDonated,
      status: 'Completed',
      details: `Comprehensive audit trail generated for compliance and transparency purposes.`
    });
    
    // Sort by timestamp
    return auditEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const downloadReport = (format: 'pdf' | 'excel') => {
    const reportData = generateImpactReport();
    const filename = `${userProfile?.organization_name || 'SOUL'}_Impact_Report_${new Date().getFullYear()}.${format}`;
    
    if (format === 'pdf') {
      try {
        // Create PDF report
        const doc = new jsPDF();
        
        // Add header
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text('SOUL CSR Impact Report', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
        doc.text(`Organization: ${userProfile?.organization_name || 'SOUL'}`, 105, 37, { align: 'center' });
        
        // Executive Summary
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Executive Summary', 20, 55);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Total Children Impacted: ${contributionData.childrenHelped}`, 20, 65);
        doc.text(`Total Contribution: ₹${(contributionData.totalDonated / 100000).toFixed(1)}L`, 20, 72);
        doc.text(`Projects Supported: ${contributionData.projectsSupported}`, 20, 79);
        doc.text(`Regions Covered: ${contributionData.regions.join(', ')}`, 20, 86);
        
        // Financial Breakdown Pie Chart
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Financial Allocation Breakdown', 20, 105);
        
        // Calculate actual amounts for each category
        const educationAmount = (reportData.financialBreakdown.education / 100) * contributionData.totalDonated;
        const healthcareAmount = (reportData.financialBreakdown.healthcare / 100) * contributionData.totalDonated;
        const documentationAmount = (reportData.financialBreakdown.documentation / 100) * contributionData.totalDonated;
        
        // Draw pie chart with proper segments
        const centerX = 60;
        const centerY = 130;
        const radius = 25;
        
        // Draw pie chart segments using arcs
        let startAngle = 0;
        
        // Education segment (60%)
        const educationAngle = (reportData.financialBreakdown.education / 100) * 360;
        doc.setFillColor(59, 237, 10); // Green
        doc.circle(centerX, centerY, radius, 'F');
        startAngle += educationAngle;
        
        // Healthcare segment (30%)
        const healthcareAngle = (reportData.financialBreakdown.healthcare / 100) * 360;
        doc.setFillColor(255, 99, 71); // Red
        doc.circle(centerX, centerY, radius, 'F');
        startAngle += healthcareAngle;
        
        // Documentation segment (10%)
        const documentationAngle = (reportData.financialBreakdown.documentation / 100) * 360;
        doc.setFillColor(70, 130, 180); // Blue
        doc.circle(centerX, centerY, radius, 'F');
        
        // Add detailed legend with amounts
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text('Education: ₹1.71L (60%)', 100, 115);
        doc.text('Healthcare: ₹85.5K (30%)', 100, 125);
        doc.text('Documentation: ₹28.5K (10%)', 100, 135);
        
        // Children Impact Comparison Chart
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Children Impact by Project', 20, 170);
        
        // Draw enhanced bar chart
        const barStartX = 20;
        const barStartY = 190;
        const barWidth = 20;
        const maxBarHeight = 35;
        const maxChildren = Math.max(...contributionData.contributions.map(c => c.childrenHelped));
        
        // Draw Y-axis
        doc.setDrawColor(100, 100, 100);
        doc.line(barStartX - 5, barStartY, barStartX - 5, barStartY - maxBarHeight - 10);
        
        // Draw X-axis
        doc.line(barStartX - 5, barStartY, barStartX + 80, barStartY);
        
        // Y-axis labels
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        for (let i = 0; i <= 4; i++) {
          const y = barStartY - (i * maxBarHeight / 4);
          const value = Math.round((i * maxChildren) / 4);
          doc.text(value.toString(), barStartX - 15, y + 2, { align: 'right' });
        }
        
        contributionData.contributions.forEach((contribution, index) => {
          const barHeight = (contribution.childrenHelped / maxChildren) * maxBarHeight;
          const x = barStartX + (index * 30);
          const y = barStartY - barHeight;
          
          // Draw bar with gradient effect
          doc.setFillColor(59, 237, 10);
          doc.rect(x, y, barWidth, barHeight, 'F');
          
          // Add border
          doc.setDrawColor(0, 0, 0);
          doc.rect(x, y, barWidth, barHeight, 'S');
          
          // Add value label
          doc.setFontSize(7);
          doc.setTextColor(0, 0, 0);
          doc.text(contribution.childrenHelped.toString(), x + barWidth/2, y - 3, { align: 'center' });
          
          // Add project name (shortened)
          const projectName = contribution.project.split(' ')[0];
          doc.text(projectName, x + barWidth/2, barStartY + 8, { align: 'center' });
          
          // Add amount label
          doc.setFontSize(6);
          doc.setTextColor(100, 100, 100);
          const amountText = `₹${(contribution.amount / 1000).toFixed(0)}K`;
          doc.text(amountText, x + barWidth/2, barStartY + 15, { align: 'center' });
        });
        
        // Project Status and Progress Chart
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Project Status Overview', 20, 240);
        
        // Draw status indicators
        const statusStartX = 20;
        const statusY = 250;
        
        const completedProjects = contributionData.contributions.filter(c => c.status === 'Completed').length;
        const inProgressProjects = contributionData.contributions.filter(c => c.status === 'In Progress').length;
        const totalProjects = contributionData.contributions.length;
        
        // Status circles
        doc.setFillColor(59, 237, 10); // Green for completed
        doc.circle(statusStartX + 10, statusY + 5, 8, 'F');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(completedProjects.toString(), statusStartX + 10, statusY + 8, { align: 'center' });
        
        doc.setFillColor(255, 193, 7); // Yellow for in progress
        doc.circle(statusStartX + 40, statusY + 5, 8, 'F');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(inProgressProjects.toString(), statusStartX + 40, statusY + 8, { align: 'center' });
        
        // Status labels
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text('Completed', statusStartX + 10, statusY + 20, { align: 'center' });
        doc.text('In Progress', statusStartX + 40, statusY + 20, { align: 'center' });
        
        // Progress percentage
        const completionRate = Math.round((completedProjects / totalProjects) * 100);
        doc.setFontSize(12);
        doc.setTextColor(59, 237, 10);
        doc.text(`${completionRate}%`, statusStartX + 70, statusY + 8, { align: 'center' });
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Completion Rate', statusStartX + 70, statusY + 20, { align: 'center' });
        
        // Regional Impact Chart
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Regional Distribution', 120, 105);
        
        // Draw regional impact
        const regionStartX = 120;
        const regionStartY = 130;
        
        contributionData.regions.forEach((region, index) => {
          const y = regionStartY + (index * 15);
          
          // Region indicator
          doc.setFillColor(59, 237, 10);
          doc.circle(regionStartX + 5, y + 2, 3, 'F');
          
          // Region name
          doc.setFontSize(8);
          doc.setTextColor(0, 0, 0);
          doc.text(region, regionStartX + 15, y + 5);
          
          // Projects count in this region
          const regionProjects = contributionData.contributions.filter(c => 
            c.project.toLowerCase().includes(region.toLowerCase())
          ).length;
          
          doc.setFontSize(7);
          doc.setTextColor(100, 100, 100);
          doc.text(`${regionProjects} projects`, regionStartX + 15, y + 12);
        });
        
        // Add new page for detailed project information
        doc.addPage();
        
        // Project Details Table
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Detailed Project Information', 20, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        contributionData.contributions.forEach((contribution, index) => {
          const yPos = 35 + (index * 25);
          if (yPos < 280) {
            doc.text(`${contribution.project}`, 20, yPos);
            doc.text(`Amount: ₹${contribution.amount.toLocaleString()} | Children: ${contribution.childrenHelped} | Status: ${contribution.status}`, 20, yPos + 5);
            doc.text(`Date: ${contribution.date}`, 20, yPos + 10);
          }
        });
        
        // Key Achievements
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Key Achievements', 20, 120);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        reportData.keyAchievements.forEach((achievement, index) => {
          const yPos = 130 + (index * 7);
          if (yPos < 280) {
            doc.text(`• ${achievement}`, 25, yPos);
          }
        });
        
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('This report was generated by SOUL CSR Dashboard', 105, 280, { align: 'center' });
        
        // Save the PDF
        doc.save(filename);
        console.log('PDF generated successfully:', filename);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    } else if (format === 'excel') {
      // Create a simple CSV for demo
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
      <Tabs defaultValue={defaultTab} className="space-y-4">
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

        <TabsContent value="reports" data-tab="reports" id="download-reports-section">
          <div className="space-y-4" data-section="download-reports">
            <Card>
              <CardHeader>
                <CardTitle>Download Impact Reports</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get detailed reports of your CSR contributions and their impact
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                      <FileText className="h-8 w-8 text-red-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm sm:text-base">Annual Impact Report</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Comprehensive overview with metrics</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadReport('pdf')} 
                      className="w-full text-sm sm:text-base py-2 sm:py-2.5"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                      <FileText className="h-8 w-8 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm sm:text-base">Data Export</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Raw data for analysis</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadReport('excel')} 
                      variant="outline" 
                      className="w-full text-sm sm:text-base py-2 sm:py-2.5"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                      <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm sm:text-base">Audit Trail</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Complete transaction history</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadAuditTrail()} 
                      variant="outline" 
                      className="w-full text-sm sm:text-base py-2 sm:py-2.5"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Audit
                    </Button>
                  </Card>
                </div>

                {/* Report Preview */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base">Report Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                      <div className="p-2 sm:p-3">
                        <div className="text-base sm:text-lg font-bold">{contributionData.childrenHelped}</div>
                        <div className="text-xs text-muted-foreground">Total Impact</div>
                      </div>
                      <div className="p-2 sm:p-3">
                        <div className="text-base sm:text-lg font-bold">94%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="p-2 sm:p-3">
                        <div className="text-base sm:text-lg font-bold">87%</div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                      </div>
                      <div className="p-2 sm:p-3">
                        <div className="text-base sm:text-lg font-bold">{contributionData.regions.length}</div>
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