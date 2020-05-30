import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { DEVICES } from './mock-devices';

@Injectable()
export class RequestsProvider {
  constructor(public http: HttpClient) { }

  postSan(data, jwt): Observable<any> {
    return this.http.post('/san', { sanData: data }, { headers: {'Authorization': 'Bearer ' + jwt }});
  }

  postLusher(data, jwt): Observable<any> {
    return this.http.post('/lusher', { data: data }, { headers: {'Authorization': 'Bearer ' + jwt }});
  }

  postVariability(data, jwt): Observable<any> {
    return this.http.post('/variability', { payload: data }, { headers: {'Authorization': 'Bearer ' + jwt }});
  }

  postMeta(data, jwt): Observable<any> {
    return this.http.post('/meta', { meta: data }, { headers: {'Authorization': 'Bearer ' + jwt }});
  }

  postObjectMeta(data, jwt): Observable<any> {
    return this.http.post('/meta/' + data.type, { meta: data.meta, id: data.id}, { headers: {'Authorization': 'Bearer ' + jwt }});
  };

  getDevices(jwt): Observable<any> {
    return this.http.get('/devices', { headers:  {'Authorization': 'Bearer ' + jwt }});
  };

  getDevicesMock(jwt): Observable<any> {
    return of(DEVICES);
  };

  putSessionUserSync(jwt, sessionId): Observable<any> {
    return this.http.put('/api/v1/session/' + sessionId + '/sync', {}, { headers:  {'Authorization': 'Bearer ' + jwt }});
  }
}