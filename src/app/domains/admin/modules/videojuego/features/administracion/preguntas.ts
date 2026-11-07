import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import PreguntaAbierta from './pregunta-abierta';
import PreguntaOpciones from './pregunta-opciones';
import PreguntaRelacion from './pregunta-relacion';
import PreguntaSeleccion from './pregunta-seleccion';

@Component({
  selector: 'videojuego-preguntas',
  imports: [
    MatCard,
    MatTabsModule,
    PreguntaAbierta,
    PreguntaOpciones,
    PreguntaRelacion,
    PreguntaSeleccion,
  ],
  templateUrl: './preguntas.html',
})
export default class Preguntas {
}
