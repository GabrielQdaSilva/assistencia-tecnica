import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AreaTecnicoComponent } from './pages/area-tecnico/area-tecnico.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'area-tecnico', component: AreaTecnicoComponent },
  { path: '**', redirectTo: '' }
];
