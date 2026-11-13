import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Cuestionario, CuestionariosService } from './cuestionarios.service';

@Component({
  selector: 'videojuego-actualizar-cuestionario',
  imports: [MatButtonModule, MatCheckboxModule],
  templateUrl: './actualizar-cuestionario.html',
})
export default class ActualizarCuestionario implements OnInit {
  private readonly cuestionariosService = inject(CuestionariosService);

  readonly letrasOpciones = ['A.', 'B.', 'C.', 'D.'];
  readonly cantidadCuestionarios = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly actualizando = signal(false);
  readonly cuestionarios = signal<Cuestionario[]>([]);
  readonly error = signal('');
  readonly actualizacionExitosa = signal(false);

  ngOnInit(): void {
    const email = typeof localStorage !== 'undefined' ? localStorage.getItem('email') : null;
    if (!email) {
      this.error.set('No se encontró el email del usuario autenticado.');
      return;
    }

    this.cargando.set(true);
    this.cuestionariosService.obtenerPorMaestro(email).subscribe({
      next: (cuestionarios) => {
        this.cuestionarios.set(cuestionarios);
        this.cantidadCuestionarios.set(cuestionarios.length);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los cuestionarios.');
        this.cargando.set(false);
      },
    });
  }

  cambiarEstado(cuestionarioIndex: number, estaActivo: boolean): void {
    this.cuestionarios.update((cuestionarios) =>
      cuestionarios.map((cuestionario, index) =>
        index === cuestionarioIndex ? { ...cuestionario, estaActivo } : cuestionario,
      ),
    );
    this.actualizacionExitosa.set(false);
  }

  actualizarCuestionarios(): void {
    const cuestionarios = this.cuestionarios();
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      this.error.set('No se encontró el token del usuario autenticado.');
      this.actualizacionExitosa.set(false);
      return;
    }

    this.error.set('');
    this.actualizacionExitosa.set(false);
    this.actualizando.set(true);

    this.cuestionariosService.actualizarEnBloque(cuestionarios, token).subscribe({
      next: () => {
        this.actualizando.set(false);
        this.actualizacionExitosa.set(true);
      },
      error: (error: unknown) => {
        const mensajeServidor =
          error instanceof HttpErrorResponse &&
          typeof error.error === 'object' &&
          error.error !== null &&
          'message' in error.error &&
          typeof error.error.message === 'string'
            ? error.error.message
            : null;
        const detalle = mensajeServidor ?? (error instanceof Error ? error.message : String(error));
        this.error.set(`No se pudieron actualizar los cuestionarios: ${detalle}`);
        this.actualizando.set(false);
      },
    });
  }
}
