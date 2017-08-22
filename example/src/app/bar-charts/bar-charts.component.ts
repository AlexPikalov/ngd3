import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

import { D3Callee } from 'ngd3';

const MAX_FREQ: number = 0.15;

@Component({
  selector: 'app-bar-charts',
  templateUrl: './bar-charts.component.html',
  styleUrls: ['./bar-charts.component.css']
})
export class BarChartsComponent implements OnChanges {
  @Input() data: { letter: string, freq: number }[] = [];

  /**
   * SVG element width
   */
  width = 480;

  /**
   * SVG element height
   */
  height = 250;

  /**
   * Chart margins. The same as SVG element paddings
   */
  margin: {top: number, right: number, bottom: number, left: number} = {
    top: 20, right: 20, bottom: 30, left: 40
  };

  /**
   * Transition decoration. During the invokation it takes a basic transition,
   * then it is possible to change it's duration, delay etc.
   */
  // TODO: check wether it would work if we will define tweens right here
  transition = t => t.duration(300);

  /**
   * X-scale
   */
  get x() {
    const x = d3.scaleBand().rangeRound([0, this.effectiveWidth]).padding(0.1);

    x.domain(this.data.map(d => d.letter));

    return x;
  }

  /**
   * Y-scale
   */
  get y() {
    const y = d3.scaleLinear().rangeRound([this.effectiveHeight, 0]);

    y.domain([0, 0.15]);

    return y;
  }

  /**
   * Effective chart height
   */
  get effectiveHeight(): number {
    return this.height - this.margin.top - this.margin.bottom;
  }

  /**
   * Effective chart width
   */
  get effectiveWidth(): number {
    return this.width - this.margin.left - this.margin.right;
  }

  /**
   * X-axe builder. The function we always pass into selection.call
   */
  get xAxe(): D3Callee {
    return d3.axisBottom(this.x);
  }

  /**
   * Y-axe builder. The function we always pass into selection.call
   */
  get yAxe(): D3Callee {
    return d3.axisLeft(this.y).ticks(10, '%');
  }

  ngOnChanges(changes) {
    console.log('CHANGE', changes);
  }

  /**
   * Comparator that helps to identify particular item in the list.
   * It has been used by ngForOf directive
   * @param i 
   * @param item 
   */
  dataComparator(i: number, item: any) {
    return item.letter;
  }

  /**
   * Translate helper function
   * @param param an object that contains top and left transition values. 
   */
  translateTo({left = 0, top = 0}: {left?: number, top?: number}): string {
    return `translate(${left},${top})`;
  }
}
