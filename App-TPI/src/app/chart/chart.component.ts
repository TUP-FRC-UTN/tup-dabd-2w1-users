import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { OwnerService } from '../users-servicies/owner.service';
import { Owner } from '../users-models/owner/Owner';

declare var google: any;

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'] 
})
export class ChartComponent implements OnInit {
  activeCount = 0;
  inactiveCount = 0;
  monthlyData: { [key: string]: { active: number, inactive: number } } = {};

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.loadOwners());
  }

  loadOwners(): void {
    this.ownerService.getAll().subscribe(
      (owners: Owner[]) => {
        this.processOwnerData(owners);
        this.processMonthlyData(owners);
        this.drawChart();
        this.drawMonthlyChart(); // Llama a esta función para dibujar el gráfico mensual
      },
      (error) => {
        console.error('Error al cargar los propietarios:', error);
      }
    );
  }

  processOwnerData(owners: Owner[]): void {
    this.activeCount = owners.filter(owner => owner.active).length;
    this.inactiveCount = owners.length - this.activeCount;
  }

  processMonthlyData(owners: Owner[]): void {
    this.monthlyData = {};

    owners.forEach(owner => {
      const month = new Date(owner.dateBirth).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!this.monthlyData[month]) {
        this.monthlyData[month] = { active: 0, inactive: 0 };
      }
      if (owner.active) {
        this.monthlyData[month].active++;
      } else {
        this.monthlyData[month].inactive++;
      }
    });
  }

  drawChart(): void {
    const data = google.visualization.arrayToDataTable([
      ['Estado', 'Cantidad'],
      ['Activo', this.activeCount], 
      ['Inactivo', this.inactiveCount]
    ]);

    const options = {
      title: 'Propietarios activos e inactivos',
      width: 600,
      height: 400,
      is3D: true,
    };

    const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  drawMonthlyChart(): void {
    // Declaramos el tipo de `dataArray` para aceptar una mezcla de strings y números
    const dataArray: (string | number)[][] = [['Mes', 'Activos', 'Inactivos']];
    
    for (const [month, counts] of Object.entries(this.monthlyData)) {
      // Verificamos que counts tiene las propiedades 'active' e 'inactive'
      if (typeof counts === 'object' && 'active' in counts && 'inactive' in counts) {
        dataArray.push([month, counts.active, counts.inactive]);
      } else {
        console.warn(`Datos inválidos para el mes: ${month}`, counts);
      }
    }
    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
      title: 'Propietarios activos e inactivos por mes',
      width: 600,
      height: 400,
      isStacked: true,
      legend: { position: 'top', maxLines: 3 },
      bar: { groupWidth: '75%' }
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('monthly_chart_div'));
    chart.draw(data, options);
  }
}
