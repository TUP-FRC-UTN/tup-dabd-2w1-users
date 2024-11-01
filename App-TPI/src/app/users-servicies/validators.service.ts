import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly urlUser = 'http://localhost:9060/verification';

  constructor() { }

  validarUsernameUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http.get<{ isUnique: boolean }>(`${this.urlUser}/username?username=${control.value}`).pipe(
        map(response => (response.isUnique ? null : { usernameTaken: true })),
        catchError(() => {
          return of({ serverError: true });
        })
      );
    };
  }

  validarEmailUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http.get<{ isUnique: boolean }>(`${this.urlUser}/email?email=${control.value}`).pipe(
        map(response => (response.isUnique ? null : { emailTaken: true })),
        catchError(() => {
          return of({ serverError: true });
        })
      );
    };
  }
 
  validarDniUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http.get<{ isUnique: boolean }>(`${this.urlUser}/dni?dni=${control.value}`).pipe(
        map(response => (response.isUnique ?  null : { dniTaken: true })),
        catchError(() => {
          return of({ serverError: true });
        })
      );
    };
  }
}
