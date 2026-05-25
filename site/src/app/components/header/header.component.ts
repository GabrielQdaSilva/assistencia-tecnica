import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <a class="logo" routerLink="/">Assistência <span class="accent">Técnica</span></a>
        <nav class="nav">
          <a routerLink="/area-tecnico" class="nav-highlight">Área do Técnico</a>
          <a href="#servicos">Serviços</a>
          <a href="#precos">Preços</a>
          <a href="#gerenciamento">Gerenciamento</a>
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
    .nav { display: flex; gap: 24px; }
    .nav a {
      font-size: .9rem; font-weight: 500; color: var(--text-muted);
      transition: color .2s;
    }
    .nav a:hover { color: var(--text); }
    .nav-highlight {
      padding: 6px 16px; background: var(--primary); color: #fff !important;
      border-radius: 8px; font-weight: 600;
    }
    .nav-highlight:hover { background: var(--primary-hover) !important; }
  `]
})
export class HeaderComponent {}
