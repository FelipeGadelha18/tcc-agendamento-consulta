import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = localStorage.getItem('tipoUsuario'); // ADMIN | PACIENTE
    const expected = route.data['role'];

    if (user === expected) {
      return true;
    }

    // Se não tiver permissão, volta pro login
    this.router.navigate(['/login']);
    return false;
  }
}
