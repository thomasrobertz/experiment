import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-arrow-renderer',
  standalone: true,
  template: `
    <span [style.color]="params.value === '▲ ' ? 'green' : 'red'">
      {{ params.value }}
    </span>
  `
})
export class ArrowRendererComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    console.log('refresh');
    return true;
  }
}
