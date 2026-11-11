import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { PreguntaEvaluacion, PreguntasEvaluacionService } from './preguntas-evaluacion.service';

type AsignaturaGradoOptions = {
  asignatura: string[];
  grado: string[];
}

@Component({
  selector: 'videojuego-crear-cuestionario',
  imports: [
    MatButtonModule,
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
  private readonly preguntasEvaluacionService = inject(PreguntasEvaluacionService);

  readonly cuestionarioForm = this.formBuilder.group({
    alcance: ['todas'],
    asignatura: ['', Validators.required],
  });

  preguntas = signal<PreguntaEvaluacion[]>([]);
  buscandoPreguntas = signal(false);
  preguntasBuscadas = signal(false);
  errorAlBuscar = signal('');

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

  buscarPreguntas(): void {
    const { alcance, asignatura } = this.cuestionarioForm.getRawValue();
    if (alcance === 'asignatura' && !asignatura) {
      this.cuestionarioForm.controls.asignatura.markAsTouched();
      return;
    }

    const idmaestro = typeof localStorage !== 'undefined' ? localStorage.getItem('email') : null;
    if (!idmaestro) {
      this.errorAlBuscar.set('No se encontró el email del usuario autenticado.');
      this.preguntas.set([]);
      this.buscandoPreguntas.set(false);
      this.preguntasBuscadas.set(false);
      return;
    }

    this.buscandoPreguntas.set(true);
    this.preguntasBuscadas.set(false);
    this.errorAlBuscar.set('');
    this.preguntas.set([]);

    const solicitud =
      alcance === 'asignatura'
        ? this.preguntasEvaluacionService.obtenerPorAsignatura(idmaestro, asignatura)
        : this.preguntasEvaluacionService.obtenerTodas(idmaestro);

    solicitud.subscribe({
      next: (preguntas) => {
        this.preguntas.set(preguntas);
        this.preguntasBuscadas.set(true);
        this.buscandoPreguntas.set(false);
      },
      error: () => {
        this.errorAlBuscar.set('No se pudieron cargar las preguntas.');
        this.buscandoPreguntas.set(false);
      },
    });
  }
}
