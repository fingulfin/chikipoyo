import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/administracion/videojuegos'),
  },
  {
    path: 'preguntas',
    loadComponent: () => import('./features/administracion/preguntas'),
  },
  {
    path: 'cuestionarios',
    loadComponent: () => import('./features/administracion/cuestionarios'),
  },
  {
    path: 'problemas',
    loadComponent: () => import('./features/administracion/problemas'),
  },
  {
    path: 'lecturas',
    loadComponent: () => import('./features/administracion/lecturas'),
  },
];

export default routes;
