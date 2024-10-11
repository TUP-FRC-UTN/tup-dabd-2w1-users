import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users-new-plot',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users-new-plot.component.html',
  styleUrl: './users-new-plot.component.css'
})
export class UsersNewPlotComponent {

  showOwners : boolean = false;

  toggleShowOwners(event: any): void {
    this.showOwners = event.target.checked;
  }
  
  newPlot = new FormGroup({
    number: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]), //valida que ingresen numeros enteros
    blockNumber: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    totalArea: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]), //valida numeros decimales con hasta 2 decimales
    totalAreaBuild: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+(\.[0-9]{1,2})?$")]),
    owner: new FormControl("", []),
    type: new FormControl("", [Validators.required])
  })

  createPlot(form : any){

  }
}
