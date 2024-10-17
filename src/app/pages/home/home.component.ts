import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';  // Importer Router


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);

  constructor(private olympicService: OlympicService, private router: Router ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }

  goToDetail(): void {
    this.router.navigate(['/detail']);
  }
}
