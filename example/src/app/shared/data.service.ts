import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { graphData } from './graph.data';

@Injectable()
export class DataService {
  private letters = 'ABCDEFGHIJKLMNOPQRTSUVWXYZ'.split('');

  private maxFreq = 0.15;

  private intervalMs = 5 * 1000;

  letterFrequencies(): Observable<any[]> {
    return Observable
      .interval(this.intervalMs)
      .map(() => this.generateLetterFreqs())
      .startWith(this.generateLetterFreqs());
  }

  graphData(): Observable<any> {
    return Observable.of(graphData);
  }

  private generateLetterFreqs(): any[] {
    return this.letters
      .map(letter => ({ letter, freq: this.maxFreq * Math.random() }));
  } 
}
