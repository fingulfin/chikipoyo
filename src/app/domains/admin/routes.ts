import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      // Redirect empty path to '/auth/sign-in'
      { path: '', pathMatch: 'full', redirectTo: '/auth/sign-in' },

      // -----------------------------------------------------------------------
      // Maestros
      // -----------------------------------------------------------------------
      {
        path: 'maestros',
        loadChildren: () => import('./modules/maestros/routes'),
      },

      // -----------------------------------------------------------------------
      // Videojuego
      // -----------------------------------------------------------------------
      {
        path: 'videojuego',
        loadChildren: () => import('./modules/videojuego/routes'),
      },

      // -----------------------------------------------------------------------
      // Extras
      // -----------------------------------------------------------------------
      {
        path: 'error',
        loadChildren: () => import('./modules/extras/error/routes'),
      },

      // 404
      {
        path: '404',
        pathMatch: 'full',
        loadComponent: () =>
          import('./modules/extras/error/features/error-404'),
      },

      // Catch all
      { path: '**', redirectTo: '404' },
    ],
  },
];

export default routes;
