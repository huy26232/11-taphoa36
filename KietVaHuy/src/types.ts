export type PageId =
  | 'home'
  | 'fresh-produce'
  | 'meat-seafood'
  | 'eggs-tofu'
  | 'spices-sauces'
  | 'noodles-dry'
  | 'dairy-snacks'
  | 'beverages'
  | 'household-laundry';

export interface CategoryRoute {
  id: PageId;
  label: string;
  icon: string;
  badge?: string;
}

export const ALL_CATEGORIES: CategoryRoute[] = [
  { id: 'fresh-produce', label: 'Rau củ quả tươi', icon: 'spa', badge: 'Sáng nay' },
  { id: 'meat-seafood', label: 'Thịt & Hải sản', icon: 'kebab_dining' },
  { id: 'eggs-tofu', label: 'Trứng & Đậu hũ', icon: 'egg' },
  { id: 'spices-sauces', label: 'Gia vị & Nước mắm', icon: 'soup_kitchen' },
  { id: 'noodles-dry', label: 'Mì tôm & Đồ khô', icon: 'ramen_dining' },
  { id: 'dairy-snacks', label: 'Sữa & Bánh kẹo', icon: 'cookie' },
  { id: 'beverages', label: 'Bia & Nước ngọt', icon: 'local_drink' },
  { id: 'household-laundry', label: 'Hóa phẩm giặt xả', icon: 'clean_hands' },
];
