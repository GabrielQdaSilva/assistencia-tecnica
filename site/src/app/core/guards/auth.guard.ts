import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Redireciona para /cadastro se não estiver autenticado */
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.parseUrl('/cadastro');
};

/** Permite acesso apenas a clientes autenticados */
export const clienteGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isCliente()) return true;
  if (auth.isLoggedIn()) return router.parseUrl('/area-tecnico');
  return router.parseUrl('/cadastro');
};

/** Permite acesso apenas a funcionários autenticados */
export const funcionarioGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isFuncionarioOuGerente()) return true;
  if (auth.isLoggedIn()) return router.parseUrl('/minha-conta');
  return router.parseUrl('/cadastro');
};

/** Permite acesso apenas a gerentes */
export const gerenteGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() && auth.isGerente()) return true;
  if (auth.isLoggedIn() && auth.isFuncionario()) return router.parseUrl('/area-tecnico');
  if (auth.isLoggedIn()) return router.parseUrl('/minha-conta');
  return router.parseUrl('/cadastro');
};
