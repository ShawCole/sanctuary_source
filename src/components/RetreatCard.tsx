import { Program } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';

interface RetreatCardProps {
  program: Program;
  variant?: 'overview' | 'explore';
  onThemeClick?: (theme: string) => void;
}

export const RetreatCard = ({ program, variant = 'explore', onThemeClick }: RetreatCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`;
    }
    return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
  };

  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-square mb-3 overflow-hidden rounded-xl">
        <img
          src={program.images[0] || '/placeholder.svg'}
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Heart Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur-sm transition-all ${
            isSaved 
              ? 'bg-white/90 text-red-500 hover:bg-white hover:scale-110' 
              : 'bg-black/20 text-white hover:bg-white/90 hover:text-red-500 hover:scale-110'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
        >
          <Heart className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Location and Rating */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 truncate">
            {program.location.city}, {program.location.country}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-gray-900 text-gray-900" />
            <span className="text-sm text-gray-900">{program.rating}</span>
          </div>
        </div>

        {/* Guide */}
        <p className="text-sm text-gray-600">
          with {program.guide.name}
        </p>

        {/* Dates */}
        <p className="text-sm text-gray-600">
          {formatDateRange(program.startDate, program.endDate)}
        </p>

        {/* Title - truncated */}
        <p className="text-sm text-gray-600 line-clamp-1">
          {program.title}
        </p>

        {/* Price */}
        <div className="pt-1">
          <span className="font-semibold text-gray-900">
            ${program.priceUSD.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600"> total</span>
        </div>

        {/* Themes - always visible */}
        <div className="flex flex-wrap gap-1 mt-1">
          {program.themes.slice(0, 2).map((theme) => (
            <Badge 
              key={theme} 
              variant="secondary" 
              className="text-xs px-2 py-0 cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onThemeClick?.(theme);
              }}
            >
              {theme}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};