import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.html',
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
    MatDivider,
  ],
})
export default class AuthSignIn {
  // Dependencies
  private router = inject(Router);
  private authService = inject(AuthService);

  // State
  protected signInFormModel = signal({
    email: 'tu-email@mail.com',
    password: 'pasword',
  });
  protected signInForm = form(this.signInFormModel, (form) => {
    required(form.email, { message: 'Debes agregar un email' });
    email(form.email, { message: 'Debes proporcionar un email valido' });

    required(form.password, { message: 'Debes proporcionar un password' });
  });

  protected errorMessage = signal<string | null>(null);

  signIn(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);

    submit(this.signInForm, async () => {
      try {
        const response = await firstValueFrom(
          this.authService.login({
            email: this.signInFormModel().email,
            password: this.signInFormModel().password,
          }),
        );

        if (response?.token) {
          localStorage.setItem('token', response.token);
          this.router.navigateByUrl('/admin/maestros');
        }
      } catch (err: unknown) {
        const httpError = err as { error?: { error?: string } };
        const errorText = httpError.error?.error ?? 'Authentication failed';
        this.errorMessage.set(errorText);
      }
    });
  }
}
