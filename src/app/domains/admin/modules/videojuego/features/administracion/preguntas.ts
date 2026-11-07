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

interface PreguntaSeleccion {
  question: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  imageUrl: string;
}

interface PreguntaAbierta {
  question: string;
  suggestedAnswer: string;
  imageUrl: string;
}

interface PreguntaRelacion {
  question: string;
  columns: {
    id: string;
    title: string;
    items: { id: string; text: string }[];
  }[];
  correctMatches: { columnAItemId: string; columnBItemId: string }[];
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

  readonly preguntaAbiertaForm = this.formBuilder.group({
    question: ['', Validators.required],
    suggestedAnswer: ['', Validators.required],
    imageUrl: [''],
  });

  readonly preguntaRelacionForm = this.formBuilder.group({
    question: ['', Validators.required],
    columnATitle: ['Columna A', Validators.required],
    columnAItems: this.formBuilder.array(
      [this.createColumnItem('1'), this.createColumnItem('2')],
      Validators.minLength(1),
    ),
    columnBTitle: ['Columna B', Validators.required],
    columnBItems: this.formBuilder.array(
      [this.createColumnItem('1'), this.createColumnItem('2')],
      Validators.minLength(1),
    ),
    correctMatches: this.formBuilder.array(
      [this.createCorrectMatch()],
      Validators.minLength(1),
    ),
    imageUrl: [''],
  });

  preguntaCreada: Pregunta | null = null;
  preguntaSeleccionCreada: PreguntaSeleccion | null = null;
  preguntaAbiertaCreada: PreguntaAbierta | null = null;
  preguntaRelacionCreada: PreguntaRelacion | null = null;

  crearPregunta(): void {
    if (this.preguntaForm.invalid) {
      this.preguntaForm.markAllAsTouched();
      return;
    }

    this.preguntaCreada = this.preguntaForm.getRawValue();
  }

  crearPreguntaSeleccion(): void {
    if (this.preguntaSeleccionForm.invalid) {
      this.preguntaSeleccionForm.markAllAsTouched();
      return;
    }

    this.preguntaSeleccionCreada =
      this.preguntaSeleccionForm.getRawValue();
  }

  crearPreguntaAbierta(): void {
    if (this.preguntaAbiertaForm.invalid) {
      this.preguntaAbiertaForm.markAllAsTouched();
      return;
    }

    this.preguntaAbiertaCreada = this.preguntaAbiertaForm.getRawValue();
  }

  agregarItemColumna(columna: 'A' | 'B'): void {
    const items =
      columna === 'A'
        ? this.preguntaRelacionForm.controls.columnAItems
        : this.preguntaRelacionForm.controls.columnBItems;
    const ids = new Set(items.controls.map((item) => item.controls.id.value));
    let nextId = 1;
    while (ids.has(String(nextId))) {
      nextId++;
    }
    items.push(this.createColumnItem(String(nextId)));
  }

  quitarItemColumna(columna: 'A' | 'B', index: number): void {
    const items =
      columna === 'A'
        ? this.preguntaRelacionForm.controls.columnAItems
        : this.preguntaRelacionForm.controls.columnBItems;
    const removedId = items.at(index).controls.id.value;
    items.removeAt(index);

    const matches = this.preguntaRelacionForm.controls.correctMatches;
    for (let matchIndex = matches.length - 1; matchIndex >= 0; matchIndex--) {
      const match = matches.at(matchIndex).getRawValue();
      if (
        (columna === 'A' && match.columnAItemId === removedId) ||
        (columna === 'B' && match.columnBItemId === removedId)
      ) {
        matches.removeAt(matchIndex);
      }
    }
  }

  agregarRelacion(): void {
    const columnAItemId =
      this.preguntaRelacionForm.controls.columnAItems.at(0)?.controls.id
        .value ?? '';
    const columnBItemId =
      this.preguntaRelacionForm.controls.columnBItems.at(0)?.controls.id
        .value ?? '';
    this.preguntaRelacionForm.controls.correctMatches.push(
      this.createCorrectMatch(columnAItemId, columnBItemId),
    );
  }

  quitarRelacion(index: number): void {
    this.preguntaRelacionForm.controls.correctMatches.removeAt(index);
  }

  crearPreguntaRelacion(): void {
    if (this.preguntaRelacionForm.invalid) {
      this.preguntaRelacionForm.markAllAsTouched();
      return;
    }

    const value = this.preguntaRelacionForm.getRawValue();
    this.preguntaRelacionCreada = {
      question: value.question,
      columns: [
        { id: 'A', title: value.columnATitle, items: value.columnAItems },
        { id: 'B', title: value.columnBTitle, items: value.columnBItems },
      ],
      correctMatches: value.correctMatches,
      imageUrl: value.imageUrl,
    };
  }

  private createColumnItem(id: string) {
    return this.formBuilder.group({
      id: [id],
      text: ['', Validators.required],
    });
  }

  private createCorrectMatch(
    columnAItemId = '1',
    columnBItemId = '1',
  ) {
    return this.formBuilder.group({
      columnAItemId: [columnAItemId, Validators.required],
      columnBItemId: [columnBItemId, Validators.required],
    });
  }
}
