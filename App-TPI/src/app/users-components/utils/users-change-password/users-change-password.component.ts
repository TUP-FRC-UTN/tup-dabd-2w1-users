import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangePasswordService } from '../../../users-servicies/change-password.service';

@Component({
  selector: 'app-users-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-change-password.component.html',
  styleUrl: './users-change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  
  @Input() email: string = "";
  private readonly changePasswordService = inject(ChangePasswordService);

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  form = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]),
    confirmNewPassword: new FormControl('', [Validators.required, this.passwordValidator()])
  });

  ngOnInit(): void {
    console.log(this.email);
  }

  passwordValidator() : ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const form = control.parent;
      if(!form){
        return null;
      }
      
      return form.get('newPassword')?.value === form.get('confirmNewPassword')?.value
      ? null : { passwordsDifferent: true };
    }
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.form.valid) {

      const changePasswordDto = {
        email: this.email,
        currentPassword: this.form.controls['currentPassword'].value!,
        newPassword: this.form.controls['newPassword'].value!
      };

      this.changePasswordService.changePassword(changePasswordDto).subscribe({
        next: (response) => {
          alert('Contraseña cambiada con éxito');
          this.form.reset();
        },
        error: (error) => {
          alert('Error al cambiar la contraseña');
        }
      });
    }
  }

  onValidate(controlName: string) {
    const control = this.form.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.dirty || control?.touched),
      'is-valid': control?.valid
    }
  }

  showError(controlName: string): string {
    const control = this.form.get(controlName);
  
    if (control && control.errors) {
      const [errorKey] = Object.keys(control.errors);
  
      switch (errorKey) {
        case 'required':
          return 'Este campo no puede estar vacío.';
        case 'minlength':
          return `El valor ingresado es demasiado corto. Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `El valor ingresado es demasiado largo. Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
        case 'passwordsDifferent':
          return 'Las contraseñas no coinciden.';
        default:
          return 'Error no identificado en el campo.';
      }
    }
    return '';
  }
}

