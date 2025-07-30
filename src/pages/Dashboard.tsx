import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DataFilters } from '@/components/dashboard/DataFilters';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { ChildrenTable } from '@/components/dashboard/ChildrenTable';
import { SuccessStories } from '@/components/dashboard/SuccessStories';
import { DonationSection } from '@/components/dashboard/DonationSection';
import { RiskPrediction } from '@/components/dashboard/RiskPrediction';
import { FundingForecast } from '@/components/dashboard/FundingForecast';
import { GeospatialHeatmap } from '@/components/dashboard/GeospatialHeatmap';
import { CSRSuggestions } from '@/components/dashboard/CSRSuggestions';
import { ImpactTracking } from '@/components/dashboard/ImpactTracking';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Heart, Building2 } from 'lucide-react';

// Helper for fetch with timeout
const fetchWithTimeout = (url: string, options = {}, timeout = 10000) =>
  Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    ),
  ]);

export const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    district: 'All Districts',
    ageGroup: 'All Ages',
    gender: 'All Genders',
    educationStatus: 'All Education Levels',
    search: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [children, filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [childrenRes, storiesRes] = await Promise.all([
        fetchWithTimeout('https://soul-7w0s.onrender.com/api/children') as Promise<Response>,
        fetchWithTimeout('https://soul-7w0s.onrender.com/api/success-stories') as Promise<Response>
      ]);
      const childrenData = await childrenRes.json();
      const storiesData = await storiesRes.json();
      setChildren(Array.isArray(childrenData) ? childrenData : []);
      setSuccessStories(Array.isArray(storiesData) ? storiesData : []);
    } catch (error) {
      setError('Failed to load data. Please check your connection and try again.');
      setChildren([]);
      setSuccessStories([]);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = children.filter(child => {
      if (
        filters.search &&
        !child.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !child.location.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.district !== 'All Districts' && child.district !== filters.district)
        return false;
      if (filters.gender !== 'All Genders' && child.gender !== filters.gender.toLowerCase())
        return false;
      if (
        filters.educationStatus !== 'All Education Levels' &&
        child.education_status !== filters.educationStatus.toLowerCase().replace(' ', '_')
      )
        return false;

      if (filters.ageGroup !== 'All Ages') {
        const ageRanges = {
          '0-5 years': [0, 5],
          '6-10 years': [6, 10],
          '11-15 years': [11, 15],
          '16-18 years': [16, 18],
        };
        const [min, max] = ageRanges[filters.ageGroup] || [0, 100];
        if (child.age < min || child.age > max) return false;
      }

      return true;
    });
    setFilteredChildren(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Name,Age,Gender,District,Location,Education,Health\n' +
      filteredChildren
        .map(
          child =>
            `${child.name},${child.age},${child.gender},${child.district},${child.location},${child.education_status},${child.health_status}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'children_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    totalChildren: children.length,
    educatedChildren: children.filter(c => c.education_status !== 'none').length,
    healthyChildren: children.filter(c => ['excellent', 'good'].includes(c.health_status)).length,
    impactGrowth: 24,
  };

  // Remove the loading page; always render dashboard content
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-hero">
                <img src="/LOGO.png" alt="SOUL Logo" className="h-15 w-10 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SOUL CSR DASHBOARD</h1>
                <p className="text-sm text-muted-foreground">Supporting Outreach for Uplifting Lives</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium">{profile?.full_name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  {profile?.role === 'corporate' ? (
                    <Building2 className="h-3 w-3" />
                  ) : (
                    <Heart className="h-3 w-3" />
                  )}
                  {profile?.organization_name}
                </div>
              </div>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <DashboardStats stats={stats} />

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="predictions">AI Insights</TabsTrigger>
              <TabsTrigger value="suggestions">CSR Suggestions</TabsTrigger>
              <TabsTrigger value="impact">My Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <DataFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onExportData={handleExportData}
                onRefreshData={fetchData}
                loading={loading}
              />
              <ChartsSection children={filteredChildren} />
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ChildrenTable children={filteredChildren} onViewChild={console.log} />
                </div>
                <div>
                  <SuccessStories stories={successStories} onViewMore={() => {}} />
                </div>
              </div>
              <DonationSection totalDonations={75000} childrenSupported={45} impactGrowth={18} />
            </TabsContent>

            <TabsContent value="analytics">
              <FundingForecast children={filteredChildren} />
            </TabsContent>

            <TabsContent value="heatmap">
              <GeospatialHeatmap children={filteredChildren} />
            </TabsContent>

            <TabsContent value="predictions">
              <RiskPrediction children={filteredChildren} />
            </TabsContent>

            <TabsContent value="suggestions">
              <CSRSuggestions userProfile={profile} children={filteredChildren} />
            </TabsContent>

            <TabsContent value="impact">
              <ImpactTracking userProfile={profile} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
