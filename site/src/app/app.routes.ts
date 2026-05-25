import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AreaTecnicoComponent } from './pages/area-tecnico/area-tecnico.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'area-tecnico', component: AreaTecnicoComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
