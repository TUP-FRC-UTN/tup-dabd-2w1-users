import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { Observable } from 'rxjs';
import { OwnerStatusCount } from '../../users-models/owner/OwnerStatusCount';

@Component({
  selector: 'app-owner-status-count',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './owner-status-count.component.html',
  styleUrls: ['./owner-status-count.component.css'] // Corrección aquí
})
export class OwnerStatusCountComponent implements OnInit {
  private readonly URL = 'http://localhost:9062/owners/count-by-status-per-month';
  private readonly http = inject(HttpClient);

  chartType: ChartType = ChartType.ColumnChart;
  chardata: any[] = [];
  totalOwners = 0;

  kpis = {  
    totalActive: 0,
    activePercentage: 0,
    mostActiveMonth: '',
    mostActiveCount: 0
  };

  chartOptions = {
    height: 400,
    width: '100%',
    backgroundColor: 'transparent',
    legend: { position: 'top' },
    bar: { groupWidth: '70%' },
    isStacked: false,
    vAxis: {
      title: 'Cantidad de Propietarios',
      minValue: 0
    },
    hAxis: {
      title: 'Mes'
    },
    colors: ['#34A853', '#EA4335'],
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    }
  };

  constructor() {}

  ngOnInit() {
    this.loadOwnerStats();  // Corrección aquí
  }

  getOwnersCountByStatusPerMonth(): Observable<OwnerStatusCount[]> {
    return this.http.get<OwnerStatusCount[]>(`${this.URL}`);
  }

  loadOwnerStats() {
    this.getOwnersCountByStatusPerMonth().subscribe({
      next: (data: any[]) => {
        // Preparar los datos para el gráfico
        //this.chardata = [
          //['Mes', 'Activos', 'Inactivos']
        //];

        this.chardata = [
          ['Mes', 1]
        ];
        let totalActive = 0;
        let totalInactive = 0;
        let maxActiveCount = 0;
        let maxActiveMonth = '';

        // Procesar cada registro
        data.forEach(stat => {
          // Asegurarse de que los valores sean números
          const activeCount = Number(stat.activeCount) || 0;
          const inactiveCount = Number(stat.inactiveCount) || 0;

          this.chardata.push([
            stat.month,
            activeCount,
            inactiveCount
          ]);

          // Actualizar totales
          totalActive += activeCount;
          totalInactive += inactiveCount;

          // Actualizar mes con mayor cantidad de activos
          if (activeCount > maxActiveCount) {
            maxActiveCount = activeCount;
            maxActiveMonth = stat.month;
          }
        });

        // Calcular el total de propietarios
        const totalOwners = totalActive + totalInactive;

        // Actualizar los KPIs
        this.totalOwners = totalOwners;
        this.kpis = {
          totalActive: totalActive,
          activePercentage: totalOwners > 0 ? Math.round((totalActive / totalOwners) * 100) : 0,
          mostActiveMonth: maxActiveMonth || 'No hay datos',
          mostActiveCount: maxActiveCount
        };

        console.log('Datos cargados:', {
          chartData: this.chardata,
          totalActive,
          totalInactive,
          totalOwners,
          kpis: this.kpis
        });
      },
      error: (error: any) => {
        console.error('Error al cargar estadísticas:', error);
        // Reiniciar datos en caso de error
        this.chardata = [['Mes', 'Activos', 'Inactivos']];
        this.totalOwners = 0;
        this.kpis = {
          totalActive: 0,
          activePercentage: 0,
          mostActiveMonth: 'No hay datos',
          mostActiveCount: 0
        };
      }
    });
  }

  applyFilters() {
    console.log('Aplicando filtros...');
    this.loadOwnerStats();
  }
}
