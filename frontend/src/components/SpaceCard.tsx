import React from 'react';
import { MapPin, Users, Square, Clock, Star, Wifi, Car, Shield } from 'lucide-react';
import type { Space } from '../services/api';

interface SpaceCardProps {
  space: Space;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getSpaceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'garage':
        return <Car className="w-5 h-5" />;
      case 'backyard':
        return <Square className="w-5 h-5" />;
      case 'basement':
        return <Shield className="w-5 h-5" />;
      case 'attic':
        return <Square className="w-5 h-5" />;
      case 'warehouse':
        return <Square className="w-5 h-5" />;
      case 'parking_space':
        return <Car className="w-5 h-5" />;
      default:
        return <Square className="w-5 h-5" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) {
      return <Wifi className="w-4 h-4" />;
    }
    if (lowerAmenity.includes('parking') || lowerAmenity.includes('car')) {
      return <Car className="w-4 h-4" />;
    }
    if (lowerAmenity.includes('security') || lowerAmenity.includes('safe')) {
      return <Shield className="w-4 h-4" />;
    }
    return <Star className="w-4 h-4" />;
  };

  return (
    <div className="space-card">
      {/* Image Section */}
      <div className="space-image">
        {space.photos && space.photos.length > 0 ? (
          <img
            src={space.photos[0]}
            alt={space.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-6xl opacity-50">
              {getSpaceTypeIcon(space.space_type)}
            </div>
          </div>
        )}
        
        {/* Availability Badge */}
        <div className={`space-badge ${
          space.is_available 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {space.is_available ? 'Available' : 'Unavailable'}
        </div>

        {/* Space Type Badge */}
        <div className="space-type-badge">
          {getSpaceTypeIcon(space.space_type)}
          <span className="capitalize">{space.space_type.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-content">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="space-title line-clamp-2">
            {space.title}
          </h3>
          <div className="space-location">
            <MapPin className="w-4 h-4 mr-1 text-indigo-500" />
            <span>{space.city}, {space.state}</span>
          </div>
        </div>

        {/* Description */}
        <p className="space-description line-clamp-3">
          {space.description}
        </p>

        {/* Space Details */}
        <div className="space-details">
          {space.area_sqft && (
            <div className="space-detail">
              <Square className="w-4 h-4 mr-2 text-purple-500" />
              <span>{space.area_sqft} sq ft</span>
            </div>
          )}
          {space.max_capacity && (
            <div className="space-detail">
              <Users className="w-4 h-4 mr-2 text-pink-500" />
              <span>Up to {space.max_capacity} people</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {space.amenities && space.amenities.length > 0 && (
          <div className="space-amenities">
            <div className="flex flex-wrap gap-2">
              {space.amenities.slice(0, 3).map((amenity, index) => (
                <div
                  key={index}
                  className="amenity-tag"
                >
                  {getAmenityIcon(amenity)}
                  <span className="truncate max-w-20">{amenity}</span>
                </div>
              ))}
              {space.amenities.length > 3 && (
                <div className="amenity-tag">
                  +{space.amenities.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="space-pricing">
          <div>
            <div className="price-main">
              {formatPrice(space.price_per_hour)}
              <span className="price-unit">/hour</span>
            </div>
            {space.price_per_day && (
              <div className="price-secondary">
                {formatPrice(space.price_per_day)}/day
              </div>
            )}
          </div>
          <button className="view-details-btn">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
