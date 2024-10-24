import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StatComponent } from 'src/app/shared/stat/stat.component'; 
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { Country } from 'src/app/core/models/Country';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';
import { LineChartData } from 'src/app/core/models/Chart-data';
import { Subscription } from 'rxjs';

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

export class DetailComponent implements OnInit, OnDestroy {
  public olympics: Olympic[] = []; // Array to hold all Olympic data
  public country: any; // The selected country data
  public countryName: string = ''; // The name of the selected country
  public numberOfEntries: number = 0; // Total number of entries for the selected country
  public totalMedals: number = 0; // Total number of medals for the selected country
  public totalAthletes: number = 0; // Total number of athletes for the selected country
  public chartData: LineChartData[] = []; // Data for the line chart
  public faArrowLeft = faArrowLeft; // FontAwesome icon for back arrow
  private subscription: Subscription = new Subscription(); // Subscription to manage observables

  constructor(private olympicService: OlympicService, private router: Router) {}
  
  /**
   * Lifecycle hook called when the component is initialized.
   * Here we subscribe to the OlympicService to fetch Olympic data.
   */
  ngOnInit(): void {
    // Subscribing to the Olympic data and storing the subscription
    this.subscription.add(
      this.olympicService.getOlympics().subscribe({
        next: (data: Olympic[]) => {
          this.olympics = data;
          this.countryName = this.router.url.split('/').pop() || ''; // Extract country name from the URL
          this.countryName = decodeURIComponent(this.countryName)
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' '); // Properly format the country name
          
          // Fetch country data based on the country name
          this.country = this.getDataByCountry(this.countryName);
    
          if (!this.country) {
            console.error(`No data found for country: ${this.countryName}`);
            return;
          }

          // Populate the number of entries, total medals, total athletes, and chart data
          this.numberOfEntries = this.getNumberOfEntries(this.country);
          this.totalMedals = this.getTotalNumberOfMedals(this.country);
          this.totalAthletes = this.getTotalNumberOfAthletes(this.country);
          this.chartData = this.getChartData(this.country);
        },
        error: (err) => {
          console.error('Error occurred:', err); // Handle error if the subscription fails
        }
      })
    );
  }

  /**
   * Fetch the data for the selected country based on its name.
   * @param countryName - The name of the country
   * @returns Country[] - Array of countries matching the name
   */
  getDataByCountry(countryName: string): Country | undefined {
    const decodedCountryName = decodeURIComponent(countryName); // Decode the country name
    return this.olympics.find(olympic => olympic.country.toLowerCase() === decodedCountryName.toLowerCase());
  }

  /**
   * Get the number of entries (Olympic participations) for the selected country.
   * @param country - The selected country data
   * @returns number - The number of entries
   */
  getNumberOfEntries(country: Country): number {
    return country.participations.length;
  }

  /**
   * Get the total number of medals won by the selected country.
   * @param country - The selected country data
   * @returns number - The total number of medals
   */
  getTotalNumberOfMedals(country: Country): number {
    return country.participations.reduce(
      (total: number, participation: Participation) => total + participation.medalsCount, 0
    );
  }

  /**
   * Get the total number of athletes who participated for the selected country.
   * @param country - The selected country data
   * @returns number - The total number of athletes
   */
  getTotalNumberOfAthletes(country: Country): number {
    return country.participations.reduce(
      (total: number, participation: Participation) => total + participation.athleteCount, 0
    );
  }

  /**
   * Prepare the data for the line chart visualization.
   * @param country - The selected country data
   * @returns LineChartData[] - Data structure for the line chart
   */
  getChartData(country: Country): LineChartData[] {
    return [
      {
        name: country.country, // Country name
        series: country.participations.map((participation: Participation) => {
          return {
            name: participation.year.toString(), // Year of participation
            value: participation.medalsCount // Number of medals in that year
          };
        })
      }
    ];
  }

  /**
   * Navigate back to the previous page.
   */
  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the home page
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   * We use it to unsubscribe from any active subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Unsubscribe from the service to clean up
  }
}
