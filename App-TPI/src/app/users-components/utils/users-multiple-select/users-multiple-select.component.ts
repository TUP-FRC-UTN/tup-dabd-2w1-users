import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-users-multiple-select',
  standalone: true,
  imports: [NgSelectModule, FormsModule, JsonPipe, NgLabelTemplateDirective],
  templateUrl: './users-multiple-select.component.html',
  styleUrl: './users-multiple-select.component.css'
})
export class UsersMultipleSelectComponent implements OnChanges {
   //Lista de opciones (Requiere un objeto {value: , name: })
   @Input() options: { value: number, name: string }[] = [];

   //Lista con los VALUES de los objetos que ya tienen que venir seleccionados (Ej: [1, 2] o ["Persona Física"])
   @Input() optionsChecked : any[] = []
 
   //Permite seleccionar varios objetos
   @Input() multiple : boolean = true;
 
   //Listado de ids de los objetos seleccionados (el value del select)
   @Output() sendList = new EventEmitter<any[]>();
 
   //Opciones seleccionadas
   selectedOptions : any[] = [];
 
   ngOnInit(): void {
    console.log("options", this.options);
    
    this.selectedOptions = [...this.optionsChecked];
   }

   ngOnChanges(changes: SimpleChanges): void {
  if (changes['options'] && changes['options'].currentValue && changes['options'].currentValue.length > 0) {
    this.selectedOptions = [...this.optionsChecked];
  }
}
 
   send(){
     this.sendList.emit(this.selectedOptions);
   }

     // Función para comparar valores
     compareWithFn = (o1: any, o2: any): boolean => {
      return o1.value === o2;
    };
  }