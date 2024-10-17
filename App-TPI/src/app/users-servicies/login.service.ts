import { inject, Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private userId: number | null = null;
  private userRole: string[] | null = null;

  private readonly apiService = inject(ApiServiceService);

  constructor() {}

  async setUser(email: string): Promise<void> {
    if (this.userId === null) {
      try {
        const data = await firstValueFrom(this.apiService.getUserByEmail(email));
        console.log(data);
        this.userId = data.id;
        this.userRole = data.roles;
      } catch (error) {
        console.error('No se ha podido establecer el ID del usuario.', error);
        throw error; // Lanzamos el error para que el flujo lo maneje adecuadamente
      }
    } else {
      console.error('El usuario ya ha sido establecido y no se puede modificar.');
    }
  }

  getUserId(): number | null {
    return this.userId;
  }

  getUserRoles(): string[] | null {
    return this.userRole;
  }
}
