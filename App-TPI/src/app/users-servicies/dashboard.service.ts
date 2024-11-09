import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { BlockData } from '../users-models/dashboard/BlockData';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:9062/dashboard';

  // Método para obtener los datos de los bloques
  getBlockStats(): Observable<BlockData[]>{
    return this.http.get<BlockData[]>(`${this.url}/blockStats`);
  }
 
}
