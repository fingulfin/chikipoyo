import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'auth-remove-user',
  templateUrl: './remove-user.html',
  imports: [
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormField,
  ],
})
export default class AuthRemoveUser {
  private http = inject(HttpClient);

  protected removeUserFormModel = signal({ email: '' });
  protected removeUserForm = form(this.removeUserFormModel, (form) => {
    required(form.email, { message: 'You must enter an email address' });
    email(form.email, { message: 'You must enter a valid email address' });
  });
  protected errorMessage = signal<string | null>(null);
  protected successMessage = signal<string | null>(null);

  remove(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    submit(this.removeUserForm, async () => {
      const emailAddress = this.removeUserFormModel().email;

      try {
        await firstValueFrom(
          this.http.delete<void>(
            `http://localhost:8080/api/users/${encodeURIComponent(emailAddress)}`,
          ),
        );
        this.successMessage.set('User removed successfully.');
      } catch (err: unknown) {
        console.error('Failed to remove user', err);
        const errorMessage =
          err instanceof HttpErrorResponse &&
          typeof err.error === 'object' &&
          err.error !== null &&
          'message' in err.error &&
          typeof err.error.message === 'string'
            ? err.error.message
            : 'Failed to remove user.';
        this.errorMessage.set(errorMessage);
      }
    });
  }
}
