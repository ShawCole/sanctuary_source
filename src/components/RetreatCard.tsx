import { Program } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Star, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

interface RetreatCardProps {
  program: Program;
  variant?: 'overview' | 'explore';
}

export const RetreatCard = ({ program, variant = 'explore' }: RetreatCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (days: number) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    if (remainingDays === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
    return `${weeks}w ${remainingDays}d`;
  };

  const getGroupSizeIcon = (size: string) => {
    switch (size) {
      case 'small': return '4-8';
      case 'medium': return '8-16';
      case 'large': return '16+';
      default: return '8-16';
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-0 shadow-sm">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={program.images[0] || '/placeholder.svg'}
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-9 w-9 rounded-full backdrop-blur-sm transition-colors ${
            isSaved 
              ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          onClick={() => setIsSaved(!isSaved)}
        >
          <Heart className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
        </Button>
        
        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/95 text-gray-900 font-semibold">
            ${program.priceUSD.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Location */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900">
            {program.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {program.location.city}, {program.location.country}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(program.startDate)}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {getGroupSizeIcon(program.groupSize)}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {formatDuration(program.durationDays)}
          </Badge>
        </div>

        {/* Guide */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={program.guide.avatar} alt={program.guide.name} />
            <AvatarFallback>{program.guide.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-900">{program.guide.name}</span>
        </div>

        {/* Themes */}
        <div className="flex flex-wrap gap-2">
          {program.themes.slice(0, 3).map((theme) => (
            <Badge key={theme} variant="secondary" className="text-xs">
              {theme}
            </Badge>
          ))}
          {program.themes.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{program.themes.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{program.rating}</span>
          </div>
          <Button 
            className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand text-white"
            size="sm"
          >
            View Retreat
          </Button>
        </div>
      </div>
    </Card>
  );
};