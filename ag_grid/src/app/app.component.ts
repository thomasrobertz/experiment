import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { NumberFormatterComponent } from './number-formatter.component';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular, NumberFormatterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { // Actually implements OnInit is optional, ngOnInit and other Lifecycle hooks will still be called.
  title = 'ag-grid-demo';

  colDefs: ColDef[] = [
    { field: 'make' },
    { field: 'model' },
    { 
      field: 'price',
      cellRenderer: NumberFormatterComponent
    },
    { field: 'electric' }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true
  };

  rowData: IRow[] = [ // Typed, could also just be:   rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true, },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juker", price: 20675, electric: false },
  ];

  ngOnInit() {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then(result => result.json())
      .then(rowData => this.rowData = rowData);
  }
}
