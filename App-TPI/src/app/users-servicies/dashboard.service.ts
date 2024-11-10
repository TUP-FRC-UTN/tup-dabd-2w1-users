import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockData } from '../users-models/dashboard/BlockData';
import { AgeDistributionResponse } from '../users-models/dashboard/age-distribution';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);
  private readonly urlOwners = 'http://localhost:9062/dashboard';
  private readonly urlUsers = 'http://localhost:9060/dashboard';


  // Método para obtener los datos de los bloques
  getBlockStats(): Observable<BlockData[]>{
    return this.http.get<BlockData[]>(`${this.urlOwners}/blockStats`);
  }

  getAgeDistribution(): Observable<AgeDistributionResponse> {
    return this.http.get<AgeDistributionResponse>(`${this.urlUsers}/age-data`);
  }
}
