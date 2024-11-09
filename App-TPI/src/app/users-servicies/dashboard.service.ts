import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap} from 'rxjs';
import { BlockData } from '../users-models/dashboard/BlockData';
import { AgeRange, AgeStatistic } from '../users-models/dashboard/age-distribution';

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
 
  getAgeDistribution(): Observable<AgeRange[]> {
    return this.http.get<AgeRange[]>(`${this.urlUsers}/age-distribution`).pipe(
      tap(data => console.log('Age Distribution Response:', data)) // Verifica los datos en consola
    );
  }
  
  getAgeStatics(): Observable<AgeStatistic> {
    return this.http.get<AgeStatistic>(`${this.urlUsers}/age-statistics`).pipe(
      tap(data => console.log('Age Statistics Response:', data)) // Verifica los datos en consola
    );
  }
}
