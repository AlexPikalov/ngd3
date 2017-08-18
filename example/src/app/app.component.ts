import { Component } from '@angular/core';
import * as d3 from 'd3';

import { D3Callee } from 'ngd3';

const MAX_FREQ: number = 0.15;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  width = 480;
  height = 250;
  margin: {top?: number, right?: number, bottom?: number, left?: number} = {
    top: 20, right: 20, bottom: 30, left: 40
  };
  private rawData = `A	.08167
B	.01492
C	.02782
D	.04253
E	.12702
F	.02288
G	.02015
H	.06094
I	.06966
J	.00153
K	.00772
L	.04025
M	.02406
N	.06749
O	.07507
P	.01929
Q	.00095
R	.05987
S	.06327
T	.09056
U	.02758
V	.00978
W	.02360
X	.00150
Y	.01974
Z	.00074`;

  data: { letter: string, freq: number }[] = [];

  transition = t => t.duration(300);

  get x() {
    const x = d3.scaleBand().rangeRound([0, this.effectiveWidth]).padding(0.1);

    x.domain(this.data.map(d => d.letter));

    return x;
  }

  get y() {
    const y = d3.scaleLinear().rangeRound([this.effectiveHeight, 0]);

    y.domain([0, 0.15]);

    return y;
  }

  get effectiveHeight(): number {
    return this.height - this.margin.top - this.margin.bottom;
  }

  get effectiveWidth(): number {
    return this.width - this.margin.left - this.margin.right;
  }

  get xAxe(): D3Callee {
    return d3.axisBottom(this.x);
  }

  get yAxe(): D3Callee {
    return d3.axisLeft(this.y).ticks(10, '%');
  }

  constructor() {
    this.data = this.rawData
        .split('\n')
        .map(row => {
          const [letter, freq] = row.trim().split(/\t/);
          return { letter, freq: 0 };
        });
    setInterval(() => {
      this.data = this.rawData
        .split('\n')
        .map(row => {
          const [letter, freq] = row.trim().split(/\t/);
          return { letter, freq: this.generateFreq() };
        });
    }, 10000);
  }

  dataComparator(i: number, item: any) {
    return item.letter;
  }

  translateTo({left, top}: {left: number, top: number}): string {
    return `translate(${left},${top})`;
  }

  private generateFreq(): number {
    return MAX_FREQ * Math.random();
  }
}

// TODO: create helper directive translate, translateX, translateY. Low priority.
