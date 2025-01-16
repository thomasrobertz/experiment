import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-number-formatter-cell',
    standalone: true,
    imports: [CurrencyPipe],
    providers: [CurrencyPipe],
    template: `
      <span>{{params.value | currency:'EUR'}}</span>
    `
  })
  export class NumberFormatterComponent {
    params: any;
  
    constructor(private currencyPipe: CurrencyPipe) {}

    agInit(params: any): void {
      this.params = params;
    }
  }