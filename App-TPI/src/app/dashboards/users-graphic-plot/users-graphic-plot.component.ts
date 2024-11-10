import { Component, OnInit } from '@angular/core';
import { PlotStateCount } from '../../users-models/dashboard/PlotStateCount';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users-graphic-plot',
  standalone: true,
  imports: [],
  templateUrl: './users-graphic-plot.component.html',
  styleUrl: './users-graphic-plot.component.css'
})
export class UsersGraphicPlotComponent implements OnInit {
  size = 400;
  radius = 160;
  innerRadius = 80;
  slices: any[] = [];
  
  colors = ['#2196F3', '#4CAF50', '#F44336'];
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.http.get<PlotStateCount[]>('http://localhost:9062/dashboard/Plot-By-State-Count')
      .subscribe(data => {
        this.updateChart(data);
      });
  }
  
  private updateChart(data: PlotStateCount[]) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let startAngle = 0;
    
    this.slices = data.map((item, index) => {
      const percentage = item.count / total;
      const angle = percentage * 2 * Math.PI;
      
      const slice = {
        index,
        value: item.count,
        label: item.state,
        color: this.colors[index],
        path: this.describeArc(startAngle, startAngle + angle)
      };
      
      startAngle += angle;
      return slice;
    });
  }
  
  private describeArc(startAngle: number, endAngle: number): string {
    const start = this.polarToCartesian(startAngle);
    const end = this.polarToCartesian(endAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    
    const outerArc = [
      'M', start.outerX, start.outerY,
      'A', this.radius, this.radius, 0, largeArcFlag, 1, end.outerX, end.outerY,
      'L', end.innerX, end.innerY,
      'A', this.innerRadius, this.innerRadius, 0, largeArcFlag, 0, start.innerX, start.innerY,
      'Z'
    ].join(' ');
    
    return outerArc;
  }
  
  private polarToCartesian(angle: number) {
    return {
      outerX: Math.cos(angle - Math.PI/2) * this.radius,
      outerY: Math.sin(angle - Math.PI/2) * this.radius,
      innerX: Math.cos(angle - Math.PI/2) * this.innerRadius,
      innerY: Math.sin(angle - Math.PI/2) * this.innerRadius
    };
  }
}
