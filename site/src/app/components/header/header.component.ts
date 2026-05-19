import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="header">
      <div class="header-inner">
        <a routerLink="/" class="logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          <span>Assistência <span class="accent">Técnica</span></span>
        </a>
        <nav class="nav">
          <div class="dropdown">
            <span class="nav-link dropdown-trigger">Menu</span>
            <div class="dropdown-content">
              <div class="dropdown-group">
                <span class="dropdown-label">Clientes</span>
                <a (click)="listar('/clientes')" routerLinkActive="active">Listar</a>
                <a routerLink="/clientes/cadastrar" routerLinkActive="active">Cadastrar</a>
                <a routerLink="/clientes/consultar" routerLinkActive="active">Consultar</a>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-group">
                <span class="dropdown-label">Funcionários</span>
                <a (click)="listar('/funcionarios')" routerLinkActive="active">Listar</a>
                <a routerLink="/funcionarios/cadastrar" routerLinkActive="active">Cadastrar</a>
                <a routerLink="/funcionarios/consultar" routerLinkActive="active">Consultar</a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: rgba(10,10,15,.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      z-index: 100;
    }
    .header-inner {
      max-width: 1120px; margin: 0 auto; padding: 0 24px;
      display: flex; align-items: center; justify-content: space-between;
      height: 60px;
    }
    .logo {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; color: var(--text);
      font-size: 1.05rem; font-weight: 700;
    }
    .accent { color: var(--primary); }
    .nav { display: flex; gap: 4px; }
    .dropdown-trigger { cursor: pointer; user-select: none; }
    .nav-link {
      padding: 8px 16px;
      color: var(--text-muted); text-decoration: none;
      font-size: .85rem; font-weight: 500;
      border-radius: 8px; cursor: pointer;
      transition: all .15s;
    }
    .nav-link:hover { color: var(--text); background: var(--surface-hover); }
    .nav-link.active { color: var(--primary); background: rgba(59,130,246,.1); }
    .dropdown { position: relative; }
    .dropdown-content {
      display: none;
      position: absolute; top: 100%; left: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      min-width: 170px;
      padding: 6px;
      box-shadow: var(--shadow);
    }
    .dropdown-content a {
      display: block;
      padding: 9px 14px;
      color: var(--text-muted); text-decoration: none;
      font-size: .85rem; border-radius: 6px; cursor: pointer;
      transition: all .15s;
    }
    .dropdown-content a:hover { background: var(--surface-hover); color: var(--text); }
    .dropdown-content a.active { color: var(--primary); background: rgba(59,130,246,.1); }
    .dropdown-group { padding: 2px 0; }
    .dropdown-label {
      display: block; padding: 6px 14px 4px;
      font-size: .7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: var(--text-muted); opacity: .6;
    }
    .dropdown-divider { height: 1px; background: var(--border); margin: 4px 8px; }
    .dropdown:hover .dropdown-content { display: block; }
  `]
})
export class HeaderComponent {
  constructor(private router: Router) {}

  listar(path: string) {
    this.router.navigate([path], { queryParams: { _: Date.now() }, replaceUrl: true });
  }
}
