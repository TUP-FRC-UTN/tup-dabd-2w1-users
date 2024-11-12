import { Component, inject, OnInit} from '@angular/core';
import { DashboardService } from '../../users-servicies/dashboard.service';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { OwnersPlotsDistribution, PlotsByBlock, PlotsStats } from '../../users-models/dashboard/plots-stats';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-graphic-plots-stats',
  standalone: true,
  imports: [GoogleChartsModule, ReactiveFormsModule, FormsModule, CommonModule],
templateUrl: './users-graphic-plots-stats.component.html',
  styleUrls: ['./users-graphic-plots-stats.component.css']
})
export class UsersGraphicPlotsStatsComponent implements OnInit{

  private readonly apiService = inject(DashboardService);

  plotsByBlock: PlotsByBlock[] = [];
  ownerDistribution: OwnersPlotsDistribution[] = [];
  plotsStats: PlotsStats = new PlotsStats();
  
 
  filterForm: FormGroup = new FormGroup({
    block: new FormControl([]),
    type: new FormControl(''),
    status: new FormControl('')
  });

  filteredPlotsStats: PlotsStats | null = null;
  filteredPlotsByBlock: PlotsByBlock[] = [];
  filteredOwnerDistribution: OwnersPlotsDistribution[] = [];

  blocksNumber: number[] = [];
  plotsTypes: string[] = [];
  plotsStatus: string[] = [];

  loading = true;
  error: string | null = null;
    
  columnChart = ChartType.ColumnChart; 
  barChartData: any[] = [];

    barChartOptions = {
        title: 'Distribución de Lotes por Manzanas',
        titleTextStyle: {
            color: '#495057',
            fontSize: 16,
        },
        isStacked: true,
        legend: { position: 'top', alignment: 'center' },
        series: {
          0: { labelInLegend: 'Disponibles', color: '#4285F4' },
          1: { labelInLegend: 'Ocupados', color: '#F4B400' },
          2: { labelInLegend: 'En Construcción', color: '#DB4437' }
        },
        backgroundColor: 'trasparent',
        colors: ['#F4B400', '#DB4437', '#4285F4'],
        animation: {
            startup: true,
            duration: 1000,
            easing: 'out'
        },
        hAxis: {
            title: 'Manzanas',
            titleTextStyle: { color: '#6c757d', fontSize: 14, bold: true },
            textStyle: { color: '#495057', fontSize: 12 }
        },
        vAxis: {
            title: 'Cantidad de Lotes',
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
      title: 'Distribución por Propietarios',
      titleTextStyle: {
        color: '#495057',
        fontSize: 16,
        bold: true
      },
      series: { 
        0: { color: '#FF9900' }, 
        1: { color: '#4285F4' },
    },
      colors: ['#FF9900', '#4285F4', '#34A853', '#EA4335', '#9334E6', '#FBBC05'],
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
        this.setFilterListeners();
    }

    private setFilterListeners() {
      this.filterForm.valueChanges.subscribe(() => {
        this.applyFilters();
      });
    }

    private applyFilters() {
      this.filteredPlotsStats = { ...this.plotsStats };
      this.filteredPlotsByBlock = [...this.plotsByBlock];
      this.filteredOwnerDistribution = [...this.ownerDistribution];
    
      const { block, type, status } = this.filterForm.value;

  
    
      // Esto es para filtrar las manzanas que se muestran
      if (block && block.length > 0) {
        this.filteredPlotsByBlock = this.plotsByBlock.filter(item => 
          block.includes(item.blockNumber)
        );
      }
    
      if(type || status){
        this.apiService.getOwnersPlotsDistribution('', '', type, status).subscribe({
          next: (data: OwnersPlotsDistribution[]) => {
            this.filteredOwnerDistribution = data;
            
            this.processPieChartData();
            this.loading = false;
          },
          error: () => {
            this.error = 'Error al cargar las estadísticas de lotes';
          }
          
        });
      }
    
      this.processData();
    }

    private processFilterOptions() {
      this.blocksNumber = [...new Set(this.filteredPlotsByBlock.map(item => item.blockNumber))];
      this.plotsTypes = ['Comercial', 'Residencial']; //Esto lo tuengo que rellenar con la api
      this.plotsStatus = ['Disponible', 'Ocupado', 'En Construcción']; //esto lo tengo que rellenar con la api
    }

    private loadData() {
        this.loading = true;
        this.error = null;

        this.apiService.getPlotsStats().subscribe({
          next: (data: PlotsStats) => {
            this.plotsStats = data;
            this.filteredPlotsStats = { ...this.plotsStats };
            this.loading = false;
          },
          error: () => {
            this.error = 'Error al cargar las estadísticas de lotes';
          }
        });

        this.apiService.getPlotsByBlock().subscribe({
            next: (data: PlotsByBlock[]) => {
              this.plotsByBlock = data;
              this.filteredPlotsByBlock = [...this.plotsByBlock];
              this.loading = false;
              this.processData();
              this.processFilterOptions();
            },
            error: () => {
                this.error = 'Error al cargar las estadísticas';
            }
          });

          this.apiService.getOwnersPlotsDistribution().subscribe({
            next: (data: OwnersPlotsDistribution[]) => {
              this.ownerDistribution = data;
              this.filteredOwnerDistribution = [...this.ownerDistribution];
              this.processPieChartData();
            },
            error: () => {
              this.error = 'Error al cargar la distribución de propietarios';
            }
          }); 

          this.processFilterOptions();
    }  

    private processData() {
        this.barChartData = [
            ...this.filteredPlotsByBlock.map((item: PlotsByBlock) => [
              {
                v: item.blockNumber,
                f: `Nro. Manzana: ${item.blockNumber}`
              },
              {
                v: item.available,
                f: `Lotes disponibles: ${item.available}`
              },
              {
                v: item.occupied,
                f: `Lotes ocupados: ${item.occupied}`
              },
              {
                v: item.inConstruction,
                f: `Lotes en construcción: ${item.inConstruction}`
              },
            ])
          ];
    }

    private processPieChartData() {
      this.pieChartData = [
        ...this.filteredOwnerDistribution.map(owner => [
          owner.ownerName,
          owner.plotCount
        ])
      ];
    }

    clearFilters() {
      this.filterForm.reset();
      this.filteredPlotsByBlock = [...this.plotsByBlock];
      this.filteredOwnerDistribution = [...this.ownerDistribution];
      this.filteredPlotsStats = { ...this.plotsStats };
      this.processData();
      this.processPieChartData();
    }
}
