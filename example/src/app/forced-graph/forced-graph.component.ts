import { Component, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';

const FORCE = 'forse';

interface MyNode extends d3.SimulationNodeDatum {
  id: string;
  group: 1;
}

interface MyLink extends d3.SimulationLinkDatum<d3.SimulationNodeDatum> {
  source: string;
  target: string;
  value: number;
}

@Component({
  selector: 'app-forced-graph',
  templateUrl: './forced-graph.component.html',
  styleUrls: ['./forced-graph.component.css']
})
export class ForcedGraphComponent implements OnInit {
  @Input() data: { nodes: any[], links: any[] };

  width = 960;

  height = 600;

  color: d3.ScaleOrdinal<any, any> = d3.scaleOrdinal(d3.schemeCategory20);

  simulation = d3.forceSimulation<MyNode, MyLink>()
    .force(FORCE, d3.forceLink().id((d: any) => d.id))
    .force('charge', d3.forceManyBody<MyNode>())
    .force('center', d3.forceCenter<MyNode>(this.width / 2, this.height / 2));

  ngOnInit() {
    this.simulation.nodes(this.data.nodes);
    // TODO: fix issue with generic types and absence of links method for
    // some of type parameters
    (this.simulation.force(FORCE) as any).links(this.data.links);
  }

  dragFactory(d) {
    return d3.drag()
    .on('start', () => this.dragStarted(d))
    .on('drag', () => this.dragged(d))
    .on('end', () => this.dragended(d));
  }

  linkWidth(d: {value?: number}): number {
    const val = d ? d.value : 0;
    return Math.sqrt(val);
  }

  linkX1(d) {
    return d ? d.source.x : 0;
  }

  linkY1(d) {
    return d ? d.source.y : 0;
  }

  linkX2(d) {
    return d ? d.target.x : 0;
  }

  linkY2(d) {
    return d ? d.target.y : 0;
  }

  nodeX(d) {
    return d ? d.x : 0;
  }

  nodeY(d) {
    return d ? d.y : 0;
  }

  dragStarted(el) {
    if (!d3.event.active) { this.simulation.alphaTarget(0.3).restart(); }
    el.fx = el.x;
    el.fy = el.y;
  }

  dragged(el) {
    el.fx = d3.event.x;
    el.fy = d3.event.y;
  }

  dragended(el) {
    if (!d3.event.active) { this.simulation.alphaTarget(0); }
    el.fx = null;
    el.fy = null;
  }
}
