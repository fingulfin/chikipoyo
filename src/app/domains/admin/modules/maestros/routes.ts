import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/administracion/administracion'),
  },
];

export default routes;
