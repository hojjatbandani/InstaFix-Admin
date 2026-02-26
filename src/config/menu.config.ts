import {
  LucideIcon,
  Home,
  FileText,
  ListTodo,
  Users,
  Building2,
  ShieldCheck,
  ClipboardList,
  Truck,
  XCircle,
  Scale,
  Receipt,
  CreditCard,
  BookOpen,
  Wallet,
  Inbox,
  Bell,
  Layers,
  ScrollText,
  Settings,
  CalendarCheck,
  CalendarClock,
  Package,
  Tag,
} from 'lucide-react';

export interface MenuItem {
  label: string;
  id?: number;
  icon?: LucideIcon;
  link?: string;
  isExternalLink?: boolean;
  expanded?: boolean;
  subItems?: MenuItem[];
  isTitle?: boolean;
  badge?: { variant: string; isDarkText?: boolean; isPill?: boolean; text: string };
  parentId?: number;
}

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true,
  },
  {
    label: 'Dashboard',
    icon: Home,
    link: '/dashboard',
  },
  {
    label: 'Live Operations',
    icon: ListTodo,
    link: '/jobs-queue',
  },
  {
    label: 'Professionals',
    icon: Users,
    link: '/professionals',
  },
  {
    label: 'Companies',
    icon: Building2,
    link: '/companies',
  },
  {
    label: 'Verifications',
    icon: ShieldCheck,
    link: '/verifications',
  },
  {
    label: 'Jobs List',
    icon: ClipboardList,
    link: '/jobs-list',
  },
  {
    label: 'Dispatch',
    icon: Truck,
    link: '/dispatch',
  },
  {
    label: 'Cancellations Management',
    icon: XCircle,
    link: '/cancellations',
  },
  {
    label: 'Disputes',
    icon: Scale,
    link: '/disputes',
  },
  {
    label: 'Refunds & Adjustments',
    icon: Receipt,
    link: '/refunds-adjustments',
  },
  {
    label: 'Payments Overview',
    icon: CreditCard,
    link: '/payments-overview',
  },
  {
    label: 'Transactions Ledger',
    icon: BookOpen,
    link: '/transactions-ledger',
  },
  {
    label: 'Payouts to Professionals',
    icon: Wallet,
    link: '/payouts',
  },
  {
    label: 'Support Tickets Inbox',
    icon: Inbox,
    link: '/support-tickets',
  },
  {
    label: 'Notifications Templates',
    icon: Bell,
    link: '/notifications-templates',
  },
  {
    label: 'Service Categories',
    icon: Layers,
    link: '/service-categories',
  },
  {
    label: 'Terms & Conditions',
    icon: FileText,
    link: '/terms-and-conditions',
  },
  {
    label: 'Audit Logs',
    icon: ScrollText,
    link: '/audit-logs',
  },
  {
    label: 'General Settings',
    icon: Settings,
    link: '/general-settings',
  },
  {
    label: 'Scheduling Calendar',
    icon: CalendarCheck,
    link: '/scheduling-calendar',
  },
  {
    label: 'Reschedule Requests',
    icon: CalendarClock,
    link: '/reschedule-requests',
  },
  {
    label: 'Subscriptions & Plans',
    icon: Package,
    link: '/subscriptions-plans',
  },
  {
    label: 'Subscription Billing',
    icon: Receipt,
    link: '/subscription-billing',
  },
  {
    label: 'Coupons & Promotions',
    icon: Tag,
    link: '/coupons-promotions',
  },
];
