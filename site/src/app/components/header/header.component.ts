import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <a class="logo" routerLink="/">Prime <span class="accent">Assistência</span></a>
        <nav class="nav">
          <a routerLink="/area-tecnico" class="nav-highlight">Área do Técnico</a>
          <a href="#servicos">Serviços</a>
          <a href="#precos">Preços</a>
          <a routerLink="/login">Gerenciamento</a>
          @if (auth.getUser(); as user) {
            <div class="nav-user">
              <span class="nav-user-name">{{ user.nome }}</span>
              <button class="nav-logout" (click)="sair()" title="Sair">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          } @else {
            <a routerLink="/login" class="nav-login">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Entrar
            </a>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed; top: 0; left: 0; right: 0;
      height: 72px;
      background: rgba(19,19,26,.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      z-index: 1000;
    }
    .container {
      width: 100%; max-width: 1280px;
      margin: 0 auto; padding: 0 24px;
      display: flex; align-items: center;
      justify-content: space-between;
    }
    .logo { font-size: 1.3rem; font-weight: 800; color: var(--text); letter-spacing: -.5px; }
    .accent { color: var(--primary); }
    .nav { display: flex; gap: 24px; align-items: center; }
    .nav a {
      font-size: .9rem; font-weight: 500; color: var(--text-muted);
      text-decoration: none; transition: color .2s;
    }
    .nav a:hover { color: var(--text); }
    .nav-highlight {
      padding: 6px 16px; background: var(--primary); color: #fff !important;
      border-radius: 8px; font-weight: 600;
    }
    .nav-highlight:hover { background: var(--primary-hover) !important; }
    .nav-user { display: flex; align-items: center; gap: 8px; }
    .nav-user-name { font-size: .82rem; color: var(--text-muted); font-weight: 500; }
    .nav-logout {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px;
      background: transparent; border: 1px solid var(--border);
      color: var(--text-muted); cursor: pointer;
      transition: all .2s;
    }
    .nav-logout:hover { background: rgba(239,68,68,.1); color: #f87171; border-color: rgba(239,68,68,.2); }
    .nav-login {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 7px 16px; border: 1px solid var(--border);
      border-radius: 8px; color: var(--text-muted) !important; font-weight: 600;
      transition: all .2s;
    }
    .nav-login:hover { border-color: var(--primary); color: var(--primary) !important; }
  `]
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}

  sair() {
    this.auth.logout();
  }
}
