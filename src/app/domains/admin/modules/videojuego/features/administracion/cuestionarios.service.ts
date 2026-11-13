import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@/environments/environment';
import { PreguntaEvaluacion } from './preguntas-evaluacion.service';

export type CuestionarioRequest = {
  idmaestro: string;
  titulo: string;
  preguntas: PreguntaEvaluacion[];
}

export type OpcionCuestionario = {
  id: string;
  text: string;
}

export type PreguntaCuestionario = PreguntaEvaluacion & {
  options?: OpcionCuestionario[];
  correctAnswer?: string;
}

export type Cuestionario = {
  idmaestro: string;
  titulo: string;
  preguntas: PreguntaCuestionario[];
  estaActivo: boolean;
}

@Injectable({ providedIn: 'root' })
export class CuestionariosService {
  private readonly http = inject(HttpClient);
  private readonly cuestionarioUrl = `${environment.apiUrl}/api/cuestionarios`;

  obtenerPorMaestro(email: string) {
    return this.http.get<Cuestionario[]>(
      `${environment.apiUrl}/api/public/maestro/${encodeURIComponent(email)}`,
    );
  }

  actualizarEnBloque(cuestionarios: Cuestionario[], token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Cuestionario[]>(
      `${environment.apiUrl}/api/cuestionarios/batch/update`,
      cuestionarios,
      { headers },
    );
  }

  crear(cuestionario: CuestionarioRequest, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<unknown>(this.cuestionarioUrl, cuestionario, { headers });
  }
}
