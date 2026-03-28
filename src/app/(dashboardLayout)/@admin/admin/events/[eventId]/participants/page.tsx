import ParticipantsManagement from "@/components/modules/Admin/Participant/ParticipantManagement";

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return <ParticipantsManagement eventId={eventId} />;
}