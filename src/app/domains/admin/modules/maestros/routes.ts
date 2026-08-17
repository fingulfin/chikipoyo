import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/administracion/administracion'),
  },
  {
    path: 'caracteristicas',
    loadComponent: () => import('./features/caracteristicas/caracteristicas'),
  },
];

export default routes;
