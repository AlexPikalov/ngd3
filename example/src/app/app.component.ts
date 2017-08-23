import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';

import { D3Callee } from 'ngd3';
import { DataService } from './shared/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  letterFeqs: Observable<any>;
  graphData: Observable<any>;

  constructor(private dataService: DataService) {
    this.letterFeqs = this.dataService.letterFrequencies();
    this.graphData = this.dataService.graphData().do(d => console.log(d));
  }
}
