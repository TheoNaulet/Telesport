import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics: Array<any> = []; 
  public numberOfJOs: number = 0;
  public numberOfCountries: number = 0;

  constructor(private olympicService: OlympicService, private router : Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((data) => {
      this.olympics = data; 
      this.numberOfJOs = this.getNumberOfJOs(); 
      this.numberOfCountries = this.getNumberOfCountries();
    });
  }

  getNumberOfCountries(): number {
    return this.olympics.length; 
  }

  getNumberOfJOs(): number {
    let yearsOfJOs: number[] = [];

    this.olympics.forEach(olympic => {
      console.log(olympic);
      olympic.participations.forEach((participation: { year: number }) => {
        if (!yearsOfJOs.includes(participation.year)) {
          yearsOfJOs.push(participation.year);
        }
      });
    });

    return yearsOfJOs.length;
  }
  
  goToDetail(): void {
    this.router.navigate(['/detail']);
  }
}
