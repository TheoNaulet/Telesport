import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StatComponent } from 'src/app/shared/stat/stat.component'; 
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component'; // Import du composant PageTitle
import { Country } from 'src/app/core/models/Country';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';
import {  LineChartData } from 'src/app/core/models/Chart-data';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [
    NgxChartsModule,    
    FontAwesomeModule,    
    StatComponent,
    PageTitleComponent
  ]
})

export class DetailComponent {
  public olympics: Olympic[] = []; 
  public country: any = {};
  public countryName: string = '';
  public numberOfEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public chartData: LineChartData[] = [];
  public faArrowLeft = faArrowLeft;
  constructor(private olympicService: OlympicService, private router : Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe({
      next: (data) => {
        this.olympics = data; 
        this.countryName = this.router.url.split('/').pop() || ''; 
        this.countryName = decodeURIComponent(this.countryName).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        this.country = this.getDataByCountry(this.countryName);
  
        if (this.country.length === 0) {
          console.error(`No data found for country: ${this.countryName}`);
          this.country = null;
          return;
        }
  
        this.numberOfEntries = this.getNumberOfEntries(this.country[0]);
        this.totalMedals = this.getTotalNumberOfMedals(this.country[0]);
        this.totalAthletes = this.getTotalNumberOfAthletes(this.country[0]);
        this.chartData = this.getChartData(this.country[0]);
      },
      error: (err) => {
        console.error('Error occurred:', err);
      }
    });
  }

  getDataByCountry(countryName: string): Country[] {
    const decodedCountryName = decodeURIComponent(countryName);
    return this.olympics.filter(olympic => olympic.country.toLowerCase() === decodedCountryName.toLowerCase());

  }

  getNumberOfEntries(country: Country): number {
    return country.participations.length;
  }

  getTotalNumberOfMedals(country: Country): number {
    return country.participations.reduce((total: number, participation: { medalsCount: number; }) => total + participation.medalsCount, 0);
  }

  getTotalNumberOfAthletes(country: Country): number {
    return country.participations.reduce((total: number, participation: { athleteCount: number; }) => total + participation.athleteCount, 0);
  }

  getChartData(country: Country): LineChartData[]  {
    return [
      {
        name: country.country,
        series: country.participations.map((participation: Participation) => {
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
