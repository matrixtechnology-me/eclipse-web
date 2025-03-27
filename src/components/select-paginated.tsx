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
                "border-violet-800 outline-none ring-2 ring-ring ring-offset-2",
                focusedControlClasses
              ),
            controlClasses
          ),
        valueContainer: () => "!p-0 !text-sm cursor-pointer !text-white",
        singleValue: () => "!text-white !text-sm",
        input: () => cn("!m-0 !p-0 !text-white", inputClasses),
        placeholder: () => cn("!text-white truncate", placeholderClasses),
        dropdownIndicator: () => "!p-0 !h-5 !w-4 !text-white opacity-40",
        indicatorSeparator: () => "!hidden",
        menu: () =>
          cn(
            "!bg-background p-[1px] !border-[1px] border-white !rounded-md",
            menuClasses
          ),
        menuList: () => "!overflow-x-hidden",
        option: ({ isFocused, isSelected }) =>
          cn(
            `!mx-1 !px-2 py-1 !text-sm !rounded-sm
                                ${
                                  isSelected
                                    ? isFocused
                                      ? cn(
                                          "!bg-accent",
                                          focusedOptionClasses,
                                          selectedOptionClasses
                                        )
                                      : "!bg-[unset]"
                                    : isFocused
                                    ? cn("!bg-accent", focusedOptionClasses)
                                    : ""
                                }`,
            optionClasses
          ),
        noOptionsMessage: () => cn("py-2", noOptionClasses),
        loadingMessage: () => cn("py-2", loadingMessageClasses),
      }}
      {...props}
    />
  );
}
