import { createContext, Dispatch, SetStateAction } from "react";

export type CategoryContextType = {
  selectedCategory: string;
  setselectedCategory: Dispatch<SetStateAction<string>>;
  totalCartItems: number;
  settotalCartItems: Dispatch<SetStateAction<number>>;
};

export const categoryContext = createContext<CategoryContextType | undefined>(
  undefined
);
