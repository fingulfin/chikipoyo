import { Component, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@/app/domains/auth/services/auth.service';

interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'maestros-administracion',
  imports: [MatCard, MatTabsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './administracion.html',
})
export default class MaestrosAdministracion {
  private authService = inject(AuthService);
  protected user = signal<User | null>(null);

  constructor() {
    effect(async () => {
      if (typeof localStorage === 'undefined') {
        return;
      }
      console
      const email = localStorage.getItem('email');
      if (!email) {
        return;
      }
      try {
        const user = await firstValueFrom(
          this.authService.getUserByEmail(email),
        );
        this.user.set(user);
        console.log("user is "+JSON.stringify(user));
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    });
  }
}
