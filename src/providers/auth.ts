import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {
  token: String;
  headers: HttpHeaders = new HttpHeaders();
  
  constructor(
    public http: HttpClient,
    public storage: Storage
  ) { }

  checkToken(): Promise<string> {
    return this.storage.get('psy_token');
  }

  saveToken(token): Promise<any> {
    return this.storage.set('psy_token', token);
  }

  getAuth(): Observable<any> {
    return this.http.get('/auth');
  }

  checkAuth(jwt): Observable<any> {
    return this.http.get('/check-auth', { headers: {'Authorization': 'Bearer ' + jwt }});
  }
}