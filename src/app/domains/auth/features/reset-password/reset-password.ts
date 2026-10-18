import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
    MatCard,
  ],
})
export default class AuthResetPassword {
  // Dependencies
  private router = inject(Router);
  private authService = inject(AuthService);

  // State
  protected resetPasswordFormModel = signal({
    password: '',
    passwordValidation: '',
  });
  protected resetPasswordForm = form(this.resetPasswordFormModel, (form) => {
    required(form.password, { message: 'Debes introducir un passwod' });
    required(form.passwordValidation, {
      message: 'You must enter a password',
    });
    validate(form.passwordValidation, (ctx) => {
      const password = ctx.valueOf(form.password);
      const passwordValidation = ctx.value();

      if (!password || !passwordValidation) return null;

      if (password !== passwordValidation) {
        return {
          kind: 'mismatch',
          message: 'Los passwords no coinciden',
        };
      }

      return null;
    });
  });
  protected errorMessage = signal<string | null>(null);

  resetPassword(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);

    submit(this.resetPasswordForm, async () => {
      const email =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('email')
          : null;
      if (!email) {
        this.errorMessage.set('No se encotroun usuario autenticado.');
        return;
      }

      try {
        await firstValueFrom(
          this.authService.updatePassword({
            email,
            password: this.resetPasswordFormModel().password,
          }),
        );
        await this.router.navigateByUrl('/auth/sign-in');
      } catch (err: unknown) {
        console.error('Fallo el reseteo del password', err);
        const httpError = err as { error?: { message?: string } };
        this.errorMessage.set(
          httpError.error?.message ?? 'Fallo resetear password.',
        );
      }
    });
  }
}
