import { VENDOR_CATEGORIES } from "@/lib/vendors-data"
import type { VendorCategory } from "@/lib/vendors-data"

interface VendorFiltersProps {
  selectedCategory: VendorCategory
  onCategoryChange: (category: VendorCategory) => void
  onClearAll: () => void
}

export function VendorFilters({
  selectedCategory,
  onCategoryChange,
  onClearAll,
}: VendorFiltersProps) {
  const hasFilters = selectedCategory !== "All Categories"

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </h3>
        <div className="mt-3 flex flex-col gap-1">
          {VENDOR_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary"
              onClick={() => onCategoryChange(category)}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selectedCategory === category
                  ? "border-primary bg-primary"
                  : "border-border bg-background"
                  }`}
              >
                {selectedCategory === category && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                )}
              </span>
              <span
                className={
                  selectedCategory === category
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
