import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Country } from '../models/Country';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';  // URL to the mock JSON data

  // BehaviorSubject to hold the data or null if no data is available
  private olympics$ = new BehaviorSubject<Country[] | null>(null);
  // BehaviorSubject to hold loading status
  private loading$ = new BehaviorSubject<boolean>(false);
  // BehaviorSubject to hold error messages
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Loads initial Olympic data from a mock JSON file and stores it in a BehaviorSubject.
   * Handles loading states and errors during the process.
   */
  loadInitialData(): Observable<Country[] | null> {
    this.loading$.next(true);  // Set loading state to true when starting the data fetch

    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((data: Country[]) => {
        this.olympics$.next(data);   // Push the received data to the BehaviorSubject
        this.loading$.next(false);   // Set loading state to false after successful fetch
        this.error$.next(null);      // Clear any existing errors
      }),
      catchError((error) => {
        this.loading$.next(false);   // Set loading state to false when error occurs
        const errorMsg = this.getErrorMessage(error);  // Extract error message
        this.error$.next(errorMsg);   // Push the error message to the error BehaviorSubject
        console.error('Error loading Olympic data:', errorMsg);
        return throwError(() => new Error(errorMsg));  // Re-throw the error with a clear message
      })
    );
  }

  /**
   * Returns the Olympic data as an observable.
   * This data is stored in a BehaviorSubject, so it can emit the current value or future updates.
   */
  getOlympics(): Observable<Country[] | null> {
    return this.olympics$.asObservable();
  }

   /**
   * Returns a specific country by its name.
   * This method assumes that the Olympic data has already been loaded.
   * 
   * @param countryName - The name of the country to search for.
   * @returns An observable containing the country or undefined if not found.
   */
  
  getCountryByName(countryName: string): Observable<Country | undefined> {
    return this.olympics$.pipe(
      switchMap((data: Country[] | null) => {
        if (!data) {
          return this.loadInitialData().pipe(
            map(() => this.olympics$.getValue()) // Get the data after loading
          );
        }
        return of(data); // Data is already loaded
      }),
      map((data: Country[] | null) => {
        if (!data) {
          return undefined;
        }
  
        const decodedCountryName = decodeURIComponent(countryName).toLowerCase();
        const foundCountry = data.find(
          (country: Country) => country.country.toLowerCase() === decodedCountryName
        );

        return foundCountry;
      }),
      catchError(() => {
        return of(undefined); 
      })
    );
  }

  /**
   * Returns the loading state as an observable.
   * Components can subscribe to this to show/hide loading indicators.
   */
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  /**
   * Returns the error state as an observable.
   * Components can subscribe to this to display error messages to the user.
   */
  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }

  /**
   * Extracts and returns a human-readable error message from an HTTP error response.
   * You can customize this method to handle different error scenarios.
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error (e.g., network issues)
      return `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      return `Server-side error: ${error.status} - ${error.message}`;
    }
  }
}
