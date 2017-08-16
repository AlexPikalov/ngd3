import {
  Directive,
  Input,
  Output,
  OnChanges,
  OnInit,
  KeyValueChanges,
  KeyValueDiffers,
  KeyValueDiffer,
  ElementRef,
  EventEmitter
} from '@angular/core';

import * as d3 from 'd3';
// import { Transition } from 'd3-transition';
// import { select, Selection } from 'd3-selection';

// TODO: move to types
export type AttrValue = number | string | boolean;
interface Attrs {
  [key: string]: AttrValue;
}

// TODO: move to types
export type EaseFn = (normalizedTime: number) => number;
// TODO: move to types
export type SelectionEl = d3.Selection<HTMLElement, any, null, undefined>;

export type D3Transition = d3.Transition<HTMLElement, any, null, undefined>;

// TODO: move to types
export type TransitionDecorator = (t: D3Transition) => D3Transition;

// TODO: mulitple transitions per one node, named transitions
@Directive({
  selector: '[d3Transition]'
})
export class D3TransitionDirective implements OnChanges, OnInit {
  @Input() d3Transition: TransitionDecorator = t => t;

  @Input() call: any[] = [];

  @Input() set duration(d: number) {
    if (d !== this._duration && this.transition) {
      this._duration = d;
      this.transition.duration(d);
    }
  }

  @Input() set ease(e: EaseFn) {
    if (e !== this._ease && this.transition) {
      this._ease = e;
      this.transition.ease(e);
    }
  }

  @Input() set delay(d: number) {
    if (d !== this._delay && this.transition) {
      this._delay = d;
      this.transition.delay(d);
    }
  }

  @Input('d3-attr') set attr(v: Attrs) {
    this.kvAttrDiffer = this.kvDiffers.find(v).create();
    this._attr = v;
  }

  @Input('d3-style') set style(v: Attrs) {
    this.kvStyleDiffer = this.kvDiffers.find(v).create();
    this._style = v;
  }

  @Output() onStart: EventEmitter<SelectionEl> = new EventEmitter();

  @Output() onEnd: EventEmitter<SelectionEl>= new EventEmitter();

  @Output() onInterrupt: EventEmitter<SelectionEl> = new EventEmitter();

  private _attr: Attrs = null;
  private _style: Attrs = null;
  private _delay: number = null;
  private _duration: number = null;
  private _ease: EaseFn = null;
  private _selection: SelectionEl;
  private kvAttrDiffer: KeyValueDiffer<string, any>;
  private kvStyleDiffer: KeyValueDiffer<string, any>;
  private transition: d3.Transition<any, any, any, any>;

  constructor(
    private kvDiffers: KeyValueDiffers,
    private el: ElementRef
  ) {}

  ngOnInit() {
    // decorate basic transition with parameters provided by a directive consumer
    this.d3Transition = this.d3Transition || (t => t);
    this.transition = this.d3Transition(d3.select(this.el.nativeElement).transition().duration(300));

    this.transition.on('start', () => this.emitLifeCycle(this.onStart));
    this.transition.on('end', () => this.emitLifeCycle(this.onEnd));
    this.transition.on('interrupt', () => this.emitLifeCycle(this.onInterrupt));

    if (this.call.length > 0) {
      this.call[0](this.transition, ...this.call.slice(1));
    }

    this.ngOnChanges();
  }

  ngOnChanges() {
    const attrChanges = this.kvAttrDiffer.diff(this._attr);
    if (attrChanges && this.transition) {
      this.applyAttrChanges(attrChanges);
    }

    const styleChanges = this.kvAttrDiffer.diff(this._style);
    if (styleChanges && this.transition) {
      this.applyStyleChanges(styleChanges);
    }
  }

  private applyAttrChanges(changes: KeyValueChanges<string, any>): void {
    changes.forEachAddedItem(record => this.setAttr(record.key, record.currentValue));
    changes.forEachChangedItem(record => this.setAttr(record.key, record.currentValue));
    changes.forEachRemovedItem(record => this.setAttr(record.key, null));
  }

  private setAttr(name: string, value: AttrValue): void {
    // TODO: try to do it via Angular's Renderer
    try {
      this.transition.attr(name, value);
    } catch (err) {
      console.debug('D3.js: ' + err.message);
    };
  }

  private applyStyleChanges(changes: KeyValueChanges<string, any>): void {
    changes.forEachAddedItem(record => this.setStyle(record.key, record.currentValue));
    changes.forEachChangedItem(record => this.setStyle(record.key, record.currentValue));
    changes.forEachRemovedItem(record => this.setStyle(record.key, null));
  }

  private setStyle(name: string, value: AttrValue): void {
    // TODO: try to do it via Angular's Renderer
    try {
      this.transition.style(name, value);
    } catch (err) {
      console.debug('D3.js: ' + err.message);
    }
  }

  private emitLifeCycle(ee: EventEmitter<SelectionEl>): void {
    ee.emit(this._selection);
  }
}
