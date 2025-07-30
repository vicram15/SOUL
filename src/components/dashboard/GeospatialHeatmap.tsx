import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  district: string;
  location: string;
  verified: boolean;
}

interface GeospatialHeatmapProps {
  children: Child[];
}

export const GeospatialHeatmap: React.FC<GeospatialHeatmapProps> = ({ children }) => {
  const [selectedView, setSelectedView] = useState<'density' | 'funding' | 'map'>('density');

  // Process data for heatmap visualization
  const processHeatmapData = () => {
    const districtData = children.reduce((acc, child) => {
      const district = child.district;
      if (!acc[district]) {
        acc[district] = {
          count: 0,
          verified: 0,
          locations: new Set(),
          fundingNeed: 0,
          currentFunding: 0,
        };
      }
      
      acc[district].count++;
      if (child.verified) acc[district].verified++;
      acc[district].locations.add(child.location);
      acc[district].fundingNeed += 15000; // Average funding need per child
      acc[district].currentFunding += Math.random() * 10000; // Simulated current funding
      
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(districtData).map(([district, data]) => ({
      district,
      ...data,
      locations: data.locations.size,
      density: data.count,
      fundingGap: data.fundingNeed - data.currentFunding,
      priority: data.count > 20 ? 'high' : data.count > 10 ? 'medium' : 'low',
    })).sort((a, b) => b.density - a.density);
  };

  const heatmapData = processHeatmapData();

  const getDensityColor = (density: number) => {
    if (density > 20) return 'bg-red-500';
    if (density > 15) return 'bg-orange-500';
    if (density > 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getFundingColor = (gap: number) => {
    if (gap > 100000) return 'bg-red-500';
    if (gap > 50000) return 'bg-orange-500';
    if (gap > 25000) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={selectedView === 'density' ? 'default' : 'outline'}
          onClick={() => setSelectedView('density')}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Child Density
        </Button>
        <Button
          variant={selectedView === 'funding' ? 'default' : 'outline'}
          onClick={() => setSelectedView('funding')}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Funding Gaps
        </Button>
        <Button
          type="button"
          variant={selectedView === 'map' ? 'default' : 'outline'}
          onClick={() => setSelectedView('map')}
          className="flex items-center gap-2"
        >
          <Map className="h-4 w-4" />
          Visualize
        </Button>
      </div>

      {/* Heatmap Visualization */}
      {selectedView !== 'map' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              {selectedView === 'density' ? 'Child Density Heatmap' : 'Funding Gap Heatmap'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {heatmapData.map((region) => (
                <Card key={region.district} className="relative overflow-hidden">
                  <div 
                    className={`absolute top-0 right-0 w-4 h-4 rounded-bl-lg ${
                      selectedView === 'density' 
                        ? getDensityColor(region.density)
                        : getFundingColor(region.fundingGap)
                    }`}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{region.district}</CardTitle>
                    <Badge variant={getPriorityVariant(region.priority)} className="w-fit">
                      {region.priority} priority
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Children:</span>
                      <span className="font-medium">{region.count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Verified:</span>
                      <span className="font-medium">{region.verified}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Locations:</span>
                      <span className="font-medium">{region.locations}</span>
                    </div>
                    {selectedView === 'funding' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Funding Need:</span>
                          <span className="font-medium">₹{(region.fundingNeed / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Gap:</span>
                          <span className="font-medium text-red-600">₹{(region.fundingGap / 1000).toFixed(0)}K</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indian Map Heatmap Visualization */}
      {selectedView === 'map' && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              India Funding Gap Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-96 bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg shadow-inner">
              <span className="text-lg text-blue-900 font-semibold">[Indian Map Heatmap Visualization Here]</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              <span>Each region is colored by funding gap intensity. Integrate a real map for production use.</span>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#ef4444' }} /> High</div>
              <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#f59e42' }} /> Medium</div>
              <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#fde047' }} /> Low</div>
              <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#22c55e' }} /> Minimal</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">
                {selectedView === 'density' ? 'Child Density' : 'Funding Gap'}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">
                    {selectedView === 'density' ? '20+ children' : '₹100K+ gap'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">
                    {selectedView === 'density' ? '15-20 children' : '₹50K-100K gap'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">
                    {selectedView === 'density' ? '10-15 children' : '₹25K-50K gap'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">
                    {selectedView === 'density' ? '<10 children' : '<₹25K gap'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Priority Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">High Priority - Immediate intervention needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Medium Priority - Monitoring required</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Low Priority - Stable situation</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};