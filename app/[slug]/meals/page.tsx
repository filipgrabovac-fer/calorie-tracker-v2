"use client";

import { CategoriesList } from "@/features/meals/categories-list/CategoriesList.component";

export default function MealsPage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold">Predefined Meals</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage meal categories and predefined meals for quick entry creation.
        </p>
      </div>
      <CategoriesList />
    </div>
  );
}
