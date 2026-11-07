import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

interface Pregunta {
  number: number;
  type: 'multiple_choice';
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  imageUrl: string;
}

@Component({
  selector: 'videojuego-preguntas',
  imports: [
    JsonPipe,
    MatButtonModule,
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './preguntas.html',
})
export default class Preguntas {
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
