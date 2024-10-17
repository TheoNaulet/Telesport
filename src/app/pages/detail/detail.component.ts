import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})

export class DetailComponent {
  constructor(private router: Router ) {}

  goBack(): void {
    this.router.navigate(['/']);
  }
}
