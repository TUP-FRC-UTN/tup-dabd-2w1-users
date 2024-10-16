import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlotTypeModel } from '../users-models/PlotType';
import { PlotStateModel } from '../users-models/PlotState';
import { PlotModel } from '../users-models/Plot';

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly urlTypes = 'http://localhost:8080/plots/types';
  private readonly urlStates = 'http://localhost:8080/plots/states';
  private readonly urlPlot = 'http://localhost:8080/plots';

  constructor() { }

  getAllTypes(): Observable<PlotTypeModel[]>{
    return this.http.get<PlotTypeModel[]>(this.urlTypes);
  }
  
  getAllStates(): Observable<PlotStateModel[]>{
    return this.http.get<PlotStateModel[]>(this.urlStates);
  }

  postPlot(plot: PlotModel): Observable<PlotModel>{
    return this.http.post<PlotModel>(this.urlPlot, plot);
  }
}