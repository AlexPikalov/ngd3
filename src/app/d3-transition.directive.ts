import {
  Directive,
  Input,
  Output,
  DoCheck,
  OnInit,
  KeyValueChanges,
  KeyValueDiffers,
  KeyValueDiffer,
  ElementRef,
  EventEmitter
} from '@angular/core';

import { Transition } from 'd3-transition';
import { select, Selection } from 'd3-selection';

// TODO: move to types
type AttrValue = number | string | boolean;
interface Attrs {
  [key: string]: AttrValue;
}

// TODO: move to types
type EaseFn = (normalizedTime: number) => number;
// TODO: move to types
type SelectionEl = Selection<HTMLElement, any, null, undefined>;

// TODO: mulitple transitions per one node, named transitions
@Directive({
  selector: '[d3Transition]'
})
export class D3TransitionDirective implements DoCheck, OnInit {
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

  @Output() onInterupt: EventEmitter<SelectionEl> = new EventEmitter();

  private _attr: Attrs = null;
  private _style: Attrs = null;
  private _delay: number = null;
  private _duration: number = null;
  private _ease: EaseFn = null;
  private _selection: SelectionEl;
  private kvAttrDiffer: KeyValueDiffer<string, any>;
  private kvStyleDiffer: KeyValueDiffer<string, any>;
  private transition: Transition<any, any, any, any>;

  constructor(
    private kvDiffers: KeyValueDiffers,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.transition = select(this.el.nativeElement).transition();
    this.transition.on('start', () => this.emitLifeCycle(this.onStart));
    this.transition.on('end', () => this.emitLifeCycle(this.onEnd));
    this.transition.on('interupt', () => this.emitLifeCycle(this.onInterupt));
    this.ngDoCheck();
    if (this.call.length > 0) {
      this.call[0](this.transition, ...this.call.slice(1));
    }
  }

  ngDoCheck() {
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
    this.transition.attr(name, value);
  }

  private applyStyleChanges(changes: KeyValueChanges<string, any>): void {
    changes.forEachAddedItem(record => this.setStyle(record.key, record.currentValue));
    changes.forEachChangedItem(record => this.setStyle(record.key, record.currentValue));
    changes.forEachRemovedItem(record => this.setStyle(record.key, null));
  }

  private setStyle(name: string, value: AttrValue): void {
    // TODO: try to do it via Angular's Renderer
    this.transition.style(name, value);
  }

  private emitLifeCycle(ee: EventEmitter<SelectionEl>): void {
    ee.emit(this._selection);
  }
}
