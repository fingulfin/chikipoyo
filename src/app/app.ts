import { Component, inject, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  host: {
    // Ensure root component fills the entire viewport
    class: 'flex min-h-full w-full flex-auto flex-col',
  },
  template: `<router-outlet />`,
})
export class App {
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (typeof localStorage === 'undefined') {
        return;
      }
      const token = localStorage.getItem('token');
      if (token && !this.router.url.includes('/admin/maestros')) {
        this.router.navigateByUrl('/admin/maestros');
      }
    });
  }
}
