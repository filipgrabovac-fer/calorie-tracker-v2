"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { mealsApi } from "../_meals.api";
import { CategoryForm } from "../category-form/CategoryForm.component";
import { CategorySection } from "../category-section/CategorySection.component";

export const CategoriesList = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const { data: categories, isLoading, isError } = mealsApi.useGetCategories();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading meals…</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load meals. Please try again.</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {categories && (categories as any[]).length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground text-sm">No categories yet.</p>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add your first category
            </Button>
          </div>
        ) : (
          <>
            {(categories as any[]).map((category, index) => (
              <div key={category.id}>
                <CategorySection
                  id={category.id}
                  name={category.name}
                  meals={category.meals}
                />
                {index < (categories as any[]).length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
            <div className="pt-2">
              <Button variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSuccess={() => setIsAddCategoryOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
