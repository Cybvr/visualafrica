"use client";

import React, { useState, useEffect } from 'react';

import { Search, Filter, ChevronDown, Calendar, FileText, Clock, Star, ArrowRight, ExternalLink, Heart, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { VENDOR_CATEGORIES, EVENT_THEMES } from '@/lib/constants';
import { Vendor, BlogPost, SharedEvent } from '@/lib/types';
import { getVendors, getEvents, getBlogPosts } from '@/lib/firestore-service';
import BlogPostCard from '@/components/dashboard/BlogPostCard';
import { VendorCard } from '@/components/dashboard/vendor-card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

const VENDOR_TYPES = ['All', 'Regular Vendors', 'Suspended', 'New'];

const FilterSidebar: React.FC<{
  vendors: Vendor[];
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
  vendors,
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
    // Extract unique locations from vendor data
    const LOCATIONS = Array.from(new Set(vendors.flatMap(v => {
      const parts = v.location.split(',').map(p => p.trim());
      return parts[parts.length - 1];
    }))).sort();

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
          <button onClick={onClearAll} className="text-sm text-foreground font-bold hover:underline">
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
                <span>₦{priceRange[0].toLocaleString('en-NG')}</span>
                <span>₦{priceRange[1].toLocaleString('en-NG')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

export default function DashboardPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');

  // Data States
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [allEvents, setAllEvents] = useState<SharedEvent[]>([]);
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'experiences' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  // Counts
  const allVendorsCount = allVendors.length;
  const experiencesCount = allVendors.filter(v => v.categories.includes('Experiences')).length;
  const savedVendorsCount = 0; // Placeholder for now

  useEffect(() => {
    async function fetchData() {
      try {
        const [v, e, b] = await Promise.all([
          getVendors(),
          getEvents(),
          getBlogPosts()
        ]);
        setAllVendors(v);
        setAllEvents(e);
        setAllBlogPosts(b);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setDisplayName('');
        return;
      }
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const name = userDoc.exists()
          ? (userDoc.data().displayName || currentUser.displayName || '')
          : (currentUser.displayName || '');
        setDisplayName(name);
      } catch {
        setDisplayName(currentUser.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter Handlers
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

  const firstName = displayName.trim().split(/\s+/)[0] || displayName;
  const welcomeText = displayName
    ? `Welcome back, ${firstName}. Here's what's happening today.`
    : "Welcome back. Here's what's happening today.";

  // Apply filters logic
  let filteredVendors = allVendors;

  if (activeTab === 'experiences') {
    filteredVendors = filteredVendors.filter((v: Vendor) => v.categories.includes('Experiences'));
  }

  if (selectedType === 'Regular Vendors') {
    filteredVendors = filteredVendors.filter((v: Vendor) => !v.categories.includes('Experiences'));
  } else if (selectedType === 'New') {
    filteredVendors = filteredVendors.filter((v: Vendor) => v.isNew);
  } else if (selectedType === 'Sponsored') {
    filteredVendors = filteredVendors.filter((v: Vendor) => v.isSponsored);
  }

  if (selectedCategories.length > 0) {
    filteredVendors = filteredVendors.filter((v: Vendor) =>
      v.categories.some((cat: string) => selectedCategories.includes(cat))
    );
  }

  if (selectedThemes.length > 0) {
    filteredVendors = filteredVendors.filter((v: Vendor) =>
      v.eventThemes.some((theme: string) => selectedThemes.includes(theme))
    );
  }

  if (selectedLocations.length > 0) {
    filteredVendors = filteredVendors.filter((v: Vendor) =>
      selectedLocations.some((loc: string) => v.location.includes(loc))
    );
  }

  if (searchQuery) {
    filteredVendors = filteredVendors.filter((v: Vendor) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.categories.some((cat: string) => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const displayVendors = activeTab === 'all' || activeTab === 'experiences' ? filteredVendors : filteredVendors.slice(0, 3); // Todo: filter saved

  const filterSidebar = (
    <FilterSidebar
      vendors={allVendors}
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
    <div className="max-w-7xl mx-auto min-w-0 space-y-6 pb-10">
      <div className="space-y-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Home</h2>
          <p className="text-muted-foreground mt-1 text-lg font-medium">{welcomeText}</p>
        </div>
      </div>

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
          <div className="flex-1 min-w-0 space-y-4">
            {/* Tabs */}
            <div className="w-full min-w-0 flex items-center gap-3 sm:gap-6 border-b border-border overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'all'
                  ? 'border-border text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                  }`}
              >
                All Vendors
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-foreground text-foreground' : 'bg-secondary text-muted-foreground'}`}>{allVendorsCount}</span>
              </button>
              <button
                onClick={() => setActiveTab('experiences')}
                className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'experiences'
                  ? 'border-border text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                  }`}
              >
                Experiences
                <Crown size={14} className="text-amber-500 fill-amber-500" />
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'experiences' ? 'bg-foreground text-foreground' : 'bg-secondary text-muted-foreground'}`}>{experiencesCount}</span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'saved'
                  ? 'border-border text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                  }`}
              >
                Saved Vendors
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'saved' ? 'bg-foreground text-foreground' : 'bg-secondary text-muted-foreground'}`}>{savedVendorsCount}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {displayVendors.map(vendor => (
                <div key={vendor.id} onClick={() => router.push(`/dashboard/hosts/vendor/${vendor.slug}`)} className="cursor-pointer min-w-0">
                  <VendorCard vendor={vendor} />
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
    </div>
  );
}
