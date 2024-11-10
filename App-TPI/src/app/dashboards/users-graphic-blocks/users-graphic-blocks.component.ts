import { Component, inject, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { DashboardService } from '../../users-servicies/dashboard.service';
import { BlockData } from '../../users-models/dashboard/BlockData';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-users-graphic-blocks',
  standalone: true,
  imports: [GoogleChartsModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users-graphic-blocks.component.html',
  styleUrl: './users-graphic-blocks.component.css'
})
export class UsersGraphicBlocksComponent implements OnInit {

  private readonly dashboardService = inject(DashboardService);
  
  //Controles para los filtros
  blockControl1 = new FormControl(0); 
  blockControl2 = new FormControl(0);

  blocksNumber: number[] = []; // números de las manzanas
  blocks: BlockData[] = [];
  private blocksSubject = new BehaviorSubject<BlockData[]>([]);

  //Datos para renderizar el gráfico
  chartType : ChartType = ChartType.ColumnChart;
  chartDataArea : any[] = [];
  chartDataPercent: any[] = [];
  width = 800;
  height = 400;

  chartOptionsArea = {
    title: 'Áreas por Nro. de Manzana',
    backgroundColor: 'transparent',
    chartArea: {
      width: '75%',
      height: '70%'
    },
    hAxis: {
      title: 'Manzana',
      titleTextStyle: {
        color: '#7f8c8d'
      }
    },
    vAxis: {
      title: 'Área (m²)',
      titleTextStyle: {
        color: '#7f8c8d'
      },
      gridlines: {
        color: '#f1f1f1'
      },
      minValue: 0
    },
    seriesType: 'bars',
    series: {
      0: {
        color: '#5dade2',
        label: 'Área Total'
      },
      1: {
        color: '#48c9b0',
        label: 'Área Construida'
      }
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
      duration: 1000,
      easing: 'out'
    }
  };
  
  chartOptionsPercent = {
    title: 'Porcentajes por Nro. de Manzana',
    backgroundColor: 'transparent',
    chartArea: {
      width: '75%',
      height: '70%'
    },
    hAxis: {
      title: 'Manzana',
      titleTextStyle: {
        color: '#7f8c8d'
      }
    },
    vAxis: {
      title: 'Porcentaje (%)',
      titleTextStyle: {
        color: '#7f8c8d'
      },
      gridlines: {
        color: '#f1f1f1'
      },
      minValue: 0,
      maxValue: 100,
      format: '#\'%\'' // Formato para el porcentaje
    },
    seriesType: 'bars',
    series: {
      0: {
        color: '#f39c12',
        label: 'Porcentaje Construido'
      },
      1: {
        color: '#e74c3c',
        label: 'Porcentaje No Construido'
      }
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
      duration: 1000,
      easing: 'out'
    }
  };
  
  

  chartOptions = {
    title: 'Comparativa de Áreas por Nro. de Manzana',
    backgroundColor: 'transparent',
    chartArea: {
      width: '75%',
      height: '70%'
    },
    hAxis: {
      title: 'Métricas',
      titleTextStyle: {
        color: '#7f8c8d'
      }
    },
    vAxes: {
      0: {
        title: 'Área (m²)',
        titleTextStyle: {
          color: '#7f8c8d'
        },
        gridlines: {
          color: '#f1f1f1'
        },
        minValue: 0
      },
      1: {
        title: 'Porcentaje (%)',
        titleTextStyle: {
          color: '#7f8c8d'
        },
        gridlines: {
          color: '#f1f1f1'
        },
        minValue: 0,
        maxValue: 100,
        format: '#\'%\'' // Formato para el porcentaje
      }
    },
    seriesType: 'bars',
    series: {
      0: { // Área Total - Eje izquierdo
        color: '#5dade2',
        targetAxisIndex: 0,
        label: 'Área Total'
      },
      1: { // Área Construida - Eje izquierdo
        color: '#48c9b0',
        targetAxisIndex: 0,
        label: 'Área Construida'
      },
      2: { // Porcentaje Construido - Eje derecho
        type: 'line',
        color: '#f39c12',
        targetAxisIndex: 1,
        lineWidth: 3,
        pointSize: 6
      },
      3: { // Porcentaje No Construido - Eje derecho
        type: 'line',
        color: '#e74c3c',
        targetAxisIndex: 1,
        lineWidth: 3,
        pointSize: 6
      }
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
      duration: 1000,
      easing: 'out'
    },
    tooltip: {
      isHtml: true,
      trigger: 'both',
      showColorCode: true
    }
  };
  
  ngOnInit(): void {
    this.loadData();
    this.setupSubscriptions();
  }

  private loadData(): void {
    this.dashboardService.getBlockStats().subscribe({
      next: (data) => {
        this.blocks = data;
        this.blocksNumber = data.map(block => block.blockNumber).sort((a, b) => a - b);
        this.blocksSubject.next(data);
        
        if (this.blocksNumber.length >= 2) {
          this.blockControl1.setValue(this.blocksNumber[0]);
          this.blockControl2.setValue(this.blocksNumber[1]);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
      }
    });
  }

  private setupSubscriptions(): void {
    combineLatest([
      this.blockControl1.valueChanges,
      this.blockControl2.valueChanges,
      this.blocksSubject
    ]).pipe(
      map(([block1, block2, blocks]) => {
        if (block1 && block2) {
          this.updateChartData(Number(block1), Number(block2), blocks);
          this.updateSelectedBlocksKPIs(Number(block1), Number(block2), blocks);
        }
      })
    ).subscribe();
  }

  private updateChartData(block1: number, block2: number, blocks: BlockData[]): void {
    const b1 = blocks.find(b => b.blockNumber === block1);
    const b2 = blocks.find(b => b.blockNumber === block2);

    if (!b1 || !b2) return;

    const b1PercentBuilt = Number(((b1.builtArea / b1.totalArea) * 100).toFixed(1));
    const b2PercentBuilt = Number(((b2.builtArea / b2.totalArea) * 100).toFixed(1));
    const b1PercentNotBuilt = Number((100 - b1PercentBuilt).toFixed(1));
    const b2PercentNotBuilt = Number((100 - b2PercentBuilt).toFixed(1));

    // Gráfico 1: Áreas (total y construida)
this.chartDataArea = [
  ['Mzna. 1', b1.totalArea, b1.builtArea],
  ['Mzna. 2', b2.totalArea, b2.builtArea]
];

// Gráfico 2: Porcentajes (construido y no construido)
this.chartDataPercent = [
  ['Mzna. 1', b1PercentBuilt, b1PercentNotBuilt],
  ['Mzna. 2', b2PercentBuilt, b2PercentNotBuilt]
];
    //this.chartData = [

      //['Mzna. 1', b1.totalArea, b1.builtArea, b1PercentBuilt, b1PercentNotBuilt],
      //['Mzna. 2', b2.totalArea, b2.builtArea, b2PercentBuilt, b2PercentNotBuilt]
      //['Bloque 1', b1.totalArea, b2.totalArea],
    //['Bloque 2', b1.builtArea, b2.builtArea],
    //['Bloque 1', b1PercentBuilt, b2PercentBuilt],
    //['Bloque 2', b1PercentNotBuilt, b2PercentNotBuilt]
    //];
  }

  selectedBlockskPIs = {
    totalArea: 0,
    totalBuiltArea: 0,
    utilizationPercentage: 0
  };

  private updateSelectedBlocksKPIs(block1: number, block2: number, blocks: BlockData[]): void {
    const b1 = blocks.find(b => b.blockNumber === block1);
    const b2 = blocks.find(b => b.blockNumber === block2);

    if (!b1 || !b2) return;

    this.selectedBlockskPIs = {
      totalArea: b1.totalArea + b2.totalArea,
      totalBuiltArea: b1.builtArea + b2.builtArea,
      utilizationPercentage: ((b1.builtArea + b2.builtArea) / (b1.totalArea + b2.totalArea)) * 100
    };
  }

 /* private calculateKPIs(): void {
    this.kPIs.totalArea = this.blocks.reduce((sum, block) => sum + block.totalArea, 0);
    this.kPIs.totalBuiltArea = this.blocks.reduce((sum, block) => sum + block.builtArea, 0);
    this.kPIs.utilizationPercentage = (this.kPIs.totalBuiltArea / this.kPIs.totalArea) * 100;
  }*/
}

/**
 * series: {
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
    }
 */