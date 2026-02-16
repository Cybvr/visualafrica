"use client";

import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { vendors, VENDOR_CATEGORIES, EVENT_THEMES } from '@/lib/vendors-data';
import VendorCard from '@/components/dashboard/VendorCard';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

// Extract unique locations from vendor data
const LOCATIONS = Array.from(new Set(vendors.flatMap(v => {
  // Extract city from location string (e.g., "Lekki, Lagos" -> "Lagos")
  const parts = v.location.split(',').map(p => p.trim());
  return parts[parts.length - 1]; // Get the last part (city/state)
}))).sort();

const VENDOR_TYPES = ['All', 'Experiences', 'Regular Vendors'];

const FilterSidebar: React.FC<{
  searchQuery: string;
  selectedCategories: string[];
  selectedThemes: string[];
  selectedLocations: string[];
  selectedType: string;
  priceRange: [number, number];
  onSearchChange: (query: string) => void;
  onCategoryChange: (cat: string) => void;
  onThemeChange: (theme: string) => void;
  onLocationChange: (loc: string) => void;
  onTypeChange: (type: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearAll: () => void;
}> = ({
  searchQuery,
  selectedCategories,
  selectedThemes,
  selectedLocations,
  selectedType,
  priceRange,
  onSearchChange,
  onCategoryChange,
  onThemeChange,
  onLocationChange,
  onTypeChange,
  onPriceChange,
  onClearAll,
}) => {
    const [expandedSections, setExpandedSections] = useState({
      search: true,
      type: true,
      categories: true,
      themes: true,
      location: true,
      price: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
      <div className="space-y-6 ">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Filters</h3>
          <button onClick={onClearAll} className="text-sm text-primary font-bold hover:underline">
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('search')}
            className="flex items-center justify-between w-full text-sm font-bold text-foreground"
          >
            Search
            <ChevronDown
              size={16}
              className={`transition-transform ${expandedSections.search ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.search && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}
        </div>

        {/* Vendor Type */}
        <div className="space-y-3 pt-4 border-t border-border">
          <button
            onClick={() => toggleSection('type')}
            className="flex items-center justify-between w-full text-sm font-bold text-foreground"
          >
            Type
            <ChevronDown
              size={16}
              className={`transition-transform ${expandedSections.type ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.type && (
            <div className="space-y-2 pl-1">
              {VENDOR_TYPES.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={selectedType === type}
                    onCheckedChange={() => onTypeChange(type)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-3 pt-4 border-t border-border">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-sm font-bold text-foreground"
          >
            Categories
            <ChevronDown
              size={16}
              className={`transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.categories && (
            <div className="space-y-2 pl-1">
              {VENDOR_CATEGORIES.filter(cat => cat !== 'All Categories').map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => onCategoryChange(cat)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Themes */}
        <div className="space-y-3 pt-4 border-t border-border">
          <button
            onClick={() => toggleSection('themes')}
            className="flex items-center justify-between w-full text-sm font-bold text-foreground"
          >
            Themes
            <ChevronDown
              size={16}
              className={`transition-transform ${expandedSections.themes ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.themes && (
            <div className="space-y-2 pl-1">
              {EVENT_THEMES.filter(theme => theme !== 'All Themes').map(theme => (
                <label key={theme} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={selectedThemes.includes(theme)}
                    onCheckedChange={() => onThemeChange(theme)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">
                    {theme}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-3 pt-4 border-t border-border">
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-sm font-bold text-foreground"
          >
            Location
            <ChevronDown
              size={16}
              className={`transition-transform ${expandedSections.location ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.location && (
            <div className="space-y-2 pl-1">
              {LOCATIONS.map(loc => (
                <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    checked={selectedLocations.includes(loc)}
                    onCheckedChange={() => onLocationChange(loc)}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground">
                    {loc}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-3 pt-4 border-t border-border">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-sm font-bold text-foreground"
          >
            Price
            <ChevronDown
              size={16}
              className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.price && (
            <div className="space-y-4 pl-1">
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceChange(value as [number, number])}
                min={0}
                max={10000000}
                step={100000}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>₦{priceRange[0].toLocaleString()}</span>
                <span>₦{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

const Vendors: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedThemes([]);
    setSelectedLocations([]);
    setSelectedType('All');
    setPriceRange([0, 10000000]);
  };

  // Apply filters
  let filteredVendors = vendors;

  // Filter by type (Experiences vs Regular Vendors)
  if (selectedType === 'Experiences') {
    filteredVendors = filteredVendors.filter(v => v.categories.includes('Experiences'));
  } else if (selectedType === 'Regular Vendors') {
    filteredVendors = filteredVendors.filter(v => !v.categories.includes('Experiences'));
  }

  if (selectedCategories.length > 0) {
    filteredVendors = filteredVendors.filter(v =>
      v.categories.some(cat => selectedCategories.includes(cat))
    );
  }

  if (selectedThemes.length > 0) {
    filteredVendors = filteredVendors.filter(v =>
      v.eventThemes.some(theme => selectedThemes.includes(theme))
    );
  }

  if (selectedLocations.length > 0) {
    filteredVendors = filteredVendors.filter(v =>
      selectedLocations.some(loc => v.location.includes(loc))
    );
  }

  if (searchQuery) {
    filteredVendors = filteredVendors.filter(v =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const displayVendors = activeTab === 'all' ? filteredVendors : filteredVendors.slice(0, 3);

  const filterSidebar = (
    <FilterSidebar
      searchQuery={searchQuery}
      selectedCategories={selectedCategories}
      selectedThemes={selectedThemes}
      selectedLocations={selectedLocations}
      selectedType={selectedType}
      priceRange={priceRange}
      onSearchChange={setSearchQuery}
      onCategoryChange={toggleCategory}
      onThemeChange={toggleTheme}
      onLocationChange={toggleLocation}
      onTypeChange={setSelectedType}
      onPriceChange={setPriceRange}
      onClearAll={clearAllFilters}
    />
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Filter Button */}
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="rounded-full">
              <Filter size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-6 overflow-y-auto">
            {filterSidebar}
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4 border-r pr-4  max-h-[calc(100vh-120px)] overflow-y-auto">
            {filterSidebar}
          </div>
        </aside>

        {/* Vendors area: tabs + grid */}
        <div className="flex-1 space-y-2 ">
          {/* Tabs */}
          <div className="flex items-center border-b border-border">
            <button
              onClick={() => setActiveTab('all')}
              className={`p-2 text-sm font-black transition-all border-b-2 ${activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                }`}
            >
              All Vendors
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`p-2 text-sm font-black transition-all border-b-2 ${activeTab === 'saved'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                }`}
            >
              Saved Vendors
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {displayVendors.map(vendor => (
              <div key={vendor.id} onClick={() => router.push(`/dashboard/hosts/vendor/${vendor.slug}`)} className="cursor-pointer">
                <VendorCard {...vendor} />
              </div>
            ))}
          </div>

          {displayVendors.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-border">
              <p className="text-muted-foreground font-bold">No vendors found matching your filters.</p>
            </div>
          )}

          {activeTab === 'saved' && displayVendors.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-border">
              <p className="text-muted-foreground font-bold">You haven't saved any vendors yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vendors;
