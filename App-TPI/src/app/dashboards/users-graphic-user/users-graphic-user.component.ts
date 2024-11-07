import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { UserRoleCount } from '../../users-models/users/UserRoleCount';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-users-graphic-user',
  standalone: true,
  imports: [GoogleChartsModule, CommonModule],
  templateUrl: './users-graphic-user.component.html',
  styleUrl: './users-graphic-user.component.css'
})
export class UsersGraphicUserComponent {

  /*columnChartType: ChartType = ChartType.ColumnChart;
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
  aplyFilters() {
    // Aquí puedes aplicar la lógica de filtro y actualizar los datos
    console.log('Filtros aplicados');
  }*/

    private readonly URL = 'http://localhost:9060/dashboard/users-by-role';
    private readonly http = inject(HttpClient);

    getUsersByRole(): Observable<UserRoleCount[]> {
      return this.http.get<UserRoleCount[]>(`${this.URL}`);
    }
  
    roleChartType :ChartType = ChartType.ColumnChart;
    roleChartData = [
      ['', 0]
    ];
    


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
  
    roleKPIs = {
      mostCommonRole: 'Propietario',
      mostCommonRoleCount: 0,
      averageUsersPerRole: 0
    };
  
    totalUsers = 0;
  
    constructor() { }
  
     roleColors(roleName: string) : string {

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
    };

    ngOnInit(): void {
      this.loadUserStats();
    }
  
    loadUserStats() {
      this.getUsersByRole().subscribe({
        next: (data) => {
          // Reiniciar los datos del gráfico manteniendo el encabezado
          this.roleChartData = [
           
          ];
  
          const roleNames: string[] = [];

          // Procesar los datos
          data.forEach(stat => {
            const roleName = stat.roleName;  // Nombre del rol
            const userCount = stat.userCount;  // Cantidad de usuarios
            //const color = this.roleColors(roleName); // Color por defecto si no está definido
            this.roleChartData.push([roleName, userCount]);
            roleNames.push(roleName);
          });

          //this.roleChartOptions.hAxis.ticks = roleNames.map((role, index) => index);
          
          console.log('Datos cargados:', data);
          console.log('Datos para el gráfico:', this.roleChartData);
  
          this.calculateKPIs(data);
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
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
  
    aplyFilters() {
      // Implementar la lógica de filtrado aquí
      console.log('Aplicando filtros...');
    }
}
