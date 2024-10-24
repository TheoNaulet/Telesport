import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { StatComponent } from 'src/app/shared/stat/stat.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
    imports: [NgIf, NgxChartsModule,  FontAwesomeModule, StatComponent], 
})

export class HomeComponent implements OnInit {
  public olympics: Array<any> = []; 
  public numberOfJOs: number = 0;
  public numberOfCountries: number = 0;
  public chartData: Array<any> = [];
  public faMedal = faMedal;

  constructor(private olympicService: OlympicService, private router : Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((data) => {
      this.olympics = data; 
      this.numberOfJOs = this.getNumberOfJOs(); 
      this.numberOfCountries = this.getNumberOfCountries();
      this.chartData = this.getChartData();
    });
  }

  getChartData(): Array<any> {
    return this.olympics.map(country => {
      const totalMedals = country.participations.reduce((acc: number, participation: any) => {
        return acc + participation.medalsCount;
      }, 0);

      return {
        name: country.country,
        value: totalMedals
      };
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

  onSelect(event: any): void {
    const countryName = event.name;
    this.router.navigate(['/detail', countryName.toLowerCase()]);
  }
}
