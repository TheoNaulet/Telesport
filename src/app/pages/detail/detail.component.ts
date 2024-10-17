import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  standalone: true,
  imports: [NgxChartsModule]
})

export class DetailComponent {
  public olympics: Array<any> = []; 
  public country: any = {};
  public countryName: string = '';
  public numberOfEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public chartData: Array<any> = [];

  constructor(private olympicService: OlympicService, private router : Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((data) => {
      this.olympics = data; 
      this.countryName = this.router.url.split('/').pop() || ''; 
      this.countryName = this.countryName.charAt(0).toUpperCase() + this.countryName.slice(1);
      this.country = this.getDataByCountry(this.countryName);
      this.numberOfEntries = this.getNumberOfEntries(this.country[0]);
      this.totalMedals = this.getTotalNumberOfMedals(this.country[0]);
      this.totalAthletes = this.getTotalNumberOfAthletes(this.country[0]);
      this.chartData = this.getChartData(this.country[0]);
    });
  }

  getDataByCountry(countryName: string): any {
    return this.olympics.filter(olympic => olympic.country == countryName);
  }

  getNumberOfEntries(country: any): number {
    return country.participations.length;
  }

  getTotalNumberOfMedals(country: any): number {
    return country.participations.reduce((total: any, participation: { medalsCount: any; }) => total + participation.medalsCount, 0);
  }

  getTotalNumberOfAthletes(country: any): number {
    return country.participations.reduce((total: any, participation: { athleteCount: any; }) => total + participation.athleteCount, 0);
  }

  getChartData(country: any): any[] {
    return [
      {
        name: country.country,
        series: country.participations.map((participation: any) => {
          return {
            name: participation.year.toString(),
            value: participation.medalsCount
          };
        })
      }
    ];
  }
  

  goBack(): void {
    this.router.navigate(['/']);
  }
}
