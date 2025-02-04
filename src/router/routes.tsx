import { lazy } from 'react';

export interface Route {
  name: string;
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  exact?: boolean;
}

const routes: Route[] = [
  {
    name: 'Home',
    path: '/',
    element: lazy(() => import('../views/Home')),
  },
  {
    name: 'Initial Setup',
    path: '/initial-setup',
    element: lazy(() => import('../views/InitialSetup')),
  },
  {
    name: 'Settings',
    path: '/settings',
    element: lazy(() => import('../views/Settings')),
  },
];

export default routes;
