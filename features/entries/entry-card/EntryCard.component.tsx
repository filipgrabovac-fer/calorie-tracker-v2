"use client";

import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INTERNAL__useDeleteEntry } from "../api_hooks/INTERNAL__useDeleteEntry";

export type EntryCardProps = {
  id: number;
  title: string;
  calories: number;
  eaten_at: string;
  description?: string;
  image_url?: string | null;
  ingredients: Array<{ id: number; name: string; weight_grams?: string | null }>;
  onEdit?: (entry: EntryCardProps) => void;
};

export const EntryCard = ({
  id,
  title,
  calories,
  eaten_at,
  description,
  image_url,
  ingredients,
  onEdit,
}: EntryCardProps) => {
  const { mutate: deleteEntry, isPending } = INTERNAL__useDeleteEntry();

  const time = new Date(eaten_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className={cn("w-full hover:shadow-md transition-all", { "opacity-50": isPending })}>
      <CardContent className="p-4 sm:p-5 flex gap-4">
        {image_url && (
          <img
            src={image_url}
            alt={title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0 border border-border"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm sm:text-base truncate">{title}</p>
              {description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge variant="secondary" className="font-medium">{calories} kcal</Badge>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit({ id, title, calories, eaten_at, description, image_url, ingredients })}
                  aria-label="Edit entry"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteEntry(id)}
                disabled={isPending}
                aria-label="Delete entry"
              >
                ×
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">{time}</span>
            {ingredients.length > 0 && (
              <span className="text-xs text-muted-foreground">
                · {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ingredients.map((ing) => (
                <span
                  key={ing.id}
                  className="text-xs bg-muted px-2 py-1 rounded-md border border-border/50"
                >
                  {ing.name}
                  {ing.weight_grams ? ` ${ing.weight_grams}g` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
