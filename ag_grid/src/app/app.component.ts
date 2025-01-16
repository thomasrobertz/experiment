import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { NumberFormatterComponent } from './number-formatter.component';
import { ArrowRendererComponent } from './arrow-renderer.component';
import { SparklineRendererComponent } from './sparkline-renderer.component';
import { LogoRendererComponent } from './logo-renderer.component';

ModuleRegistry.registerModules([AllCommunityModule]);

const MAX_PRICES = 2000;

interface IRow {
  ticker: string;
  price: number;
  change: string;
  priceHistory: number[];
}

type GBMParams = {
  startPrice: number;  // Initial stock price
  steps: number;       // Number of time steps to simulate
  mu: number;          // Drift (expected return)
  sigma: number;       // Volatility (standard deviation of returns)
  dt: number;          // Time step size
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    RouterOutlet, 
    AgGridAngular, 
    NumberFormatterComponent, 
    ArrowRendererComponent,
    SparklineRendererComponent,
    LogoRendererComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { // Actually implements OnInit is optional, ngOnInit and other Lifecycle hooks will still be called.
  title = 'ag-grid-demo';

  colDefs: ColDef[] = [
    {
      field: 'ticker',
      headerName: '',
      width: 60,
      cellRenderer: LogoRendererComponent,
      sortable: false,
      filter: false
    },
    { 
      field: 'ticker',
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['apply', 'reset'],
        closeOnApply: true
      }
    },
    { 
      field: 'price',
      cellRenderer: NumberFormatterComponent,
      sortable: true
    },
    { 
      field: 'change',
      cellRenderer: ArrowRendererComponent,
      sortable: false
    },
    {
      field: 'priceHistory',
      headerName: 'Trend',
      cellRenderer: SparklineRendererComponent,
      sortable: false,
      valueFormatter: (params) => {
        if (params.value && Array.isArray(params.value)) {
          return params.value.join(',');
        }
        return '';
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: false,
    filter: false
  };

  rowData: IRow[] = [
    { ticker: "GGL", price: 195, change: '', priceHistory: [] },
    { ticker: "MSFT", price: 426, change: '', priceHistory: [] },
    { ticker: "TSL", price: 404, change: '', priceHistory: [] },
  ];

  async ngOnInit(): Promise<void> {

      const paramsGGL: GBMParams = {
        startPrice: 195,
        steps: MAX_PRICES,
        mu: 0.001, // Small upward drift
        sigma: 0.02, // Volatility
        dt: 1, // Assuming 1-minute steps
      };

      const paramsMSFT: GBMParams = {
        startPrice: 426,
        steps: MAX_PRICES,
        mu: 0.002, 
        sigma: 0.03, 
        dt: 1, 
      };

      const paramsTSL: GBMParams = {
        startPrice: 404,
        steps: MAX_PRICES,
        mu: 0.0016, 
        sigma: 0.07,
        dt: 1, 
      };

      const pricesGGL = this.simulateGBM(paramsGGL);
      const pricesMSFT = this.simulateGBM(paramsMSFT);
      const pricesTSL = this.simulateGBM(paramsTSL);

      let previousPriceGGL = 195;
      let previousPriceMSFT = 426;
      let previousPriceTSL = 404;

      for (let i = 0; i < MAX_PRICES; i++) {
        this.rowData[0].price = pricesGGL[i];
        this.rowData[1].price = pricesMSFT[i];
        this.rowData[2].price = pricesTSL[i];
        
        // Update price histories (keep last 20 values)
        this.rowData[0].priceHistory = [...(this.rowData[0].priceHistory.slice(-19)), pricesGGL[i]];
        this.rowData[1].priceHistory = [...(this.rowData[1].priceHistory.slice(-19)), pricesMSFT[i]];
        this.rowData[2].priceHistory = [...(this.rowData[2].priceHistory.slice(-19)), pricesTSL[i]];

        // Calculate changes
        this.rowData[0].change = (pricesGGL[i] > previousPriceGGL) ? '▲ ' : '▼';
        this.rowData[1].change = (pricesMSFT[i] > previousPriceMSFT) ? '▲ ' : '▼';
        this.rowData[2].change = (pricesTSL[i] > previousPriceTSL) ? '▲ ' : '▼';

        previousPriceGGL = pricesGGL[i];
        previousPriceMSFT = pricesMSFT[i];
        previousPriceTSL = pricesTSL[i];

        this.rowData = [...this.rowData];
        
        await this.delay(2000);
      }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  
  simulateGBM({ startPrice, steps, mu, sigma, dt }: GBMParams): number[] {
    const prices: number[] = [startPrice];
    for (let i = 0; i < steps; i++) {
      const randomShock = Math.random() * 2 - 1; // Uniform random [-1, 1]
      const priceChange = (mu - 0.5 * Math.pow(sigma, 2)) * dt + sigma * Math.sqrt(dt) * randomShock;
      const nextPrice = prices[i] * Math.exp(priceChange);
      prices.push(nextPrice);
    }
    return prices;
  }
}
