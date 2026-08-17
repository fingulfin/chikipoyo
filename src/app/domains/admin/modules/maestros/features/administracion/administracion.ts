import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'maestros-administracion',
  imports: [MatCard],
  template: `
    <div class="p-6 sm:p-12">
      <mat-card>
        <h2 class="text-2xl font-bold">Administraci\u00f3n</h2>
        <p class="mt-2 text-neutral-500">
          Gesti\u00f3n de maestros. Esta secci\u00f3n est\u00e1 en construcci\u00f3n.
        </p>
      </mat-card>
    </div>
  `,
})
export default class MaestrosAdministracion {}
