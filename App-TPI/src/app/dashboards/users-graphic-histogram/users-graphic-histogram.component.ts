import { Component, inject } from '@angular/core';
import { DashboardService } from '../../users-servicies/dashboard.service';
import { AgeDistribution, AgeDistributionResponse } from '../../users-models/dashboard/age-distribution';
import { CommonModule } from '@angular/common';
import { ChartType, GoogleChartComponent, GoogleChartsModule } from 'angular-google-charts';
import { UsersGraphicPlotsStatsComponent } from "../users-graphic-plots-stats/users-graphic-plots-stats.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-graphic-histogram',
  standalone: true,
  imports: [GoogleChartsModule, CommonModule,FormsModule],
  templateUrl: './users-graphic-histogram.component.html',
  styleUrl: './users-graphic-histogram.component.css'
})
export class UsersGraphicHistogramComponent {
    
  private readonly apiService = inject(DashboardService);

  ageDistribution: AgeDistributionResponse = new AgeDistributionResponse();

  startDate: string | null = null;
  endDate: string | null = null;
 
  loading = true;
  error: string | null = null;
    
  columnChart = ChartType.ColumnChart; 
  barChartData: any[] = [];

    barChartOptions = {
        title: 'Distribución de Edades de Usuarios Por Estado',
        titleTextStyle: {
            color: '#495057',
            fontSize: 16,
        },
        legend: { position: 'top', alignment: 'center' },
        series: {
            0: { labelInLegend: 'Activos' },
            1: { labelInLegend: 'Inactivos'}
        },
        backgroundColor: 'trasparent',
        colors: ['#4285F4', '#DB4437'],
        animation: {
            startup: true,
            duration: 1000,
            easing: 'out'
        },
        hAxis: {
            title: 'Rango de Edad',
            titleTextStyle: { color: '#6c757d', fontSize: 14, bold: true },
            textStyle: { color: '#495057', fontSize: 12 }
        },
        vAxis: {
            title: 'Cantidad de Usuarios',
            format: '0',
            minValue: 0,
            titleTextStyle: { color: '#6c757d', fontSize: 14, bold: true },
            textStyle: { color: '#495057', fontSize: 12 }
        },
        bar: { groupWidth: '70%' },
        tooltip: {
            showColorCode: true,
            trigger: 'both'
        }
    };

    pieChart = ChartType.PieChart;
    pieChartData: any[] = [];
    pieChartOptions = {
      title: 'Estado de Usuarios',
      titleTextStyle: {
        color: '#495057',
        fontSize: 21,
        bold: true
    },
      //pieHole: 0.4,
      colors: ['#4285F4', '#DB4437'],
      backgroundColor: 'transparent',
      legend: {
          position: 'bottom',
          textStyle: { color: '#495057', fontSize: 12 }
      },
      chartArea: { width: '90%', height: '80%' },
      tooltip: {
          textStyle: { fontSize: 14, color: '#495057' },
          showColorCode: true,
          trigger: 'both'
      }
  };

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this.loading = true;
        this.error = null;

        this.apiService.getAgeDistribution().subscribe({
            next: (data: AgeDistributionResponse) => {
              this.ageDistribution = data;
                this.loading = false;;
                this.processData();
                console.log('Data:', data);
            },
            error: () => {
                this.error = 'Error al cargar las estadísticas';
            }
          });
    }  

    private processData() {
        // Preparar datos para el gráfico
        this.barChartData = [
            //['Rango de Edad', 'Activos', 'Inactivos'],
            ...this.ageDistribution.ageDistribution.map((item: any) => [
              {
                v: item.ageRange,
                f: item.ageRange
              },
              {
                v: item.activeCount,
                f: `Activos: ${item.activeCount} usuarios`
              },
              {
                v: item.inactiveCount,
                f: `Inactivos: ${item.inactiveCount} usuarios.`
              }
            ])
          ];

      
          // Prepare pie chart data
          const status = this.ageDistribution.userStatusDistribution;
          this.pieChartData = [
            //['Estado', 'Cantidad'],
            ['Activos', status.activeUsers],
            ['Inactivos', status.inactiveUsers]
          ];
    }

    filterByDate() {
      if (!this.startDate || !this.endDate) return;
  
      const filteredData = this.ageDistribution.ageDistribution.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(this.startDate!) && itemDate <= new Date(this.endDate!);
      });
  
      this.barChartData = filteredData.map((item) => [
        { v: item.ageRange, f: item.ageRange },
        { v: item.activeCount, f: `Activos: ${item.activeCount} usuarios` },
        { v: item.inactiveCount, f: `Inactivos: ${item.inactiveCount} usuarios` }
      ]);
    }
}
