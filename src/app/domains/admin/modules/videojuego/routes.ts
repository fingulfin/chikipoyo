import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/administracion/videojuegos'),
  },
];

export default routes;
