"use client";

import { debounce } from "lodash";
import { useCallback, useState } from "react";

export type UsePaginationReturnValue = {
  page: number;
  itemsPerPage: number;
  total: number;
  searchValue: string;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleFirstPage: () => void;
  handleLastPage: () => void;
  handleChangeItemsPerPage: (itemsPerPage: number) => void;
  handleChangeTotal: (total: number) => void;
  handleChangeSearchValue: (searchValue: string) => void;
};

interface IUsePaginationProps {
  initialPage: number;
  initialItemsPerPage: number;
  initialTotal: number;
}

export const usePagination = ({
  initialPage,
  initialItemsPerPage,
  initialTotal,
}: IUsePaginationProps): UsePaginationReturnValue => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [page, setPage] = useState<number>(initialPage);
  const [total, setTotal] = useState<number>(initialTotal);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleChangeSearchValue = useCallback(
    debounce((newSearchValue: string) => {
      setSearchValue(newSearchValue);
    }, 500),
    [],
  );

  function handleNextPage() {
    const aux = page + 1;
    setPage(aux);
  }

  function handlePreviousPage() {
    if (page === 0) return;

    const aux = page - 1;
    setPage(aux);
  }

  function handleFirstPage() {
    const aux = 1;
    setPage(aux);
  }

  function handleLastPage() {
    const aux = Math.ceil(total / itemsPerPage);
    setPage(aux);
  }

  function handleChangeItemsPerPage(newItemsPerPage: number) {
    if (itemsPerPage !== newItemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setPage(initialPage);
    }
  }

  function handleChangeTotal(newTotalItems: number) {
    if (newTotalItems !== total) setTotal(newTotalItems);
  }

  return {
    page,
    itemsPerPage,
    total,
    searchValue,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    handleLastPage,
    handleChangeItemsPerPage,
    handleChangeTotal,
    handleChangeSearchValue,
  };
};
