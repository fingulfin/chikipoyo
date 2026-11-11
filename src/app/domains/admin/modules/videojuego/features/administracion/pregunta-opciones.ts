import { DOCUMENT, JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '@/environments/environment';

type AsignaturaGradoOptions = {
  asignatura: string[];
  grado: string[];
}

type Pregunta = {
  number: number;
  type: 'multiple_choice';
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  imageUrl: string;
  asignatura: string;
  grado: string;
  idmaestro: string;
}

@Component({
  selector: 'videojuego-pregunta-opciones',
  imports: [
    JsonPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pregunta-opciones.html',
})
export default class PreguntaOpciones {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  readonly asignaturaGradoOptions = toSignal(
    this.http.get<AsignaturaGradoOptions>(
      new URL('lecturas/asignatura-grado.json', this.document.baseURI).toString(),
    ),
    { initialValue: { asignatura: [], grado: [] } },
  );

  readonly preguntaForm = this.formBuilder.group({
    number: [1, [Validators.required, Validators.min(1)]],
    type: ['multiple_choice' as const],
    question: ['', Validators.required],
    options: this.formBuilder.array(
      ['A', 'B', 'C', 'D'].map((id) =>
        this.formBuilder.group({
          id: [id],
          text: ['', Validators.required],
        }),
      ),
    ),
    correctAnswer: ['A', Validators.required],
    imageUrl: [''],
    asignatura: ['', Validators.required],
    grado: ['', Validators.required],
  });

  preguntaCreada: Pregunta | null = null;

  crearPregunta(): void {
    if (this.preguntaForm.invalid) {
      this.preguntaForm.markAllAsTouched();
      return;
    }

    this.preguntaCreada = null;
    this.errorAlGuardar = '';

    const email = typeof localStorage !== 'undefined' ? localStorage.getItem('email') : null;
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

    if (!email || !token) {
      this.errorAlGuardar = 'No se encontró el email o el token del usuario autenticado.';
      return;
    }

    const pregunta: Pregunta = {
      ...this.preguntaForm.getRawValue(),
      idmaestro: email,
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post<Pregunta>(
        `${environment.apiUrl}/api/preguntas-evaluacion`,
        pregunta,
        { headers, observe: 'response' },
      )
      .subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.errorAlGuardar = 'No se pudo guardar la pregunta.';
            return;
          }

          this.preguntaCreada = response.body ?? pregunta;
          window.alert('Pregunta guardada con exito');
        },
        error: () => {
          this.errorAlGuardar = 'Error al guardar la pregunta.';
        },
      });
  }

  errorAlGuardar = '';
}
