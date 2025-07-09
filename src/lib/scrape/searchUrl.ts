import { Condition } from '@/types/cond';

export const buildSearchUrl = (cond: Condition) => {
  let url = '';
  if (cond.keyword.trim()) {
    url = `https://jp.mercari.com/search?keyword=${encodeURIComponent(
      cond.keyword
    )}`;
  } else {
    url = `https://jp.mercari.com/search?keyword=`;
  }

  if (cond.itemCategoryIds && cond.itemCategoryIds.length > 0) {
    const itemsStrings = cond.itemCategoryIds.join(',');
    url += `&category_id=${encodeURIComponent(itemsStrings)}`;
  } else if (cond.finalCategoryId) {
    url += `&category_id=${cond.finalCategoryId}`;
  }

  if (cond.conditionStatusIds && cond.conditionStatusIds.length > 0) {
    const stringRaw = cond.conditionStatusIds.join(',');
    url += `&item_condition_id=${encodeURIComponent(stringRaw)}`;
  }
  if (cond.priceMin) url += `&price_min=${cond.priceMin}`;
  if (cond.priceMax) url += `&price_max=${cond.priceMax}`;
  url += '&sort=created_time&order=desc';
  console.log('🔥🔥🔥URL🔥🔥🔥', url);

  return url;
};
