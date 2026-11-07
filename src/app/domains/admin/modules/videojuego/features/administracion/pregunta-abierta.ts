import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type PreguntaAbiertaData = {
  question: string;
  suggestedAnswer: string;
  imageUrl: string;
}

@Component({
  selector: 'videojuego-pregunta-abierta',
  imports: [
    JsonPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pregunta-abierta.html',
})
export default class PreguntaAbierta {
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly preguntaAbiertaForm = this.formBuilder.group({
    question: ['', Validators.required],
    suggestedAnswer: ['', Validators.required],
    imageUrl: [''],
  });

  preguntaAbiertaCreada: PreguntaAbiertaData | null = null;

  crearPreguntaAbierta(): void {
    if (this.preguntaAbiertaForm.invalid) {
      this.preguntaAbiertaForm.markAllAsTouched();
      return;
    }

    this.preguntaAbiertaCreada = this.preguntaAbiertaForm.getRawValue();
  }
}
