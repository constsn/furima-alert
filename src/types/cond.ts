export type Condition = {
  id: string;
  userId: string;
  keyword: string;
  categoryId: string | null;
  subcategoryId: string | null;
  childCategoryId: string | null;
  finalCategoryId: string | null;
  itemCategoryIds: string[] | null;
  conditionStatusIds: string[] | null;
  priceMin: number | null;
  priceMax: number | null;
  createdAt: Date;
};
