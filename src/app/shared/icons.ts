import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Instagram,
  Loader,
  Mail,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  Truck,
  User,
  X,
} from 'lucide-angular';

/**
 * The showroom's icon set. Components bind `[img]="ICONS.search"` so icons are
 * tree-shaken and never hand-drawn as inline SVG.
 */
export const ICONS = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  check: Check,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  heart: Heart,
  instagram: Instagram,
  loader: Loader,
  mail: Mail,
  menu: Menu,
  minus: Minus,
  plus: Plus,
  search: Search,
  bag: ShoppingBag,
  filters: SlidersHorizontal,
  star: Star,
  trash: Trash2,
  truck: Truck,
  user: User,
  close: X,
} as const;

export type IconName = keyof typeof ICONS;
