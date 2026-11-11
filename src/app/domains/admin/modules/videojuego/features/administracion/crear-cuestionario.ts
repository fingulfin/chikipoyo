import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

type AsignaturaGradoOptions = {
  asignatura: string[];
  grado: string[];
}

@Component({
  selector: 'videojuego-crear-cuestionario',
  imports: [
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crear-cuestionario.html',
})
export default class CrearCuestionario {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);

  readonly cuestionarioForm = this.formBuilder.group({
    alcance: ['todas'],
    asignatura: [''],
  });

  readonly alcanceSeleccionado = toSignal(
    this.cuestionarioForm.controls.alcance.valueChanges,
    { initialValue: this.cuestionarioForm.controls.alcance.value },
  );

  readonly asignaturaGradoOptions = toSignal(
    this.http.get<AsignaturaGradoOptions>(
      new URL('lecturas/asignatura-grado.json', this.document.baseURI).toString(),
    ),
    { initialValue: { asignatura: [], grado: [] } },
  );
}
