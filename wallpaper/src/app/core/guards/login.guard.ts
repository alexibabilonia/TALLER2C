import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (user) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}
