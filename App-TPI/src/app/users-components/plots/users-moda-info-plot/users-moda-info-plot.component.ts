import { CommonModule, formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '../../../users-models/User';
import { ApiServiceService } from '../../../users-servicies/api-service.service';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GetPlotModel } from '../../../users-models/GetPlot';

@Component({
  selector: 'app-users-moda-info-plot',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users-moda-info-plot.component.html',
  styleUrl: './users-moda-info-plot.component.css'
})
export class UsersModaInfoPlotComponent implements OnInit {

  @Input() plotModel: GetPlotModel = new GetPlotModel();

  plotForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.plotForm = this.fb.group({
      plot: [''],
      block: [''],
      total_area: [''],
      built_area: [''],
      state: [''],
      type: ['']
    });
  }

  // Método para detectar cambios en el @Input
  ngOnInit() {        
      console.log("aaa");
      this.plotForm.patchValue({
        plot: this.plotModel.plot_number  ,
        block: this.plotModel.block_number,
        total_area: this.plotModel.total_area_in_m2,
        built_area: this.plotModel.built_area_in_m2,
        state: this.plotModel.plot_state,
        type: this.plotModel.plot_type
      });
      this.plotForm.disable();
  }

  closeModal(){
    this.activeModal.close();
  }

  
}
