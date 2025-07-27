import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Heart, IndianRupee, Target, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DonationSectionProps {
  totalDonations: number;
  childrenSupported: number;
  impactGrowth: number;
}

export const DonationSection: React.FC<DonationSectionProps> = ({
  totalDonations,
  childrenSupported,
  impactGrowth,
}) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [1000, 2500, 5000, 10000, 25000, 50000];
  const purposeOptions = [
    'Education Support',
    'Healthcare',
    'Nutrition Programs',
    'Shelter & Safety',
    'Skill Development',
    'Emergency Relief',
    'General Support',
  ];

  const handleDonate = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a donation",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !purpose) {
      toast({
        title: "Missing Information",
        description: "Please select an amount and purpose for your donation",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          donor_id: user.id,
          amount: parseFloat(amount),
          purpose: `${purpose}${description ? ` - ${description}` : ''}`,
          beneficiary_children_count: Math.floor(parseFloat(amount) / 1000), // Estimate 1 child per ₹1000
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Donation Initiated",
        description: "Thank you for your contribution! Your donation is being processed.",
      });

      // Reset form
      setAmount('');
      setPurpose('');
      setDescription('');
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Impact Statistics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your CSR Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg gradient-card">
              <div className="flex items-center justify-center mb-2">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                ₹{totalDonations.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Donated</div>
            </div>
            <div className="text-center p-3 rounded-lg gradient-card">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent">
                {childrenSupported}
              </div>
              <div className="text-xs text-muted-foreground">Children Helped</div>
            </div>
            <div className="text-center p-3 rounded-lg gradient-card">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                +{impactGrowth}%
              </div>
              <div className="text-xs text-muted-foreground">Impact Growth</div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <h4 className="font-semibold text-accent mb-2">Impact Multiplier</h4>
            <p className="text-sm text-muted-foreground">
              Your contributions have a ripple effect! Every ₹1,000 donated provides education 
              support for one child for a month, including books, uniforms, and nutritional meals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Donation Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Make a CSR Contribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Predefined Amounts */}
          <div className="space-y-2">
            <Label>Quick Amount Selection</Label>
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset.toString() ? "default" : "outline"}
                  onClick={() => setAmount(preset.toString())}
                  className="text-sm"
                >
                  ₹{preset.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label>Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger>
                <SelectValue placeholder="Select donation purpose" />
              </SelectTrigger>
              <SelectContent>
                {purposeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Specific requirements or dedication message..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Donation Button */}
          <Button
            onClick={handleDonate}
            disabled={loading || !amount || !purpose}
            className="w-full gradient-hero text-white border-0 hover:opacity-90"
          >
            {loading ? 'Processing...' : `Donate ₹${amount || '0'}`}
          </Button>

          {/* Compliance Note */}
          <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <strong>CSR Compliance:</strong> This donation will generate proper CSR documentation 
            and impact reports as per Section 135 of the Companies Act, 2013.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};