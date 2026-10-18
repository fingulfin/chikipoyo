import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.html',
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    FormField,
  ],
})
export default class AuthSignUp {
  // Dependencies
  private router = inject(Router);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  // State
  private registrationSuccessDialog =
    viewChild.required<TemplateRef<unknown>>('registrationSuccessDialog');
  protected signUpFormModel = signal({
    name: '',
    username: '',
    email: '',
  });
  protected signUpForm = form(this.signUpFormModel, (form) => {
    required(form.name, { message: 'Debes introucir tu nombre' });
    required(form.email, { message: 'Debes introducir un email' });
    email(form.email, { message: 'Debes introducir un email valido' });
    required(form.username, { message: 'Introduce un nombre de usuario' });
  });
  protected errorMessage = signal<string | null>(null);

  signUp(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);

    submit(this.signUpForm, async () => {
      try {
        await firstValueFrom(
          this.authService.register(this.signUpFormModel()),
        );
        await firstValueFrom(
          this.dialog
            .open(this.registrationSuccessDialog())
            .afterClosed(),
        );
        await this.router.navigateByUrl('/auth/sign-in');
      } catch (err: unknown) {
        console.error('Failed to register user', err);
        const message =
          err instanceof HttpErrorResponse &&
          typeof err.error?.message === 'string'
            ? err.error.message
            : 'Failed to create account.';
        this.errorMessage.set(message);
      }
    });
  }
}
