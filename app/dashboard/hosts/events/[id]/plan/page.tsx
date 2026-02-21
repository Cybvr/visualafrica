import { notFound } from "next/navigation";
import PlanTab from "@/components/dashboard/event-tabs/PlanTab";
import { getEventById } from "@/lib/firestore-service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPlanPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <PlanTab event={event} />
    </div>
  );
}
