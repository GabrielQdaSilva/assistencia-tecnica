import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../types/types';

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private readonly API = 'http://localhost:3000/funcionarios';
  constructor(private http: HttpClient) {}

  listar(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.API);
  }

  buscarPorId(id: number | string): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.API}/${id}`);
  }

  incluir(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.API, funcionario);
  }

  editar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.API}/${funcionario.id}`, funcionario);
  }

  excluir(id: number | string): Observable<Funcionario> {
    return this.http.delete<Funcionario>(`${this.API}/${id}`);
  }
}
