"use client";

import React, { useState, useEffect, useRef } from 'react';

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
import { cn } from '@/lib/utils';

const VENDOR_TYPES = ['All', 'Regular Vendors', 'Suspended', 'New'];

const FilterBar: React.FC<{
  vendors: Vendor[];
  selectedCategories: string[];
  selectedThemes: string[];
  selectedLocations: string[];
  selectedType: string;
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onThemeChange: (theme: string) => void;
  onLocationChange: (location: string) => void;
  onTypeChange: (type: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}> = ({
  vendors,
  selectedCategories,
  selectedThemes,
  selectedLocations,
  selectedType,
  onCategoryChange,
  onThemeChange,
  onLocationChange,
  onTypeChange,
  onClearFilters,
}) => {
    // Extract unique locations from vendor data
    const LOCATIONS = Array.from(new Set(vendors.flatMap(v => {
      const parts = v.location.split(',').map(p => p.trim());
      return parts[parts.length - 1];
    }))).sort();

    const hasActiveFilters = selectedCategories.length > 0 ||
      selectedThemes.length > 0 ||
      selectedLocations.length > 0 ||
      selectedType !== 'All';

    return (
      <div className="rounded-2xl mb-6 ">
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
          <div className="flex-1 flex flex-wrap gap-3">
            {/* Categories Dropdown */}
            <div className="relative group">
              <DropdownFilter
                label="Category"
                items={VENDOR_CATEGORIES.filter(cat => cat !== 'All Categories')}
                selected={selectedCategories}
                onToggle={onCategoryChange}
              />
            </div>

            {/* Location Dropdown */}
            <div className="relative group">
              <DropdownFilter
                label="Location"
                items={LOCATIONS}
                selected={selectedLocations}
                onToggle={onLocationChange}
              />
            </div>

            {/* Theme Dropdown */}
            <div className="relative group">
              <DropdownFilter
                label="Theme"
                items={EVENT_THEMES.filter(theme => theme !== 'All Themes')}
                selected={selectedThemes}
                onToggle={onThemeChange}
              />
            </div>

            {/* Type Filter */}
            <div className="relative group">
              <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden h-10 shadow-sm">
                <div className="flex border-r border-border h-full items-center px-3 text-[12px] font-bold text-muted-foreground bg-secondary/30">
                  Type
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => onTypeChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] px-3 font-medium text-foreground h-full cursor-pointer min-w-[120px]"
                >
                  {VENDOR_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Clear All */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-[12px] font-bold text-muted-foreground hover:text-primary transition-colors px-2 underline decoration-dotted underline-offset-4"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    );
  };

const DropdownFilter: React.FC<{
  label: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}> = ({ label, items, selected, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 h-10 bg-card border border-border rounded-xl text-[13px] font-semibold transition-all hover:border-primary/50 shadow-sm",
          selected.length > 0 ? "border-primary text-primary" : "text-muted-foreground"
        )}
      >
        {label}
        {selected.length > 0 && <span className="ml-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{selected.length}</span>}
        <ChevronDown size={14} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="absolute top-11 left-0 z-50 min-w-[220px] bg-card border border-border rounded-2xl shadow-xl p-2 max-h-[300px] overflow-y-auto">
          {items.map(item => (
            <div
              key={item}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
              onClick={() => onToggle(item)}
            >
              <Checkbox checked={selected.includes(item)} onCheckedChange={() => { }} className="pointer-events-none" />
              <span className="text-[13px] font-medium text-foreground">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');
  const VENDORS_PER_PAGE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);

  // Counts
  const allVendorsCount = allVendors.length;
  const experiencesCount = allVendors.filter(v => v.categories.includes('Experiences')).length;
  const savedVendorsCount = 0; // Placeholder for now

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setDisplayName('');
        setAllEvents([]);
        setIsLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const name = userDoc.exists()
          ? (userDoc.data().displayName || currentUser.displayName || '')
          : (currentUser.displayName || '');
        setDisplayName(name);

        // Fetch remaining data
        const [v, e, b] = await Promise.all([
          getVendors(),
          getEvents(currentUser.uid),
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
    setCurrentPage(1);
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
  const totalPages = Math.max(1, Math.ceil(displayVendors.length / VENDORS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);
  const paginatedVendors = displayVendors.slice(
    (clampedPage - 1) * VENDORS_PER_PAGE,
    clampedPage * VENDORS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    searchQuery,
    selectedType,
    selectedCategories,
    selectedThemes,
    selectedLocations
  ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const filterBar = (
    <FilterBar
      vendors={allVendors}
      selectedCategories={selectedCategories}
      selectedThemes={selectedThemes}
      selectedLocations={selectedLocations}
      selectedType={selectedType}
      priceRange={priceRange}
      onCategoryChange={toggleCategory}
      onThemeChange={toggleTheme}
      onLocationChange={toggleLocation}
      onTypeChange={setSelectedType}
      onPriceChange={setPriceRange}
      onClearFilters={clearAllFilters}
    />
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto min-w-0 space-y-6 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-muted rounded-lg" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>
          <div className="h-12 w-full md:w-80 bg-muted rounded-xl" />
        </div>

        <div className="space-y-8">
          <div className="flex flex-wrap gap-3 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-32 bg-muted rounded-xl" />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-6 border-b border-border pb-3 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 w-24 bg-muted rounded" />
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-[2rem]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-w-0 space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Search Vendors</h2>
          <p className="text-muted-foreground">Find and book the best vendors for your event</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          {filterBar}
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8">


          {/* Vendors area: tabs + grid */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Tabs */}
            <div className="w-full min-w-0 flex items-center gap-3 sm:gap-6 border-b border-border overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'all'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                  }`}
              >
                All Vendors
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-secondary text-foreground' : 'bg-secondary/50 text-muted-foreground'}`}>{allVendorsCount}</span>
              </button>
              <button
                onClick={() => setActiveTab('experiences')}
                className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'experiences'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                  }`}
              >
                Experiences
                <Crown size={14} className="text-amber-500 fill-amber-500" />
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'experiences' ? 'bg-secondary text-foreground' : 'bg-secondary/50 text-muted-foreground'}`}>{experiencesCount}</span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-3 text-xs sm:text-sm font-black transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'saved'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-muted-foreground'
                  }`}
              >
                Saved Vendors
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'saved' ? 'bg-secondary text-foreground' : 'bg-secondary/50 text-muted-foreground'}`}>{savedVendorsCount}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {paginatedVendors.map(vendor => (
                <Link key={vendor.id} href={`/dashboard/hosts/vendor/${vendor.slug}`} className="block h-full min-w-0 transition-transform hover:scale-[1.02]">
                  <VendorCard vendor={vendor} />
                </Link>
              ))}
            </div>

            {displayVendors.length > VENDORS_PER_PAGE && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={clampedPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <span className="text-sm font-semibold text-muted-foreground px-3">
                  Page {clampedPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={clampedPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}

            {displayVendors.length === 0 && (
              <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-16 md:p-32 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="relative space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Search size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground">No vendors found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      We couldn't find any vendors matching your current search or filters. Try adjusting your criteria.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="rounded-full px-8"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
