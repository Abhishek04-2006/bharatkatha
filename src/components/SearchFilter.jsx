import React, { useState, useCallback } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

export default function SearchFilter({ 
  onSearch, 
  onFilter, 
  states = [], 
  eras = [], 
  categories = [],
  showFavorites = true 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    state: '',
    era: '',
    category: '',
    difficulty: '',
    onlyFavorites: false,
  });

  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  }, [filters, onFilter]);

  const clearFilters = () => {
    const empty = {
      state: '',
      era: '',
      category: '',
      difficulty: '',
      onlyFavorites: false,
    };
    setFilters(empty);
    onFilter(empty);
    setSearchQuery('');
    onSearch('');
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search heritage, places, stories..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-card text-foreground text-sm font-medium transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-lg border border-border bg-card">
          {/* State Filter */}
          {states.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                State / Region
              </label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          )}

          {/* Era Filter */}
          {eras.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Historical Era
              </label>
              <select
                value={filters.era}
                onChange={(e) => handleFilterChange('era', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Eras</option>
                {eras.map(era => (
                  <option key={era} value={era}>{era}</option>
                ))}
              </select>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Difficulty Filter */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Favorites Filter */}
          {showFavorites && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-background cursor-pointer hover:bg-card transition-colors">
                <input
                  type="checkbox"
                  checked={filters.onlyFavorites}
                  onChange={(e) => handleFilterChange('onlyFavorites', e.target.checked)}
                  className="rounded border-border cursor-pointer"
                />
                <span className="text-sm font-medium text-foreground">Favorites Only</span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
