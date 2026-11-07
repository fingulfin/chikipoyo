import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

type Pregunta = {
  number: number;
  type: 'multiple_choice';
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  imageUrl: string;
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
