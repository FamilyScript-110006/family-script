import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events, getEventBySlug } from "../../../../data/events";
import EventDetails from "../../../components/projects/events/EventDetails";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Pre-render all 5 known event slugs at build time instead of
// generating each one on demand at request time.
export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found | Family Script" };
  }

  return {
    title: `${event.title} | Family Script`,
    description:
      event.description[0] ||
      "A collection of moments, memories and stories captured through Family Script.",
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetails event={event} />;
}