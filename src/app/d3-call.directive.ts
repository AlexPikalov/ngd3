import { Directive, OnInit, Input, ElementRef } from '@angular/core';

import * as d3 from 'd3';

export type D3Callee = (selection: d3.Selection<any, {}, null, undefined>, ...args: any[]) => void;

@Directive({
  selector: '[d3Call]'
})
export class D3CallDirective implements OnInit {
  @Input() d3Call: D3Callee = () => {};

  constructor(private el: ElementRef) {}

  ngOnInit() {
    d3.select(this.el.nativeElement).call(this.d3Call);
  }
}
