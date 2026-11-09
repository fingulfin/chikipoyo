import { DOCUMENT, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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

    this.preguntaCreada = this.preguntaForm.getRawValue();
  }
}
