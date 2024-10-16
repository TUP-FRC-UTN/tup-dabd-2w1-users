import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OwnerTypeModel } from '../users-models/OwnerType';
import { Observable } from 'rxjs';
import { OwnerStateModel } from '../users-models/OwnerState';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly urlOwnerTypes = 'http://localhost:8081/owners/ownertypes';
  private readonly urlOwnerStates = 'http://localhost:8081/owners/taxstatus';

  constructor() { }

  getAllTypes(): Observable<OwnerTypeModel[]>{
    return this.http.get<OwnerTypeModel[]>(this.urlOwnerTypes);
  }
  
  getAllStates(): Observable<OwnerStateModel[]>{
    return this.http.get<OwnerStateModel[]>(this.urlOwnerStates);
  }

}
