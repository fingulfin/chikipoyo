import { DOCUMENT, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

type PreguntaSeleccionData = {
  question: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  imageUrl: string;
  asignatura: string;
  grado: string;
}

type AsignaturaGradoOptions = {
  asignatura: string[];
  grado: string[];
}

@Component({
  selector: 'videojuego-pregunta-seleccion',
  imports: [
    JsonPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pregunta-seleccion.html',
})
export default class PreguntaSeleccion {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  readonly asignaturaGradoOptions = toSignal(
    this.http.get<AsignaturaGradoOptions>(
      new URL('lecturas/asignatura-grado.json', this.document.baseURI).toString(),
    ),
    { initialValue: { asignatura: [], grado: [] } },
  );

  readonly preguntaSeleccionForm = this.formBuilder.group({
    question: ['', Validators.required],
    options: this.formBuilder.array(
      ['A', 'B', 'C', 'D'].map((id) =>
        this.formBuilder.group({
          id: [id],
          text: ['', Validators.required],
        }),
      ),
    ),
    correctAnswers: this.formBuilder.control<string[]>([], Validators.required),
    imageUrl: [''],
    asignatura: ['', Validators.required],
    grado: ['', Validators.required],
  });

  preguntaSeleccionCreada: PreguntaSeleccionData | null = null;

  crearPreguntaSeleccion(): void {
    if (this.preguntaSeleccionForm.invalid) {
      this.preguntaSeleccionForm.markAllAsTouched();
      return;
    }

    this.preguntaSeleccionCreada =
      this.preguntaSeleccionForm.getRawValue();
  }
}
