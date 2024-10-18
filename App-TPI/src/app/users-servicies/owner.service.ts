import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OwnerTypeModel } from '../users-models/OwnerType';
import { Observable } from 'rxjs';
import { OwnerStateModel } from '../users-models/OwnerState';
import { OwnerModel } from '../users-models/owner/PostOwnerDto';
import { Owner } from '../users-models/owner/Owner';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8081/';

  constructor() { }

  getAll(): Observable<Owner[]>{
    return this.http.get<Owner[]>(this.url + 'owners');
  }

  getById(id : number): Observable<Owner>{
    return this.http.get<Owner>(this.url + 'owners/' + id);
  }

  getAllTypes(): Observable<OwnerTypeModel[]>{
    return this.http.get<OwnerTypeModel[]>(this.url + 'owners/ownertypes');
  }
  
  getAllStates(): Observable<OwnerStateModel[]>{
    return this.http.get<OwnerStateModel[]>(this.url + 'owners/taxstatus');
  }

  postOwner(owner: OwnerModel): Observable<OwnerModel>{
    return this.http.post<OwnerModel>(this.url + 'owners', owner);
  }
  
  putOwner(owner: OwnerModel, id : number): Observable<OwnerModel>{
    return this.http.put<OwnerModel>(this.url + 'owners/' + id, owner)
  }
}
