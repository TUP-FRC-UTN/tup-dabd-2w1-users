import { Component, Inject } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { DashboardService } from '../../users-servicies/dashboard.service';
import { AgeDistributionResponse, AgeRange, AgeStatistic } from '../../users-models/dashboard/age-distribution';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-graphic-histogram',
  standalone: true,
  imports: [GoogleChartsModule, CommonModule],
templateUrl: './users-graphic-histogram.component.html',
  styleUrl: './users-graphic-histogram.component.css'
})
export class UsersGraphicHistogramComponent {
    
  private readonly apiService = Inject(DashboardService);
  ageDistribution = new AgeDistributionResponse();

  loading = true;
  error: string | null = null;
    
  chartData: any[] = [];
    chartType = ChartType.Histogram;
    chartOptions = {
        title: 'Distribución de Edades de Usuarios',
        titleTextStyle: {
            color: '#333',
            fontSize: 20,
            bold: true
        },
        legend: { position: 'none' },
        height: 400,
        backgroundColor: '#f8f9fa',
        colors: ['#4285F4'],
        animation: {
            startup: true,
            duration: 1000,
            easing: 'out'
        },
        histogram: {
          bucketSize: 10,  // Establece el tamaño del "bucket" para los rangos de edad
          maxNumBuckets: 12,  // Puedes ajustar este valor según la cantidad de datos
          minValue: 0
        },
        hAxis: {
            title: 'Rango de Edad',
            textStyle: {
                fontSize: 12
            }
        },
        vAxis: {
            title: 'Cantidad de Usuarios',
            format: '0',
            minValue: 0,
            textStyle: {
                fontSize: 12
            }
        },
        tooltip: {
            textStyle: {
                fontSize: 14
            }
        }
    };

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.loading = true;
        this.error = null;

        this.apiService.getAgeDistribution().subscribe({
            next: (data: AgeRange[]) => {
              this.ageDistribution.distribution = data;
                this.loading = false;;
                this.processData();
                console.log('Data:', data);
            },
            error: () => {
                this.error = 'Error al cargar las estadísticas';
            }
          });

        this.apiService.getAgeStatics().subscribe({
            next: (data: AgeStatistic) => {
              this.ageDistribution.statistics = data;
            },
            error: () => {
                this.error = 'Error al cargar las estadísticas';
                console.log('Age Distribution:', this.ageDistribution);
            }
        });
           
        
    }  

    private processData() {
        // Preparar datos para el gráfico
        this.chartData = [
            ...this.ageDistribution.distribution.map(item => [
                item.ageRange,
                item.count,
                item.count.toString(),
                `Rango: ${item.ageRange} años\nCantidad: ${item.count}\nPorcentaje: ${item.percentage.toFixed(1)}%`
            ])
        ];
    }
}
