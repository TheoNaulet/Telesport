import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
  standalone: true,
  imports: [CommonModule] 
})
export class StatComponent {
  @Input() title: string = '';
  @Input() value: number | string = 0;
}
