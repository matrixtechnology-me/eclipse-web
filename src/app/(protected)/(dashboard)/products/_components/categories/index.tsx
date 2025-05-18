import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagsIcon } from "lucide-react";
import { FC } from "react";
import { Category } from "./category";
import { getCategoriesAction } from "../../_actions/get-categories";
import { AddCategory } from "./add-category";

type CategoriesProps = {
  tenantId: string;
};

export const Categories: FC<CategoriesProps> = async ({ tenantId }) => {
  const result = await getCategoriesAction({ tenantId });

  if (result.isFailure) return <div>Erro ao buscar as categorias</div>;

  const { categories } = result.value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <TagsIcon className="size-4" />
          Categorias
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen max-w-96 mr-5 p-0">
        {/* Header */}
        <div className="w-full h-12 bg-secondary border-b px-5 flex items-center justify-between">
          <h1>Categorias</h1>
          <AddCategory tenantId={tenantId} />
        </div>
        {/* Content */}
        <ScrollArea className="w-full h-96 flex flex-col">
          {categories.map((category) => (
            <Category
              key={category.id}
              name={category.name}
              description={category.description ?? ""}
            />
          ))}
        </ScrollArea>
        {/* Footer */}
        <div className="w-full h-12 bg-secondary border-t px-5 flex items-center justify-between">
          <button className="cursor-pointer">
            <span className="text-sm">Marcar todas como lidas</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
