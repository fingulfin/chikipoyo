import { IsActiveMatchOptions } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
  description?: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
};

export const NAVIGATION: NavigationItem[] = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    description: 'Overview of key metrics',
    children: [
      {
        id: 'dashboards/project',
        label: 'Project',
        icon: 'folder-kanban',
        route: '/admin/dashboards/project',
      },
      {
        id: 'dashboards/analytics',
        label: 'Analytics',
        icon: 'chart-area',
        route: '/admin/dashboards/analytics',
      },
      {
        id: 'dashboards/finance',
        label: 'Finance',
        icon: 'chart-candlestick',
        route: '/admin/dashboards/finance',
      },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    description: 'Additional pages and features',
    children: [
     /* {
        id: 'extras/error',
        label: 'Error page',
        icon: 'circle-x',
        route: 'error/404',
      },*/
      {
        id: 'extras/sign-in',
        label: 'Sign in',
        icon: 'log-in',
        route: '/auth/sign-in',
      },
      {
        id: 'extras/sign-up',
        label: 'Sign up',
        icon: 'log-out',
        route: '/auth/sign-up',
      },
      {
        id: 'extras/forgot-password',
        label: 'Forgot password',
        icon: 'rectangle-ellipsis',
        route: '/auth/forgot-password',
      },
      {
        id: 'extras/reset-password',
        label: 'Reset password',
        icon: 'rotate-ccw-key',
        route: '/auth/reset-password',
      },
      /*
      {
        id: 'extras/coming-soon',
        label: 'Coming soon',
        icon: 'traffic-cone',
        route: '/coming-soon',
      },
      
      {
        id: 'extras/maintenance',
        label: 'Maintenance',
        icon: 'wrench',
        route: '/maintenance',
      },*/
    ],
  },
];
