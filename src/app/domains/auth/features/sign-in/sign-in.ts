import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

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
    email: 'hughes.brian@company.com',
    password: 'Secure-Password-123$%^',
  });
  protected signInForm = form(this.signInFormModel, (form) => {
    required(form.email, { message: 'You must enter an email address' });
    email(form.email, { message: 'You must enter a valid email address' });

    required(form.password, { message: 'You must enter a password' });
  });

  protected errorMessage = signal<string | null>(null);

  signIn(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);

    submit(this.signInForm, async () => {
      try {
        const response = await this.authService
          .login({
            email: this.signInFormModel().email,
            password: this.signInFormModel().password,
          })
          .toPromise();

        if (response?.token) {
          localStorage.setItem('token', response.token);
          this.router.navigateByUrl('/admin/dashboards');
        }
      } catch (err: unknown) {
        const httpError = err as { error?: { error?: string } };
        const errorText = httpError.error?.error ?? 'Authentication failed';
        this.errorMessage.set(errorText);
      }
    });
  }
}
