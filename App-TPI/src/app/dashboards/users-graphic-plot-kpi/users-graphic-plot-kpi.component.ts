import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PlotTypeCount } from '../../users-models/dashboard/PlotTypeCount';
import { PlotStateCount } from '../../users-models/dashboard/PlotStateCount';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-graphic-plot-kpi',
  standalone: true,
  imports: [],
  templateUrl: './users-graphic-plot-kpi.component.html',
  styleUrl: './users-graphic-plot-kpi.component.css'
})
export class UsersGraphicPlotKPIComponent implements OnInit {
  totalLots: number = 0;
  residentialLots: number = 0;
  commercialLots: number = 0;
  emptyLots: number = 0;
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPlotsByType().subscribe(data => {
      this.updateTypeCounts(data);
    });

    this.getPlotsByState().subscribe(data => {
      this.updateTotalLots(data);
    });
  }

  private getPlotsByType(): Observable<PlotTypeCount[]> {
    return this.http.get<PlotTypeCount[]>('http://localhost:9062/dashboard/Plot-By-Type-Count');
  }

  private getPlotsByState(): Observable<PlotStateCount[]> {
    return this.http.get<PlotStateCount[]>('http://localhost:9062/dashboard/Plot-By-State-Count');
  }

  private updateTypeCounts(data: PlotTypeCount[]) {
    data.forEach(item => {
      switch (item.type) {
        case 'Residencial':
          this.residentialLots = item.count;
          break;
        case 'Comercial':
          this.commercialLots = item.count;
          break;
        case 'Baldío':
          this.emptyLots = item.count;
          break;
      }
    });
  }

  private updateTotalLots(data: PlotStateCount[]) {
    this.totalLots = data.reduce((acc, curr) => acc + curr.count, 0);
  }
}