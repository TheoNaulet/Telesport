import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * StatComponent is a reusable component that displays a statistic.
 * It accepts two input properties: `title` for the name of the statistic,
 * and `value` for the corresponding numeric or string value to display.
 */
@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StatComponent {
  /**
   * The title of the statistic, describing what the value represents.
   * Example: "Total Medals" or "Athlete Count".
   */
  @Input() title: string = '';

  /**
   * The value of the statistic, which can be a number or a string.
   * Example: 100, "N/A", or 45.5.
   */
  @Input() value: number | string = 0;
}
