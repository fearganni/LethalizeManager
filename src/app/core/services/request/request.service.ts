import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  public preset_urls = {
    github_repo: 'https://api.github.com/repos/fearganni/LethalizeManager',
    github_releases: `https://api.github.com/repos/fearganni/LethalizeManager/releases`,
    thunderstore_api:
      'https://thunderstore.io/c/lethal-company/api/v1/package/',
  };

  constructor(private http: HttpClient, private ts: ToastrService) {}

  // Error handler
  errorHandle(e: HttpErrorResponse) {
    let message: any;

    if (typeof e.error.errors !== 'undefined') {
      message = `${e.error.errors[0].msg} for field ${e.error.errors[0].param}`;
    } else if (typeof e.error.message !== 'undefined') {
      message = e.error.message;
    } else if (typeof e.message !== undefined) {
      message = e.message;
    } else {
      message =
        'An unknown error has occurred. Please let our support team know if this issue continues!';
    }

    return throwError(() => new Error(message));
  }

  // Handle errors
  errorText(e: any): string {
    let message: string = '';
    if (typeof e.errors !== 'undefined') {
      message = e.errors[0].msg;
    } else if (typeof e.message !== 'undefined') {
      message = e.message;
    } else {
      message =
        'An unknown error has occurred. Please let our support team know if this issue continues!';
    }
    return message;
  }
  error(e: any): void {
    this.ts.error(this.errorText(e));
  }

  // Handle successes
  success(s: any, title?: string): void {
    if (s.statusCode >= 200 && s.statusCode <= 299) {
      this.ts.success(s.message, title);
    } else {
      this.ts.warning(s.message, title);
    }
  }

  // Get request
  get<T>(url: string): Observable<T> {
    return this.http
      .get<T>(url, { headers: this.headers })
      .pipe(catchError(this.errorHandle));
  }

  // Post request
  post<T>(data: any, url: string): Observable<T> {
    return this.http
      .post<T>(url, data, {
        headers: this.headers,
        responseType: 'json',
      })
      .pipe(catchError(this.errorHandle));
  }

  // Patch request
  patch<T>(data: any, url: string): Observable<T> {
    return this.http
      .patch<T>(url, data, { headers: this.headers, responseType: 'json' })
      .pipe(catchError(this.errorHandle));
  }

  delete<T>(data: any, url: string): Observable<T> {
    return this.http
      .delete<T>(url, {
        body: data,
        headers: this.headers,
        responseType: 'json',
      })
      .pipe(catchError(this.errorHandle));
  }
}
