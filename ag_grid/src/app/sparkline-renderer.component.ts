import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface SparklineParams extends ICellRendererParams {
  data: {
    priceHistory: number[];
  }
}

@Component({
  selector: 'app-sparkline-renderer',
  standalone: true,
  template: `
    <canvas #sparklineCanvas width="100" height="30"></canvas>
  `,
  styles: [`
    canvas {
      width: 100px;
      height: 30px;
    }
  `]
})
export class SparklineRendererComponent implements ICellRendererAngularComp, OnInit {
  @ViewChild('sparklineCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  params!: SparklineParams;
  
  ngOnInit() {
    this.drawSparkline();
  }

  agInit(params: SparklineParams): void {
    this.params = params;
    this.drawSparkline();
  }

  refresh(params: SparklineParams): boolean {
    this.params = params;
    this.drawSparkline();
    return true;
  }

  private drawSparkline(): void {
    if (!this.params?.data?.priceHistory?.length) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 2;
    const data = this.params.data.priceHistory;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min and max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 1.5;

    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - (((value - min) / range) * (height - 2 * padding) + padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }
}
