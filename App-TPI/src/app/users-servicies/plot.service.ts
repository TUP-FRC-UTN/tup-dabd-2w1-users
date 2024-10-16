import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlotTypeModel } from '../users-models/PlotType';
import { PlotStateModel } from '../users-models/PlotState';
import { PlotModel } from '../users-models/Plot';
import { GetPlotDto } from '../users-models/GetPlotDto';

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly urlTypes = 'http://localhost:8081/plots/types';
  private readonly urlStates = 'http://localhost:8081/plots/states';
  private readonly urlPlot = 'http://localhost:8081/plots';
  private readonly urlGetPlots = 'http://localhost:8081/plots';

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

  getAllPlots(): Observable<GetPlotDto[]>{
    return this.http.get<GetPlotDto[]>(this.urlGetPlots);
  }
}