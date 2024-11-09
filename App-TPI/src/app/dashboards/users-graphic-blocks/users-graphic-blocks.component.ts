import { Component, inject, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { DashboardService } from '../../users-servicies/dashboard.service';
import { BlockData } from '../../users-models/dashboard/BlockData';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-graphic-blocks',
  standalone: true,
  imports: [GoogleChartsModule, CommonModule],
  templateUrl: './users-graphic-blocks.component.html',
  styleUrl: './users-graphic-blocks.component.css'
})
export class UsersGraphicBlocksComponent implements OnInit {

  private readonly dashboardService = inject(DashboardService);
  blocks: BlockData[] = [];

  //Datos para renderizar el gráfico
  chartType : ChartType = ChartType.AreaChart;
  
  chartData : any[] = [];
  width = 600;
  height = 400;

  chartOptions = {
    title: 'Comparativa de Áreas por Bloque',
    backgroundColor: 'transparent',
    chartArea: {
      width: '80%',
      height: '70%'
    },
    hAxis: {
      title: 'Número de Manzana',
      titleTextStyle: {
        color: '#666'
      }
    },
    vAxis: {
      title: 'Área (m²)',
      titleTextStyle: {
        color: '#666'
      }
    },
    seriesType: 'area',
    series: {
      0: { 
        color: '#4e73df', 
        areaOpacity: 0.3, 
        labelInLegend: 'Área Total',
        label: 'Área Total'
      }, // Área Total
      1: { 
        color: '#1cc88a', 
        areaOpacity: 0.3, 
        labelInLegend: 'Área Construida',
        label: 'Área Construida'
      }  // Área Construida
    },
    legend: {
      position: 'top',
      alignment: 'center',
      textStyle: {
        color: '#666',
        fontSize: 12
      }
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    },
    tooltip: {
      isHtml: true,
      trigger: 'both',
      showColorCode: true,
      format: 'decimal',
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      formatter: (value: any, row: number, column: number) => {
        if (column === 0) return `Bloque ${value}`;
        return `${value} m²`;
      }
    },
    pointSize: 5
  };

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dashboardService.getBlockStats().subscribe({
      next: (data) => {
        this.blocks = data;
        this.calculateKPIs();
        this.prepareChartData();
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
      }
    });
  }

  kPIs = {
     // KPIs
    totalArea: 0,
    totalBuiltArea: 0,
    utilizationPercentage: 0
  };

  totalUsers = 0;


  loadUserStats() {
    this.dashboardService.getBlockStats().subscribe({
      next: (data) => {
        this.blocks = data;

        console.log('Datos cargados:', data);
        //console.log('Datos para el gráfico:', this.roleChartData);

        this.calculateKPIs();
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  private calculateKPIs(): void {
    this.kPIs.totalArea = this.blocks.reduce((sum, block) => sum + block.totalArea, 0);
    this.kPIs.totalBuiltArea = this.blocks.reduce((sum, block) => sum + block.builtArea, 0);
    this.kPIs.utilizationPercentage = (this.kPIs.totalBuiltArea / this.kPIs.totalArea) * 100;
  }

  private prepareChartData(): void {
    // Inicializa `chartData` con los encabezados, usando `number` para el primer valor
    //this.chartData = [['Número de Bloque', 'Área Total', 'Área Construida']];
    this.chartData = [];
    // Agrega cada bloque como una fila en `chartData`, usando `block.blockNumber` como `number`
    this.blocks.forEach(block => {
      this.chartData.push([`Manzana ${block.blockNumber}`, block.totalArea, block.builtArea]);
    });

  }

}