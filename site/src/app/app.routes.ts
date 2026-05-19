import { Routes } from '@angular/router';
import { ListagemFuncionarioComponent } from './pages/listagem/listagem-funcionario.component';
import { ListagemClienteComponent } from './pages/listagem/listagem-cliente.component';
import { CadastrarFuncionarioComponent } from './pages/cadastrar/cadastrar-funcionario.component';
import { CadastrarClienteComponent } from './pages/cadastrar/cadastrar-cliente.component';
import { AlterarFuncionarioComponent } from './pages/alterar/alterar-funcionario.component';
import { AlterarClienteComponent } from './pages/alterar/alterar-cliente.component';
import { ConsultarFuncionarioComponent } from './pages/consultar/consultar-funcionario.component';
import { ConsultarClienteComponent } from './pages/consultar/consultar-cliente.component';

export const routes: Routes = [
  { path: '', component: ListagemFuncionarioComponent, pathMatch: 'full' },

  { path: 'funcionarios', component: ListagemFuncionarioComponent },
  { path: 'funcionarios/cadastrar', component: CadastrarFuncionarioComponent },
  { path: 'funcionarios/alterar/:id', component: AlterarFuncionarioComponent },
  { path: 'funcionarios/consultar', component: ConsultarFuncionarioComponent },

  { path: 'clientes', component: ListagemClienteComponent },
  { path: 'clientes/cadastrar', component: CadastrarClienteComponent },
  { path: 'clientes/alterar/:id', component: AlterarClienteComponent },
  { path: 'clientes/consultar', component: ConsultarClienteComponent },

  { path: '**', redirectTo: '/funcionarios' }
];
