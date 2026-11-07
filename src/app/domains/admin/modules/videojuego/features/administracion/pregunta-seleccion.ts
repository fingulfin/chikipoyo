import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
