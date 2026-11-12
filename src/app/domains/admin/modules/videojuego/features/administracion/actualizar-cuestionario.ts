import { Component, OnInit, inject, signal } from '@angular/core';
import { CuestionariosService } from './cuestionarios.service';

@Component({
  selector: 'videojuego-actualizar-cuestionario',
  templateUrl: './actualizar-cuestionario.html',
})
export default class ActualizarCuestionario implements OnInit {
  private readonly cuestionariosService = inject(CuestionariosService);

  readonly cantidadCuestionarios = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    const email = typeof localStorage !== 'undefined' ? localStorage.getItem('email') : null;
    if (!email) {
      this.error.set('No se encontró el email del usuario autenticado.');
      return;
    }

    this.cargando.set(true);
    this.cuestionariosService.obtenerPorMaestro(email).subscribe({
      next: (cuestionarios) => {
        this.cantidadCuestionarios.set(cuestionarios.length);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los cuestionarios.');
        this.cargando.set(false);
      },
    });
  }
}
