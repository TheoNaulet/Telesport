import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { StatComponent } from 'src/app/shared/stat/stat.component';
import { PageTitleComponent } from 'src/app/shared/page-title/page-title.component';
import { PieChartData } from 'src/app/core/models/Chart-data';
import { Participation } from 'src/app/core/models/Participation';
import { Country } from 'src/app/core/models/Country';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [NgIf, NgxChartsModule, FontAwesomeModule, StatComponent, PageTitleComponent], 
})

export class HomeComponent implements OnInit, OnDestroy {
  public olympics: Country[] = []; // Array to store Olympic data
  public numberOfJOs: number = 0; // Number of Olympic Games (JO in French)
  public numberOfCountries: number = 0; // Number of countries participating
  public chartData: PieChartData[] = []; // Data for the pie chart visualization
  public faMedal = faMedal; // FontAwesome icon for medal
  private subscription: Subscription = new Subscription(); // To store subscriptions for proper unsubscription on destroy

  constructor(private olympicService: OlympicService, private router: Router) {}

  /**
   * Lifecycle hook called when the component is initialized.
   * Here we subscribe to the OlympicService to fetch Olympic data.
   */
  ngOnInit(): void {
    // Subscribing to the Olympic data and storing the subscription
    this.subscription.add(
      this.olympicService.getOlympics().subscribe((data: Country[] | null) => {
        if (data) {
          this.olympics = data; // 'data' est typé en 'Olympic[]'
          this.numberOfJOs = this.getNumberOfJOs(); // Calculer le nombre de JO
          this.numberOfCountries = this.getNumberOfCountries(); // Calculer le nombre de pays participants
          this.chartData = this.getChartData(); // Préparer les données pour le graphique
        }
      })
    );
  }

  /**
   * Prepares the data for the pie chart visualization.
   * It calculates the total number of medals for each country.
   * @returns PieChartData[] - The data structure required for the pie chart.
   */
  getChartData(): PieChartData[] {
    return this.olympics.map((country: Country): PieChartData => {
      const totalMedals = country.participations.reduce(
        (acc: number, participation: Participation) => acc + participation.medalsCount,
        0
      );

      return {
        name: country.country, // Country name
        value: totalMedals // Total medals won by the country
      };
    });
  }

  /**
   * Returns the number of countries participating in the Olympics.
   * @returns number - The length of the olympics array representing the number of countries.
   */
  getNumberOfCountries(): number {
    return this.olympics.length; 
  }

  /**
   * Calculates the number of Olympic Games (JOs) by finding unique years.
   * @returns number - Total number of unique Olympic years.
   */
  getNumberOfJOs(): number {
    let yearsOfJOs: number[] = [];

    this.olympics.forEach(olympic => {
      olympic.participations.forEach((participation: { year: number }) => {
        // Push the year if it's not already in the array
        if (!yearsOfJOs.includes(participation.year)) {
          yearsOfJOs.push(participation.year);
        }
      });
    });

    return yearsOfJOs.length; // Return the total number of unique Olympic years
  }
  
  /**
   * Navigates to the detail page.
   * This is triggered when the user clicks a button or element that triggers the navigation.
   */
  goToDetail(): void {
    this.router.navigate(['/detail']);
  }

  /**
   * Handles the event when a user selects a country in the chart.
   * It navigates to the detail page of the selected country.
   * @param event - The event containing the selected country's name.
   */
  onSelect(event: { name: string }): void {
    const countryName = event.name;
    this.router.navigate(['/detail', countryName.toLowerCase()]); // Navigating to the detail page for the selected country
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   * We use it to unsubscribe from any active subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions to clean up
  }
}
