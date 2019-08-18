import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}