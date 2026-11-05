import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { environment } from '@/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'auth-remove-user',
  templateUrl: './remove-user.html',
  imports: [
    RouterLink,
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormField,
  ],
})
export default class AuthRemoveUser {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private removeUserConfirmation = viewChild.required<TemplateRef<unknown>>(
    'removeUserConfirmation'
  );

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

      const confirmed = await firstValueFrom(
        this.dialog.open(this.removeUserConfirmation()).afterClosed()
      );
      if (!confirmed) {
        return;
      }

      try {
        const token =
          typeof localStorage !== 'undefined'
            ? localStorage.getItem('token')
            : null;
        const headers = token
          ? new HttpHeaders({ Authorization: `Bearer ${token}` })
          : new HttpHeaders();

        await firstValueFrom(
          this.http.delete<void>(`${environment.apiUrl}/api/users`, {
            body: { email: emailAddress },
            headers,
          })
        );
        this.successMessage.set('User removed successfully.');
//Aqui removemos el token del localStorage y redirigimos al usuario a la página de inicio de sesión
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          
        }
     
        await this.router.navigateByUrl('/auth/sign-in');


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
