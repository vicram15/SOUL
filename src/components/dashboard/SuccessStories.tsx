import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, ArrowRight } from 'lucide-react';

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  verified: boolean;
  child?: {
    name: string;
    age: number;
  };
}

interface SuccessStoriesProps {
  stories: SuccessStory[];
  onViewMore: () => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ stories, onViewMore }) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Success Stories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stories.slice(0, 3).map((story) => (
          <div key={story.id} className="p-4 rounded-lg gradient-card border transition-smooth hover:shadow-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{story.title}</h3>
              {story.verified && (
                <Badge className="gradient-accent text-white border-0">
                  <Heart className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            {story.child && (
              <div className="text-sm text-muted-foreground mb-2">
                {story.child.name}, {story.child.age} years old
              </div>
            )}
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {story.description}
            </p>
            <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
              Read more <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        ))}
        
        {stories.length > 3 && (
          <Button 
            onClick={onViewMore}
            className="w-full gradient-hero text-white border-0"
          >
            View All Success Stories ({stories.length} total)
          </Button>
        )}
      </CardContent>
    </Card>
  );
};