import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FileComponent } from '../file/file.component';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FileComponent,CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  files: File[] = [];
  @Output() filesChange = new EventEmitter<File[]>();
  @ViewChild('fileUpload') fileInput!: ElementRef;

  emitFiles() {
    this.filesChange.emit(this.files);
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const selectedFiles = Array.from(input.files);
      this.files.push(...selectedFiles);
      this.emitFiles();
     
      // Se restablece el valor del componente del input para poder agregar archivos que se eliminaron de la lista
      this.fileInput.nativeElement.value = '';
    }
  }

  eliminateImg(index: number) {
    this.files.splice(index, 1);
  }
}