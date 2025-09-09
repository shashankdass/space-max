import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { spaceService, type SpaceCreateData } from '../services/api';

interface SpaceFormProps {
  onClose: () => void;
  onSpaceCreated: () => void;
}

const SpaceForm: React.FC<SpaceFormProps> = ({ onClose, onSpaceCreated }) => {
  const [formData, setFormData] = useState<SpaceCreateData>({
    title: '',
    description: '',
    space_type: 'garage',
    location: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
    price_per_hour: 0,
    price_per_day: 0,
    price_per_week: 0,
    price_per_month: 0,
    area_sqft: 0,
    max_capacity: 1,
    amenities: [],
    is_available: true,
    available_from: '',
    available_until: '',
    photos: [],
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const spaceTypes = [
    'garage',
    'backyard',
    'basement',
    'attic',
    'warehouse',
    'parking_space',
    'other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const parseApiErrors = (error: any) => {
    const errors: Record<string, string> = {};
    
    if (error.response?.data?.detail && Array.isArray(error.response.data.detail)) {
      error.response.data.detail.forEach((err: any) => {
        if (err.loc && err.loc.length >= 2) {
          const fieldName = err.loc[err.loc.length - 1]; // Get the last item in loc array
          errors[fieldName] = err.msg;
        }
      });
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    // Frontend validation: ensure exactly one price field is provided
    const priceFields = [
      formData.price_per_hour,
      formData.price_per_day,
      formData.price_per_week,
      formData.price_per_month
    ];
    const providedPrices = priceFields.filter(price => price && price > 0);
    
    if (providedPrices.length === 0) {
      setError('Please provide exactly one price (hourly, daily, weekly, or monthly).');
      setLoading(false);
      return;
    } else if (providedPrices.length > 1) {
      setError('Please provide only one price option. Choose either hourly, daily, weekly, or monthly pricing.');
      setLoading(false);
      return;
    }

    // Clean the data - only send non-zero price fields
    const cleanedData = {
      ...formData,
      price_per_hour: (formData.price_per_hour && formData.price_per_hour > 0) ? formData.price_per_hour : undefined,
      price_per_day: (formData.price_per_day && formData.price_per_day > 0) ? formData.price_per_day : undefined,
      price_per_week: (formData.price_per_week && formData.price_per_week > 0) ? formData.price_per_week : undefined,
      price_per_month: (formData.price_per_month && formData.price_per_month > 0) ? formData.price_per_month : undefined,
      area_sqft: (formData.area_sqft && formData.area_sqft > 0) ? formData.area_sqft : undefined,
      max_capacity: (formData.max_capacity && formData.max_capacity > 0) ? formData.max_capacity : undefined,
      available_from: formData.available_from || undefined,
      available_until: formData.available_until || undefined,
    };

    try {
      await spaceService.createSpace(cleanedData);
      onSpaceCreated();
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        space_type: 'garage',
        location: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'US',
        price_per_hour: 0,
        price_per_day: 0,
        price_per_week: 0,
        price_per_month: 0,
        area_sqft: 0,
        max_capacity: 1,
        amenities: [],
        is_available: true,
        available_from: '',
        available_until: '',
        photos: [],
      });
    } catch (err: any) {
      const fieldValidationErrors = parseApiErrors(err);
      
      if (Object.keys(fieldValidationErrors).length > 0) {
        setFieldErrors(fieldValidationErrors);
        setError('Please fix the errors below and try again.');
      } else {
        setError('Failed to create space. Please try again.');
      }
      
      console.error('Error creating space:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Create New Space</h2>
            <button
              onClick={onClose}
              className="btn-circle"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  fieldErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter space title"
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all ${
                  fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your space in detail"
              />
              {fieldErrors.description && (
                <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Space Type *
                </label>
                <select
                id="space_type"
                value={formData.space_type}
                onChange={(e) => setFormData({ ...formData, space_type: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  fieldErrors.space_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                  {spaceTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
              </select>
                {fieldErrors.space_type && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.space_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Downtown District"
                />
                {fieldErrors.location && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  fieldErrors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Street address"
              />
              {fieldErrors.address && (
                <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City"
                />
                {fieldErrors.city && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="State"
                />
                {fieldErrors.state && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.zip_code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ZIP Code"
                />
                {fieldErrors.zip_code && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.zip_code}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Hour ($)
                </label>
                <input
                  type="number"
                  name="price_per_hour"
                  value={formData.price_per_hour || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.price_per_hour ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {fieldErrors.price_per_hour && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.price_per_hour}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day ($)
                </label>
                <input
                  type="number"
                  name="price_per_day"
                  value={formData.price_per_day || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.price_per_day ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {fieldErrors.price_per_day && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.price_per_day}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Week ($)
                </label>
                <input
                  type="number"
                  name="price_per_week"
                  value={formData.price_per_week || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.price_per_week ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {fieldErrors.price_per_week && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.price_per_week}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Month ($)
                </label>
                <input
                  type="number"
                  name="price_per_month"
                  value={formData.price_per_month || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.price_per_month ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {fieldErrors.price_per_month && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.price_per_month}</p>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area_sqft"
                  value={formData.area_sqft || ''}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.area_sqft ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Optional"
                />
                {fieldErrors.area_sqft && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.area_sqft}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Capacity
                </label>
                <input
                  type="number"
                  name="max_capacity"
                  value={formData.max_capacity || ''}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.max_capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add an amenity"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Available for booking</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From
                </label>
                <input
                  type="datetime-local"
                  name="available_from"
                  value={formData.available_from}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.available_from ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.available_from && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.available_from}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Until
                </label>
                <input
                  type="datetime-local"
                  name="available_until"
                  value={formData.available_until}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    fieldErrors.available_until ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {fieldErrors.available_until && (
                  <p className="mt-1 text-sm font-medium" style={{ color: '#dc2626' }}>{fieldErrors.available_until}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-full font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 px-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Space...' : 'Create Space'}
                </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SpaceForm;
