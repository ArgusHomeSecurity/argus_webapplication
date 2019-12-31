
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { Alert, String2AlertType } from '../models';
import { AuthenticationService } from '../services/authentication.service';


@Injectable()
export class AlertService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  getAlerts(): Observable<Alert[]> {
    // add authorization header with jwt token
    const headers = new HttpHeaders( { 'Authorization': 'Bearer ' + this.authService.getToken() } );

    // get sensors from api
    // hack: converting arm_type field from string to ArmType
    return this.http.get<Alert[]>( '/api/alerts', { headers } ).pipe(
      map(( rawAlerts: Object[] ) => {
        for ( const rawAlert of rawAlerts ) {
          rawAlert['alert_type'] = String2AlertType( rawAlert['alert_type'] );
        }
        return rawAlerts as Alert[];
      } ));
  }


  getAlert(): Observable<Alert> {
    // add authorization header with jwt token
    const headers = new HttpHeaders( { 'Authorization': 'Bearer ' + this.authService.getToken() } );

    // get sensors from api
    return this.http.get<Alert>( '/api/alert', { headers } );
  }
}
