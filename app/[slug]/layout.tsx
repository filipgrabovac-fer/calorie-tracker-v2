import { notFound } from "next/navigation";
import { Nav } from "@/components/nav/Nav.component";

export type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const VALID_SLUGS = ["filip", "klara"] as const;

export default async function layout({ children, params }: LayoutProps) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug as (typeof VALID_SLUGS)[number])) {
    notFound();
  }

  const person_type = slug as "filip" | "klara";

  return (
    <div className="min-h-screen">
      <Nav person_type={person_type} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
    </div>
  );
}
