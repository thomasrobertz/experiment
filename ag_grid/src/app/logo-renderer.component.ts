import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface LogoParams extends ICellRendererParams {
  data: {
    ticker: string;
  }
}

@Component({
  selector: 'app-logo-renderer',
  standalone: true,
  template: `
    <img 
      [src]="'assets/images/' + params.data.ticker.toLowerCase() + '.svg'" 
      [alt]="params.data.ticker + ' logo'"
      style="width: 24px; height: 24px; object-fit: contain;"
    >
  `
})
export class LogoRendererComponent implements ICellRendererAngularComp {
  params!: LogoParams;

  agInit(params: LogoParams): void {
    this.params = params;
  }

  refresh(params: LogoParams): boolean {
    this.params = params;
    return true;
  }
}
