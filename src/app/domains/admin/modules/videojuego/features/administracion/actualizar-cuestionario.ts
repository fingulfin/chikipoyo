import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Cuestionario, CuestionariosService } from './cuestionarios.service';

@Component({
  selector: 'videojuego-actualizar-cuestionario',
  imports: [MatCheckboxModule],
  templateUrl: './actualizar-cuestionario.html',
})
export default class ActualizarCuestionario implements OnInit {
  private readonly cuestionariosService = inject(CuestionariosService);

  readonly letrasOpciones = ['A.', 'B.', 'C.', 'D.'];
  readonly cantidadCuestionarios = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly cuestionarios = signal<Cuestionario[]>([]);
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
}
