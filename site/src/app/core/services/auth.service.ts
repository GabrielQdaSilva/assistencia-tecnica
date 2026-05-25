import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Funcionario } from '../types/types';

interface AuthUser {
  id: number;
  nome: string;
  cargo: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/funcionarios';
  private userSubject = new BehaviorSubject<AuthUser | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      try { this.userSubject.next(JSON.parse(saved)); } catch { localStorage.removeItem('auth_user'); }
    }
  }

  login(email: string, senha: string): Observable<AuthUser | null> {
    return this.http.get<Funcionario[]>(`${this.API}?email=${encodeURIComponent(email)}`).pipe(
      map(list => {
        const found = list.find(f => f.senha === senha);
        if (!found || !found.id) return null;
        const user: AuthUser = { id: found.id, nome: found.nome, cargo: found.cargo };
        localStorage.setItem('auth_user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
  }

  getUser(): AuthUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }
}
