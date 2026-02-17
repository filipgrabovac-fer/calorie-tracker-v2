import { PersonCard } from "@/features/person-picker/person-card/PersonCard.component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-6 sm:p-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Calorie Tracker</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Who is tracking today?
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md">
        <PersonCard name="Filip" slug="filip" emoji="🧑" />
        <PersonCard name="Klara" slug="klara" emoji="👩" />
      </div>
    </main>
  );
}
