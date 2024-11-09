import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { UserRoleCount } from '../../users-models/dashboard/UserRoleCount';
import { Observable } from 'rxjs';
import { PlotByStateCount } from '../../users-models/users/PlotByStateCount';

@Component({
  selector: 'app-users-graphic-user',
  standalone: true,
  imports: [GoogleChartsModule, CommonModule],
  templateUrl: './users-graphic-user.component.html',
  styleUrl: './users-graphic-user.component.css'
})
export class UsersGraphicUserComponent {

 /* columnChartType: ChartType = ChartType.ColumnChart;
  columnChartData = [
    ['Enero', 1000],
    ['Febrero', 1170],
    ['Marzo', 660],
    ['Abril', 1030]
  ];
  columnChartOptions = {
    title: 'Comparación de Ingresos',
    hAxis: { title: 'Mes' },
    vAxis: { title: 'Cantidad' },
    legend: 'none',
    width: '100%',
    height: '100%'
  };

  // KPIs (datos adicionales para el KPI)
  columnKPIs = {
    totalPeriod: 3860,
    monthlyAverage: 965
  };

  // Método para manejar el filtro
  //7aplyFilters() {
    // Aquí puedes aplicar la lógica de filtro y actualizar los datos
    //console.log('Filtros aplicados');
  //}*/
    private readonly URL = 'http://localhost:9060/dashboard/users-by-role';
    private readonly URL_PlotByStateCount = "http://localhost:9062/dashboard/Plot-By-State-Count";
    private readonly http = inject(HttpClient);

    getUsersByRole(): Observable<UserRoleCount[]> {
      return this.http.get<UserRoleCount[]>(`${this.URL}`);
    }

    getPlotByStateCount(): Observable<PlotByStateCount[]> {
      return this.http.get<PlotByStateCount[]>(`${this.URL_PlotByStateCount}`);
    }
  
    // Configuración del gráfico de columnas (roles)
    roleChartType: ChartType = ChartType.ColumnChart;
    roleChartData = [['', 0]];
    roleChartOptions = {
      height: 400,
      width: '100%',
      backgroundColor: 'transparent',
      legend: { position: 'none' },
      bar: { groupWidth: '70%' },
      vAxis: {
        title: 'Cantidad de Usuarios',
        minValue: 0
      },
      hAxis: {
        title: 'Roles'
      },
      animation: {
        startup: true,
        duration: 1000,
        easing: 'out'
      }
    };

    // Configuración del gráfico circular (estados de lotes)
    plotStateChartType: ChartType = ChartType.PieChart;
    plotStateChartData = [['', 0]];
    plotStateChartOptions = {
      height: 400,
      width: '100%',
      backgroundColor: 'transparent',
      pieHole: 0.4,
      colors: ['#4CAF50', '#2196F3'],
      legend: { position: 'right' },
      animation: {
        startup: true,
        duration: 1000,
        easing: 'out'
      }
    };

    // KPIs
    roleKPIs = {
      mostCommonRole: 'Propietario',
      mostCommonRoleCount: 0,
      averageUsersPerRole: 0
    };

    plotStateKPIs = {
      totalPlots: 0,
      mostCommonState: '',
      mostCommonStateCount: 0
    };
  
    totalUsers = 0;
  
    constructor() { }
  
    roleColors(roleName: string): string {
      switch (roleName) {
        case 'SuperAdmin':
          return '#4285F4';
        case 'Gerente':
          return '#34A853';
        case 'Propietario':
          return '#FBBC05';
        default:
          return '#808080';
      }
    }

    ngOnInit(): void {
      this.loadUserStats();
      this.loadPlotStateStats();
    }
  
    loadUserStats() {
      this.getUsersByRole().subscribe({
        next: (data) => {
          this.roleChartData = [];
          const roleNames: string[] = [];

          data.forEach(stat => {
            const roleName = stat.roleName;
            const userCount = stat.userCount;
            this.roleChartData.push([roleName, userCount]);
            roleNames.push(roleName);
          });
          
          console.log('Datos de roles cargados:', data);
          this.calculateKPIs(data);
        },
        error: (error) => {
          console.error('Error al cargar estadísticas de roles:', error);
        }
      });
    }

    loadPlotStateStats() {
      this.getPlotByStateCount().subscribe({
        next: (data) => {
          this.plotStateChartData = [];
          
          data.forEach(stat => {
            this.plotStateChartData.push([stat.state, stat.count]);
          });
          
          console.log('Datos de estados de lotes cargados:', data);
          this.calculatePlotStateKPIs(data);
        },
        error: (error) => {
          console.error('Error al cargar estadísticas de estados de lotes:', error);
        }
      });
    }

    private calculateKPIs(data: UserRoleCount[]) {
      let total = 0;
      let maxCount = 0;
      let maxRole = '';
  
      data.forEach(stat => {
        total += stat.userCount;
        if (stat.userCount > maxCount) {
          maxCount = stat.userCount;
          maxRole = stat.roleName;
        }
      });
  
      this.roleKPIs = {
        mostCommonRole: maxRole,
        mostCommonRoleCount: maxCount,
        averageUsersPerRole: total / data.length
      };
  
      this.totalUsers = total;
    }

    private calculatePlotStateKPIs(data: PlotByStateCount[]) {
      let total = 0;
      let maxCount = 0;
      let maxState = '';

      data.forEach(stat => {
        total += stat.count;
        if (stat.count > maxCount) {
          maxCount = stat.count;
          maxState = stat.state;
        }
      });

      this.plotStateKPIs = {
        totalPlots: total,
        mostCommonState: maxState,
        mostCommonStateCount: maxCount
      };
    }
  
    aplyFilters() {
      console.log('Aplicando filtros...');
    }
}