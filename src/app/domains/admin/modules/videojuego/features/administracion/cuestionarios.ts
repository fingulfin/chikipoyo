import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import ActualizarCuestionario from './actualizar-cuestionario';
import CrearCuestionario from './crear-cuestionario';

@Component({
  selector: 'videojuego-cuestionarios',
  imports: [MatCard, MatTabsModule, CrearCuestionario, ActualizarCuestionario],
  templateUrl: './cuestionarios.html',
})
export default class Cuestionarios {}
