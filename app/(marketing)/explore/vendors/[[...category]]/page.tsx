import { VendorDetail } from "@/components/dashboard/vendor-detail"
import { CATEGORY_SLUG_MAP } from "@/lib/constants"
import { getVendors, getVendorBySlug, getFaqs } from "@/lib/firestore-service"
import { type FAQ } from "@/lib/types"
import { VendorListingContent } from "./VendorListingContent"

interface PageProps {
  params: Promise<{ category?: string[] }>
}

export default async function ExploreVendorsPage({ params }: PageProps) {
  const { category: segments = [] } = await params
  const firstSegment = segments[0] ?? null

  const isVendorDetail =
    firstSegment !== null && !(firstSegment in CATEGORY_SLUG_MAP)

  const allVendors = await getVendors()
  const vendorData = isVendorDetail ? await getVendorBySlug(firstSegment) : undefined
  const plainAllVendors = JSON.parse(JSON.stringify(allVendors))
  const plainVendorData = vendorData ? JSON.parse(JSON.stringify(vendorData)) : undefined
  const faqs = await getFaqs()
  const vendorFaqs: FAQ[] = faqs.filter(
    (f) => f.category === "vendors" || f.category === "general"
  )

  if (isVendorDetail && plainVendorData) {
    return <VendorDetail vendor={plainVendorData} />
  }

  return (
    <VendorListingContent
      categorySlug={firstSegment}
      vendors={plainAllVendors}
      faqs={vendorFaqs}
    />
  )
}
