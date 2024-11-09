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
  width = 900;
  height = 400;

  chartOptions = {
    title: 'Comparativa de Áreas por Nro. de Manzana',
    backgroundColor: 'transparent',
    chartArea: {
      width: '85%',   // Ancho relativo al contenedor
      height: '70%'   // Alto relativo al contenedor
  },
  
    hAxis: {
      title: 'Nro. de Manzana',
      titleTextStyle: {
        color: '#7f8c8d'
      }
    },
    vAxis: {
      title: 'Área (m²)',
      titleTextStyle: {
        color: '#7f8c8d'
      }
    },
    seriesType: 'area',
    series: {
      0: { 
        color: '#5dade2', 
        areaOpacity: 0.5, 
        labelInLegend: 'Área Total',
        label: 'Área Total',
        pointShape: 'diamond'
      }, // Área Total
      1: { 
        color: '#48c9b0', 
        areaOpacity: 0.4, 
        labelInLegend: 'Área Construida',
        label: 'Área Construida',
        pointShape: 'diamond'
      }  // Área Construida
    },
    legend: {
      position: 'top',
      alignment: 'center',
      textStyle: {
        color: '#7f8c8d',
        fontSize: 12
      }
    },
    animation: {
      startup: true,
      duration: 1000
    },
    tooltip: {
      isHtml: true,
      trigger: 'both',
      showColorCode: true,
      format: 'decimal',
      textStyle: {
        color: '#666',
        fontSize: 12
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
    totalArea: 0,
    totalBuiltArea: 0,
    utilizationPercentage: 0
  };

  private calculateKPIs(): void {
    this.kPIs.totalArea = this.blocks.reduce((sum, block) => sum + block.totalArea, 0);
    this.kPIs.totalBuiltArea = this.blocks.reduce((sum, block) => sum + block.builtArea, 0);
    this.kPIs.utilizationPercentage = (this.kPIs.totalBuiltArea / this.kPIs.totalArea) * 100;
  }

  private prepareChartData(): void {
    this.blocks.forEach(block => {
      this.chartData.push([`Mzna. ${block.blockNumber}`, block.totalArea, block.builtArea]);
    });
  }
}
