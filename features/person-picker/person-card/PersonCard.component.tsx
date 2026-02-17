import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export type PersonCardProps = {
  name: string;
  slug: "filip" | "klara";
  emoji: string;
};

export const PersonCard = ({ name, slug, emoji }: PersonCardProps) => {
  return (
    <Link href={`/${slug}`} className="flex-1">
      <Card className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200 active:scale-[0.98] h-full">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 sm:py-14">
          <span className="text-6xl sm:text-7xl">{emoji}</span>
          <span className="text-xl sm:text-2xl font-semibold">{name}</span>
        </CardContent>
      </Card>
    </Link>
  );
};
