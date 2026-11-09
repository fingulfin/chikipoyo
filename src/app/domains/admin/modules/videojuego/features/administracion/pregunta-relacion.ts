import { DOCUMENT, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

type PreguntaRelacionData = {
  question: string;
  columns: {
    id: string;
    title: string;
    items: { id: string; text: string }[];
  }[];
  correctMatches: { columnAItemId: string; columnBItemId: string }[];
  imageUrl: string;
  asignatura: string;
  grado: string;
}

type AsignaturaGradoOptions = {
  asignatura: string[];
  grado: string[];
}

@Component({
  selector: 'videojuego-pregunta-relacion',
  imports: [
    JsonPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pregunta-relacion.html',
})
export default class PreguntaRelacion {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  readonly asignaturaGradoOptions = toSignal(
    this.http.get<AsignaturaGradoOptions>(
      new URL('lecturas/asignatura-grado.json', this.document.baseURI).toString(),
    ),
    { initialValue: { asignatura: [], grado: [] } },
  );

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
    asignatura: ['', Validators.required],
    grado: ['', Validators.required],
  });

  preguntaRelacionCreada: PreguntaRelacionData | null = null;

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
      asignatura: value.asignatura,
      grado: value.grado,
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
