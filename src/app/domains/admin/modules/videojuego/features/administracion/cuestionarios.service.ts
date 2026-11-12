import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@/environments/environment';
import { PreguntaEvaluacion } from './preguntas-evaluacion.service';

export type CuestionarioRequest = {
  idmaestro: string;
  titulo: string;
  preguntas: PreguntaEvaluacion[];
}

@Injectable({ providedIn: 'root' })
export class CuestionariosService {
  private readonly http = inject(HttpClient);
  private readonly cuestionarioUrl = `${environment.apiUrl}/api/cuestionarios`;

  crear(cuestionario: CuestionarioRequest, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<unknown>(this.cuestionarioUrl, cuestionario, { headers });
  }
}
