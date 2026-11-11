import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@/environments/environment';

export type PreguntaEvaluacion = {
  question: string;
}

@Injectable({ providedIn: 'root' })
export class PreguntasEvaluacionService {
  private readonly http = inject(HttpClient);
  private readonly maestroUrl = `${environment.apiUrl}/api/preguntas-evaluacion/maestro`;
 
  obtenerTodas(idmaestro: string) {
    return this.http.post<PreguntaEvaluacion[]>(
      this.maestroUrl,
      { idmaestro },
      { headers: this.authHeaders() },
    );
  }

  obtenerPorAsignatura(idmaestro: string, asignatura: string) {
    return this.http.post<PreguntaEvaluacion[]>(
      `${this.maestroUrl}/asignatura`,
      { idmaestro, asignatura },
      { headers: this.authHeaders() },
    );
  }

  private authHeaders(): HttpHeaders {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}
