import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private userId: number | null = null;
  private userRole: string | null = null;

  constructor() {}
  setUserId(id: number): void {
    if (this.userId === null) {
      this.userId = id;
    } else {
      console.error('El ID del usuario ya ha sido establecido y no se puede modificar.');
    }
  }

  setUserRole(role: string): void {
    if (this.userRole === null) {
      this.userRole = role;
    } else {
      console.error('El rol del usuario ya ha sido establecido y no se puede modificar.');
    }
  }

  getUserId(): number | null {
    return this.userId;
  }

  getUserRole(): string | null {
    return this.userRole;
  }
}
