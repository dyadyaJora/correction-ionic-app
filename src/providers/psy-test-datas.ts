import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { of as Of } from 'rxjs/observable/of';

import { PsyTest } from './psy-test';
import { TESTS } from './mock-data';

@Injectable()
export class PsyTestDataProvider {
  constructor() {
    console.log('Hello PsyTestDataProvider Provider');
  }
  getData(): Observable<PsyTest[]> {
    return Of(TESTS);
  }
}