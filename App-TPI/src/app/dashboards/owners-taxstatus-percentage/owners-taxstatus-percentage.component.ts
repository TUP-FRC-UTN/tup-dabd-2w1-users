import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ChartType, GoogleChartComponent } from 'angular-google-charts';
import { Observable } from 'rxjs';
import { TaxStatusPercentage } from '../../users-models/owner/TaxStatusPercentage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-owners-taxstatus-percentage',
  standalone: true,
  imports: [GoogleChartComponent,CommonModule],
  templateUrl: './owners-taxstatus-percentage.component.html',
  styleUrl: './owners-taxstatus-percentage.component.css'
})
export class OwnersTaxstatusPercentageComponent {
  private readonly URL = 'http://localhost:9062/dashboard/percentage-by-tax-status';
  private readonly http = inject(HttpClient);

  chartType: ChartType = ChartType.PieChart;
  chartData: any[] = [];

  kpis = {
    mainStatus: 'Sin datos',
    mainStatusPercentage: 0,
    totalCategories: 0
  };

  chartOptions = {
    height: 400,
    width: '100%',
    backgroundColor: 'transparent',
    legend: { position: 'right' },
    pieHole: 0.4, 
    colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
    pieSliceText: 'percentage',
    pieSliceTextStyle: {
      color: 'white',
      fontSize: 14
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    },
    tooltip: { 
      text: 'percentage',
      trigger: 'selection'
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.loadTaxStats();
  }

  getTaxStatusPercentage(): Observable<TaxStatusPercentage> {
    return this.http.get<TaxStatusPercentage>(this.URL);
  }

  loadTaxStats() {
    this.getTaxStatusPercentage().subscribe({
      next: (data) => {
        this.chartData = [
          ['Estado Fiscal', 'Porcentaje']
        ];

        let maxPercentage = 0;
        let maxStatus = '';
        let totalCategories = 0;

        Object.entries(data).forEach(([status, percentage]) => {
          this.chartData.push([status, percentage]);
          totalCategories++;

          if (percentage > maxPercentage) {
            maxPercentage = percentage;
            maxStatus = status;
          }
        });

        this.kpis = {
          mainStatus: maxStatus,
          mainStatusPercentage: maxPercentage,
          totalCategories: totalCategories
        };

        console.log('Datos cargados:', {
          chartData: this.chartData,
          kpis: this.kpis
        });
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.chartData = [['Estado Fiscal', 'Porcentaje']];
        this.kpis = {
          mainStatus: 'Sin datos',
          mainStatusPercentage: 0,
          totalCategories: 0
        };
      }
    });
  }

  applyFilters() {
    console.log('Aplicando filtros...');
    this.loadTaxStats();
  }

}
