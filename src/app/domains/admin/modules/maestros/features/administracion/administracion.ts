import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/domains/auth/services/auth.service';

interface User {
  name: string;
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'maestros-administracion',
  imports: [
    MatButtonModule,
    MatCard,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './administracion.html',
})
export default class MaestrosAdministracion {
  private authService = inject(AuthService);
  protected user = signal<User | null>(null);
  protected saving = signal(false);

  constructor() {
    effect(async () => {
      if (typeof localStorage === 'undefined') {
        return;
      }
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

  protected updateField(field: 'name' | 'username', event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.user.update((user) =>
      user ? { ...user, [field]: target.value } : user,
    );
  }

  protected async updateUser(): Promise<void> {
    const user = this.user();
    if (!user || this.saving()) {
      return;
    }

    this.saving.set(true);
    try {
      await firstValueFrom(this.authService.updateUser(user));
      window.alert('Datos actualizados correctamente.');
    } catch (err) {
      console.error('Failed to update user data', err);
    } finally {
      this.saving.set(false);
    }
  }
}
