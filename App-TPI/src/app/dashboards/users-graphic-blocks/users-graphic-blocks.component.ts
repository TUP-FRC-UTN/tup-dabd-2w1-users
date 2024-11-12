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
  availableBlocksForSelect1: number[] = [];
  availableBlocksForSelect2: number[] = [];
  blocks: BlockData[] = [];
  private blocksSubject = new BehaviorSubject<BlockData[]>([]);

  //Datos para renderizar el gráfico
  chartType : ChartType = ChartType.ColumnChart;
  chartData: any[] = [];
  width = 600;
  height = 370;

  chartOptions = {
    title: 'Comparativa de Áreas y Porcentajes Entre Manzanas',
    backgroundColor: 'transparent',
    chartArea: { width: '75%', height: '70%' },
    hAxis: { title: 'Métricas', titleTextStyle: { color: '#7f8c8d' } },
    vAxes: {
      0: { // Eje izquierdo para áreas
        title: 'Área (m²)',
        titleTextStyle: { color: '#7f8c8d' },
        gridlines: { color: '#f1f1f1' },
        minValue: 0
      },
      1: { // Eje derecho para porcentajes
        title: 'Porcentaje (%)',
        titleTextStyle: { color: '#7f8c8d' },
        gridlines: { color: '#f1f1f1' },
        minValue: 0,
        maxValue: 100,
        format: '#\'%\''
      }
    },
    seriesType: 'bars',
    series: {
      0: { color: '#5dade2', targetAxisIndex: 0, label: 'Área Total', labelInLegend: 'Mzna 1' },       // Área Total - Eje izquierdo
      1: { color: '#48c9b0', targetAxisIndex: 0, label: 'Área Construida', labelInLegend: 'Mzna 2' },  // Área Construida - Eje izquierdo
      2: { color: '#4f46e5', targetAxisIndex: 1, label: 'Área Construida', labelInLegend: 'Mzna 1'},  // % Construido - Eje derecho
      3: { color: '#f97316', targetAxisIndex: 1, label: 'Área Construida', labelInLegend: 'Mzna 2' }   // % No Construido - Eje derecho
    },
    legend: {
      position: 'top',
      alignment: 'center',
      textStyle: { color: '#7f8c8d', fontSize: 12 }
    },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out'
    },
    tooltip: {
      trigger: 'both',
      showColorCode: true
    }
  };
  
  ngOnInit(): void {
    this.loadData();
    this.setupSubscriptions();
    this.setupSelectFilters();
  }

  private loadData(): void {
    this.dashboardService.getBlockStats().subscribe({
      next: (data) => {
        this.blocks = data;
        this.blocksNumber = data.map(block => block.blockNumber).sort((a, b) => a - b);
        this.blocksSubject.next(data);

        this.availableBlocksForSelect1 = [...this.blocksNumber];
        this.availableBlocksForSelect2 = [...this.blocksNumber];
        
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

  private setupSelectFilters(): void {
    // Suscripción para el primer select
    this.blockControl1.valueChanges.subscribe(value => {
      if (value) {
        // Actualizar las opciones disponibles para el select 2
        this.availableBlocksForSelect2 = this.blocksNumber.filter(block => block !== Number(value));
      } else {
        this.availableBlocksForSelect2 = [...this.blocksNumber];
      }
    });

    // Suscripción para el segundo select
    this.blockControl2.valueChanges.subscribe(value => {
      if (value) {
        // Actualizar las opciones disponibles para el select 1
        this.availableBlocksForSelect1 = this.blocksNumber.filter(block => block !== Number(value));
      } else {
        this.availableBlocksForSelect1 = [...this.blocksNumber];
      }
    });
  }

  private updateChartData(block1: number, block2: number, blocks: BlockData[]): void {
    const b1 = blocks.find(b => b.blockNumber === block1);
    const b2 = blocks.find(b => b.blockNumber === block2);

    this.chartOptions.series[0].labelInLegend = `Mzna ${block1}`;
    this.chartOptions.series[1].labelInLegend = `Mzna ${block2}`;
    this.chartOptions.series[2].labelInLegend = `Mzna ${block1}`;
    this.chartOptions.series[3].labelInLegend = `Mzna ${block2}`;

    if (!b1 || !b2) return;

    const b1PercentBuilt = Number(((b1.builtArea / b1.totalArea) * 100).toFixed(1));
    const b2PercentBuilt = Number(((b2.builtArea / b2.totalArea) * 100).toFixed(1));
    const b1PercentNotBuilt = Number((100 - b1PercentBuilt).toFixed(1));
    const b2PercentNotBuilt = Number((100 - b2PercentBuilt).toFixed(1));

    this.chartData = [
      ['Área Total', 
       {
         v: b1.totalArea,
         f: `Manzana ${block1}: ${b1.totalArea.toLocaleString()} m²`
       },
       {
         v: b2.totalArea,
         f: `Manzana ${block2}: ${b2.totalArea.toLocaleString()} m²`
       }, 
       null, 
       null
      ],
      ['Área Construida',
       {
         v: b1.builtArea,
         f: `Manzana ${block1}: ${b1.builtArea.toLocaleString()} m²`
       },
       {
         v: b2.builtArea,
         f: `Manzana ${block2}: ${b2.builtArea.toLocaleString()} m²`
       },
       null,
       null
      ],
      ['Porcentaje Construido',
       null,
       null,
       {
         v: b1PercentBuilt,
         f: `Manzana ${block1}: ${b1PercentBuilt}%`
       },
       {
         v: b2PercentBuilt,
         f: `Manzana ${block2}: ${b2PercentBuilt}%`
       }
      ],
      ['Porcentaje No Construido',
       null,
       null,
       {
         v: b1PercentNotBuilt,
         f: `Manzana ${block1}: ${b1PercentNotBuilt}%`
       },
       {
         v: b2PercentNotBuilt,
         f: `Manzana ${block2}: ${b2PercentNotBuilt}%`
       }
      ]
    ];
  }

  selectedBlockskPIs = {
    totalArea: 0,
    totalBuiltArea: 0,
    utilizationPercentage: 0,
    notUtilizationPercentage: 0
  };

  private updateSelectedBlocksKPIs(block1: number, block2: number, blocks: BlockData[]): void {
    const b1 = blocks.find(b => b.blockNumber === block1);
    const b2 = blocks.find(b => b.blockNumber === block2);

    if (!b1 || !b2) return;

    this.selectedBlockskPIs = {
      totalArea: b1.totalArea + b2.totalArea,
      totalBuiltArea: b1.builtArea + b2.builtArea,
      utilizationPercentage: ((b1.builtArea + b2.builtArea) / (b1.totalArea + b2.totalArea)) * 100,
      notUtilizationPercentage: 100 - (((b1.builtArea + b2.builtArea) / (b1.totalArea + b2.totalArea)) * 100)
    };
  }


  clearFilters() {
    this.blockControl1.setValue(0);
    this.blockControl2.setValue(0);
  
    this.availableBlocksForSelect1 = [...this.blocksNumber];
    this.availableBlocksForSelect2 = [...this.blocksNumber];
  
    this.updateChartData(this.blocksNumber[0], this.blocksNumber[1], this.blocks);
    this.updateSelectedBlocksKPIs(this.blocksNumber[0], this.blocksNumber[1], this.blocks);
  }
}