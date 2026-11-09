import { DOCUMENT, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

type PreguntaAbiertaData = {
  question: string;
  suggestedAnswer: string;
  imageUrl: string;
  asignatura: string;
  grado: string;
}

type AsignaturaGradoOptions = {
  asignatura: string[];
  grado: string[];
}

@Component({
  selector: 'videojuego-pregunta-abierta',
  imports: [
    JsonPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pregunta-abierta.html',
})
export default class PreguntaAbierta {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  readonly asignaturaGradoOptions = toSignal(
    this.http.get<AsignaturaGradoOptions>(
      new URL('lecturas/asignatura-grado.json', this.document.baseURI).toString(),
    ),
    { initialValue: { asignatura: [], grado: [] } },
  );

  readonly preguntaAbiertaForm = this.formBuilder.group({
    question: ['', Validators.required],
    suggestedAnswer: ['', Validators.required],
    imageUrl: [''],
    asignatura: ['', Validators.required],
    grado: ['', Validators.required],
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
