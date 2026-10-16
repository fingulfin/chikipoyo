import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'maestros-administracion',
  imports: [MatCard, MatTabsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './administracion.html',
})
export default class MaestrosAdministracion {}
