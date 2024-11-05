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
  intervaloId: any;
  monthlyData: {[key: string]: {active: number, inactive: number}} = {};

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {
    this.loadGoogleCharts(); 
     
  }

  loadOwners(): void {
    this.ownerService.getAll().subscribe((owners: Owner[]) => {
      this.activeCount = owners.filter(owner => owner.active).length;
      this.inactiveCount = owners.length - this.activeCount;
      this.drawChart(); 
    });
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


  loadGoogleCharts(): void {
    google.charts.load('current', { packages: ['corechart'] }); 
    google.charts.setOnLoadCallback(() => this.loadOwners()); 
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
}


