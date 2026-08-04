import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const roleEsperado = route.data['role'];

    if (!tipoUsuario) {
      this.router.navigate(['/login']);
      return false;
    }

    const rolesEsperadas = Array.isArray(roleEsperado) ? roleEsperado : [roleEsperado];
    if (rolesEsperadas.includes(tipoUsuario)) {
      return true;
    }

    // Se tentar acessar rota errada
    this.router.navigate(['/login']);
    return false;
  }
}
