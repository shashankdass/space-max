import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import SpaceCard from './SpaceCard';
import SpaceForm from './SpaceForm';
import { spaceService, type Space, type SpaceQueryParams } from '../services/api';

const SpaceList: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SpaceQueryParams>({
    page: 1,
    per_page: 12,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);


  const spaceTypes = [
    'garage',
    'backyard',
    'basement',
    'attic',
    'warehouse',
    'parking_space',
    'other'
  ];

  useEffect(() => {
    fetchSpaces();
  }, [filters]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await spaceService.getSpaces(filters);
      setSpaces(response.spaces);
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError('Failed to fetch spaces. Please try again.');
      console.error('Error fetching spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof SpaceQueryParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSpaceCreated = () => {
    fetchSpaces(); // Refresh the list after creating a new space
  };

  const handleCreateSpace = () => {
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="loading-container">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button
              onClick={fetchSpaces}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <SpaceForm
        onClose={() => setShowCreateForm(false)}
        onSpaceCreated={handleSpaceCreated}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="header">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="header-title">
                Discover Amazing Spaces
              </h1>
              <p className="header-description">
                Find the perfect space for your needs - from garages to backyards, 
                we have everything you're looking for.
              </p>
            </div>
            <button
              onClick={handleCreateSpace}
              className="btn-circle"
              title="Create Space"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search spaces by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button
                type="submit"
                className="search-btn"
              >
                Search
              </button>
            </div>
          </form>

          <div className="filters-grid">
            {/* Space Type Filter */}
            <div className="filter-group">
              <label className="filter-label">
                Space Type
              </label>
              <select
                value={filters.space_type || ''}
                onChange={(e) => handleFilterChange('space_type', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {spaceTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="filter-group">
              <label className="filter-label">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city..."
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Availability Filter */}
            <div className="filter-group">
              <label className="filter-label">
                Availability
              </label>
              <select
                value={filters.is_available === undefined ? '' : filters.is_available.toString()}
                onChange={(e) => handleFilterChange('is_available', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="filter-select"
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <p>Showing {spaces.length} spaces</p>
        </div>

        {/* Spaces Grid */}
        {spaces.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3 className="empty-title">No spaces found</h3>
            <p className="empty-description">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 gap-6 mb-8">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SpaceList;
