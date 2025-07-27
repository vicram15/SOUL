import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Download, RefreshCw } from 'lucide-react';

interface DataFiltersProps {
  filters: {
    district: string;
    ageGroup: string;
    gender: string;
    educationStatus: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onExportData: () => void;
  onRefreshData: () => void;
  loading?: boolean;
}

export const DataFilters: React.FC<DataFiltersProps> = ({
  filters,
  onFilterChange,
  onExportData,
  onRefreshData,
  loading = false,
}) => {
  const districts = [
    'All Districts',
    'Mumbai Central',
    'Delhi North',
    'Kolkata East',
    'Pune West',
    'Chennai South',
    'Bangalore North',
    'Hyderabad Central',
    'Jaipur East',
    'Lucknow West',
    'Visakhapatnam',
  ];

  const ageGroups = [
    'All Ages',
    '0-5 years',
    '6-10 years',
    '11-15 years',
    '16-18 years',
  ];

  const genderOptions = ['All Genders', 'Male', 'Female', 'Other'];

  const educationStatuses = [
    'All Education Levels',
    'None',
    'Primary',
    'Secondary',
    'Higher Secondary',
    'Vocational',
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Data Filters & Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Children</Label>
          <Input
            id="search"
            placeholder="Search by name, location..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>District</Label>
            <Select
              value={filters.district}
              onValueChange={(value) => onFilterChange('district', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Age Group</Label>
            <Select
              value={filters.ageGroup}
              onValueChange={(value) => onFilterChange('ageGroup', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={filters.gender}
              onValueChange={(value) => onFilterChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Education Status</Label>
            <Select
              value={filters.educationStatus}
              onValueChange={(value) => onFilterChange('educationStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                {educationStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button
            onClick={onRefreshData}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button
            onClick={onExportData}
            className="flex items-center gap-2 gradient-accent text-white border-0"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};