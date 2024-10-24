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
import { LineChartData } from 'src/app/core/models/Line-chart';
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
  public country: Country | null = null; // The selected country data
  public countryName: string = ''; // The name of the selected country
  public numberOfEntries: number = 0; // Total number of entries for the selected country
  public totalMedals: number = 0; // Total number of medals for the selected country
  public totalAthletes: number = 0; // Total number of athletes for the selected country
  public chartData: LineChartData[] = []; // Data for the line chart
  public faArrowLeft = faArrowLeft; // FontAwesome icon for back arrow
  public viewWidth: number = 0; // Width of the chart view
  private subscription: Subscription = new Subscription(); // Subscription to manage observables

  /**
   * Constructor for the component.
   * 
   * - Injects the OlympicService to handle the retrieval of Olympic data.
   * - Injects the Router service to manage navigation within the app.
   * 
   * @param {OlympicService} olympicService - Service used to fetch Olympic data.
   * @param {Router} router - Angular Router used to navigate between routes.
   */
  constructor(private olympicService: OlympicService, private router: Router) {}
  
  /**
   * Lifecycle hook that is called after the component has been initialized.
   * 
   * - Updates the chart view based on the screen size.
   * - Sets up a resize event listener to dynamically update the chart size when the window is resized.
   * - Retrieves the country name from the current URL.
   * - Initiates the loading of the initial Olympic data from the service.
   */
  ngOnInit(): void {
    this.updateChartView();
    window.addEventListener('resize', this.updateChartView.bind(this));
    this.countryName = this.getCountryNameFromUrl();
    this.olympicService.loadInitialData().subscribe({
      next: (data) => {
        this.getCountryData();
      },
      error: (err) => {
        console.error('Error loading initial Olympic data:', err);
      }
    });
  }

  /**
   * Fetches the data for the country based on the name extracted from the URL.
   * 
   * - Subscribes to the service method that retrieves the country data by name.
   * - If the country is found, updates the component's country-specific properties such as:
   *   number of entries, total number of medals, total number of athletes, and chart data.
   * 
   * @returns {void}
   */
  getCountryData(): void {
    this.subscription.add(
      this.olympicService.getCountryByName(this.countryName).subscribe({
        next: (country: Country | undefined) => {
          if (!country) {
            console.error(`No data found for country: ${this.countryName}`);
            return;
          }

          // Update component properties with the country's data
          this.country = country;
          this.numberOfEntries = this.getNumberOfEntries(country);
          this.totalMedals = this.getTotalNumberOfMedals(country);
          this.totalAthletes = this.getTotalNumberOfAthletes(country);
          this.chartData = this.getChartData(country);
        },
        error: (err) => {
          console.error('Error occurred while fetching country data:', err);
        }
      })
    );
  }

  /**
   * Updates the chart view's width dynamically based on the current window size.
   * 
   * - For screens less than 600px wide (mobile devices), the chart width is set to 90% of the window width.
   * - For screens between 600px and 1024px (tablets), the chart width is set to 80% of the window width.
   * - For larger screens (> 1024px), the chart width is set to a fixed 900px.
   * 
   * @returns {void}
   */
  updateChartView(): void {
    if (window.innerWidth < 600) {
      this.viewWidth = window.innerWidth * 0.9;  // For small screens (mobile)
    } else if (window.innerWidth >= 600 && window.innerWidth <= 1024) {
      this.viewWidth = window.innerWidth * 0.8;  // For medium screens (tablets)
    } else {
      this.viewWidth = 900;  // For large screens (desktops)
    }
  }

  /**
   * Extracts the country name from the current URL, decodes it, 
   * and formats it by capitalizing the first letter of each word.
   * 
   * The method assumes that the country name is the last segment of the URL.
   * 
   * @returns {string} The formatted country name extracted from the URL.
   * 
   * - Decodes the URL-encoded country name (if it contains special characters).
   * - Splits the country name by spaces, capitalizes the first letter of each word, and lowercases the rest.
   * - Joins the words back into a properly formatted country name.
   */
  private getCountryNameFromUrl(): string {
    const urlCountryName = this.router.url.split('/').pop() || '';
    const formattedCountryName = decodeURIComponent(urlCountryName)
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    return formattedCountryName;
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
    window.removeEventListener('resize', this.updateChartView.bind(this));
    this.subscription.unsubscribe(); // Unsubscribe from the service to clean up
  }
}
