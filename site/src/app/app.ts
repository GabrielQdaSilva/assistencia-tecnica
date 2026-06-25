import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);
  get isHome() { return this.router.url === '/'; }
  get isLogin() { return this.router.url === '/login'; }
  get isDashboard() { return ['/area-tecnico', '/area-gerente', '/minha-conta'].includes(this.router.url); }
}
