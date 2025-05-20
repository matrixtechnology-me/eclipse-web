"use client";

import {
  AsyncPaginate,
  AsyncPaginateProps,
  LoadOptions,
} from "react-select-async-paginate";
import { GroupBase } from "react-select";
import { cn } from "@/lib/utils";

export interface DefaultOptionType<T> {
  label: string;
  value: T;
}

interface IProps<
  T,
  IsMulti extends boolean = false,
  OptionType = DefaultOptionType<T>,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
> extends Omit<
    AsyncPaginateProps<OptionType, Group, any, IsMulti>,
    "loadOptions" | "classNames"
  > {
  loadOptions: LoadOptions<
    DefaultOptionType<T>,
    GroupBase<DefaultOptionType<T>>,
    any
  >;
  containerClasses?: string;
  focusedControlClasses?: string;
  controlClasses?: string;
  inputClasses?: string;
  placeholderClasses?: string;
  menuClasses?: string;
  focusedOptionClasses?: string;
  selectedOptionClasses?: string;
  optionClasses?: string;
  noOptionClasses?: string;
  loadingMessageClasses?: string;
}

export function SelectPaginated<T, IsMulti extends boolean = false>({
  loadOptions,
  containerClasses,
  focusedControlClasses,
  controlClasses,
  inputClasses,
  placeholderClasses,
  menuClasses,
  optionClasses,
  focusedOptionClasses,
  selectedOptionClasses,
  noOptionClasses,
  loadingMessageClasses,
  ...props
}: IProps<T, IsMulti>) {
  return (
    <AsyncPaginate
      noOptionsMessage={() => "Sem opções"}
      loadingMessage={() => "Carregando..."}
      isSearchable
      menuPlacement="top"
      defaultOptions={[]}
      placeholder="Selecione uma opção"
      loadOptions={loadOptions}
      classNames={{
        container: ({ isDisabled }) =>
          cn(`w-full ${isDisabled ? "opacity-50" : ""}`, containerClasses),

        control: ({ isFocused, menuIsOpen }) =>
          cn(
            "!h-9 border-2 px-3 py-2 !shadow-none !border-input !bg-background !ring-offset-background disabled:!cursor-not-allowed disabled:!opacity-50 [&>span]:!line-clamp-1",
            isFocused &&
              !menuIsOpen &&
              cn(
                "border-ring outline-none ring-2 ring-ring ring-offset-2",
                focusedControlClasses
              ),
            controlClasses
          ),

        valueContainer: () => "!p-0 !text-sm cursor-pointer",

        singleValue: () => "!text-sm !text-foreground",

        input: () => cn("!m-0 !p-0 !text-foreground", inputClasses),

        placeholder: () =>
          cn("truncate !text-muted-foreground", placeholderClasses),

        dropdownIndicator: () => "!p-0 !h-5 !w-4 text-muted-foreground",

        indicatorSeparator: () => "!hidden",

        menu: () =>
          cn(
            "!bg-popover p-[1px] !border-[1px] border-border !rounded-md shadow-md",
            menuClasses
          ),

        menuList: () => "!overflow-x-hidden",

        option: ({ isFocused, isSelected }) =>
          cn(
            "!mx-1 !px-2 py-1 !text-sm !rounded-sm !overflow-hidden",
            isFocused && "!bg-accent !text-accent-foreground",
            isSelected && "!bg-secondary !text-secondary-foreground",
            isSelected && isFocused && "!bg-secondary",
            focusedOptionClasses,
            isSelected ? selectedOptionClasses : "",
            optionClasses
          ),

        noOptionsMessage: () =>
          cn("py-2 !text-muted-foreground", noOptionClasses),

        loadingMessage: () =>
          cn("py-2 !text-muted-foreground", loadingMessageClasses),
      }}
      {...props}
    />
  );
}
