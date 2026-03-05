"use client";

import React, { useState, useEffect, useRef } from 'react';

import { Search, Filter, ChevronDown, Calendar, FileText, Clock, Star, ArrowRight, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { VENDOR_CATEGORIES, EVENT_THEMES } from '@/lib/constants';
import { Vendor, BlogPost, SharedEvent, Experience } from '@/lib/types';
import { getVendors, getEvents, getBlogPosts, getExperiences } from '@/lib/firestore-service';
import BlogPostCard from '@/components/dashboard/BlogPostCard';
import { VendorCard } from '@/components/dashboard/vendor-card';
import { ExperienceCard } from '@/components/dashboard/experience-card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useSavedVendors } from '@/hooks/use-saved-vendors';
import { useAuth } from '@/components/providers/auth-provider';

const FilterBar: React.FC<{
  vendors: Vendor[];
  selectedCategories: string[];
  selectedThemes: string[];
  selectedLocations: string[];
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onThemeChange: (theme: string) => void;
  onLocationChange: (location: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}> = ({
  vendors,
  selectedCategories,
  selectedThemes,
  selectedLocations,
  onCategoryChange,
  onThemeChange,
  onLocationChange,
  onClearFilters,
}) => {
    // Extract unique locations from vendor data
    const LOCATIONS = Array.from(new Set(vendors.flatMap(v => {
      const parts = v.location.split(',').map(p => p.trim());
      return parts[parts.length - 1];
    }))).sort();

    const hasActiveFilters = selectedCategories.length > 0 ||
      selectedThemes.length > 0 ||
      selectedLocations.length > 0;

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
  const [displayName, setDisplayName] = useState<string>('');
  const VENDORS_PER_PAGE = 12;

  // Data States
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [allEvents, setAllEvents] = useState<SharedEvent[]>([]);
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [topTab, setTopTab] = useState<'vendors' | 'experiences'>('vendors');
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVendorSheetOpen, setIsVendorSheetOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Counts
  const allVendorsCount = allVendors.length;
  const { user } = useAuth();
  const { savedVendorIds, toggleSavedVendor } = useSavedVendors(user?.uid);
  const savedVendorsCount = savedVendorIds.size;

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

        // Keep vendors independent so other permission errors never blank vendor results.
        const vendors = await getVendors();
        setAllVendors(vendors);

        const [eventsResult, blogPostsResult] = await Promise.allSettled([
          getEvents(currentUser.uid),
          getBlogPosts(),
        ]);

        if (eventsResult.status === "fulfilled") {
          setAllEvents(eventsResult.value);
        } else {
          console.warn("Events unavailable. Falling back to empty list.", eventsResult.reason);
          setAllEvents([]);
        }

        if (blogPostsResult.status === "fulfilled") {
          setAllBlogPosts(blogPostsResult.value);
        } else {
          console.warn("Blog posts unavailable. Falling back to empty list.", blogPostsResult.reason);
          setAllBlogPosts([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    let cancelled = false;
    getExperiences()
      .then((data) => {
        if (cancelled) return;
        setAllExperiences(data || []);
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn("Experiences unavailable. Falling back to empty list.", error);
        setAllExperiences([]);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, topTab]);

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
    setPriceRange([0, 10000000]);
    setCurrentPage(1);
  };

  const firstName = displayName.trim().split(/\s+/)[0] || displayName;
  const welcomeText = displayName
    ? `Welcome back, ${firstName}. Here's what's happening today.`
    : "Welcome back. Here's what's happening today.";

  // Apply filters logic
  let filteredVendors = allVendors;

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

  const displayVendors = activeTab === 'saved'
    ? filteredVendors.filter(v => savedVendorIds.has(v.id))
    : filteredVendors;

  const filteredExperiences = allExperiences.filter((experience) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      experience.title.toLowerCase().includes(q) ||
      experience.vendorName.toLowerCase().includes(q) ||
      experience.location.toLowerCase().includes(q)
    );
  });

  const displayExperiences = filteredExperiences;
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
    topTab,
    searchQuery,
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
      priceRange={priceRange}
      onCategoryChange={toggleCategory}
      onThemeChange={toggleTheme}
      onLocationChange={toggleLocation}
      onPriceChange={setPriceRange}
      onClearFilters={clearAllFilters}
    />
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto min-w-0 space-y-6 pb-10">
        <div className="mb-8 animate-pulse">
          <div className="h-12 w-full bg-muted rounded-xl" />
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
      <div className="pt-1">
        <div className="flex justify-center">
          <Tabs value={topTab} onValueChange={(value) => setTopTab(value as 'vendors' | 'experiences')}>
            <TabsList>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="experiences">Experiences</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={topTab === 'vendors' ? "Search vendors..." : "Search experiences..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-12 pr-5 py-4 text-base outline-none focus:border-primary/30 transition-all font-medium"
          />
        </div>
      </div>

      {topTab === 'vendors' ? (
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

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {paginatedVendors.map(vendor => (
                  <div
                    key={vendor.id}
                    className="block h-full min-w-0 cursor-pointer"
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setIsVendorSheetOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedVendor(vendor);
                        setIsVendorSheetOpen(true);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <VendorCard
                      vendor={vendor}
                      saved={savedVendorIds.has(vendor.id)}
                      onToggleSave={() => toggleSavedVendor(vendor.id)}
                      hideDescription
                      hideLocation
                    />
                  </div>
                ))}
              </div>

              <Sheet open={isVendorSheetOpen} onOpenChange={setIsVendorSheetOpen}>
                <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
                  {selectedVendor && (
                    <div className="space-y-6 pr-2">
                      <SheetHeader className="pr-6">
                        <SheetTitle>{selectedVendor.name}</SheetTitle>
                        <SheetDescription>
                          {selectedVendor.categories?.[0] || "Vendor"}
                        </SheetDescription>
                      </SheetHeader>

                      <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
                        {selectedVendor.image ? (
                          <img
                            src={selectedVendor.image}
                            alt={selectedVendor.name}
                            className="h-full w-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                          />
                        ) : (
                          <div className="h-full w-full bg-background" />
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="font-semibold text-foreground">{selectedVendor.rating || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Starting price</span>
                          <span className="font-semibold text-foreground">
                            {selectedVendor.price ?? "Contact for pricing"}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">Location</p>
                          <p className="text-sm text-muted-foreground">{selectedVendor.location || "Not specified"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">About</p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {selectedVendor.description || selectedVendor.shortDescription || "No description available."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button asChild>
                          <Link href={`/dashboard/hosts/vendor/${selectedVendor.slug}`}>
                            View full profile
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => toggleSavedVendor(selectedVendor.id)}
                        >
                          {savedVendorIds.has(selectedVendor.id) ? "Remove from saved" : "Save vendor"}
                        </Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

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
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-16 md:p-32 text-center">
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
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {displayExperiences.map((experience) => (
              <div key={experience.id} className="block h-full min-w-0 transition-transform hover:scale-[1.02]">
                <ExperienceCard
                  experience={experience}
                  experienceHref={`/dashboard/hosts/experiences/${experience.id}`}
                  saved={savedVendorIds.has(experience.id)}
                  onToggleSave={() => toggleSavedVendor(experience.id)}
                />
              </div>
            ))}
          </div>

          {displayExperiences.length === 0 && (
            <div className="relative overflow-hidden rounded-lg border border-border bg-card p-16 md:p-32 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
              <div className="relative space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Search size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground">No experiences found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    We couldn't find any experiences matching your current search.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="rounded-full px-8"
                >
                  Clear search
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
