import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'maestros-administracion',
  imports: [MatCard, MatTabsModule],
  templateUrl: './administracion.html',
})
export default class MaestrosAdministracion {}
