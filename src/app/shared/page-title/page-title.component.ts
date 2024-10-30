import { Component, Input } from '@angular/core';

/**
 * PageTitleComponent is a reusable component that displays a title for the page.
 * It accepts a `title` input property which is displayed within the component.
 */
@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  standalone: true
})
export class PageTitleComponent {
  /**
   * The title to be displayed on the page.
   * This value is passed as an input from the parent component.
   */
  @Input() title: string = '';
}
