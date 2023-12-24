import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

interface SuccessResponse {
  statusCode: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private headers = new HttpHeaders();

  public preset_urls = {
    github_repo: 'https://api.github.com/repos/fearganni/LethalizeManager',
    github_releases: `https://api.github.com/repos/fearganni/LethalizeManager/releases`,
    thunderstore_api:
      'https://thunderstore.io/c/lethal-company/api/v1/package/',
  };

  constructor(private http: HttpClient, private ts: ToastrService) {}

  // Error handler
  private errorHandle = (e: HttpErrorResponse): Observable<never> => {
    let message = '';

    if (e.error && 'errors' in e.error && e.error.errors.length) {
      const firstError = e.error.errors[0] as { msg: string; param: string }; // Assuming a structure for the error
      message = `${firstError.msg} for field ${firstError.param}`;
    } else if (e.error && 'message' in e.error) {
      message = e.error.message;
    } else if (e.message) {
      message = e.message;
    } else {
      message =
        'An unknown error has occurred. Please let our support team know if this issue continues!';
    }

    return throwError(() => new Error(message));
  };

  // Handle errors
  private errorText = (e: any): string => {
    let message: string;

    if (e.errors?.length) {
      message = e.errors[0].msg;
    } else if (e.message) {
      message = e.message;
    } else {
      message =
        'An unknown error has occurred. Please let our support team know if this issue continues!';
    }

    return message;
  };

  error = (e: unknown): void => {
    this.ts.error(this.errorText(e as any)); // Casting to 'any' to avoid type error; make sure 'e' is an appropriate error object
  };

  // Handle successes
  success = (s: SuccessResponse, title?: string): void => {
    if (s.statusCode >= 200 && s.statusCode <= 299) {
      this.ts.success(s.message, title || ''); // Ensure title is a string
    } else {
      this.ts.warning(s.message, title || ''); // Ensure title is a string
    }
  };

  // Get request
  get<T>(url: string, responseType?: string): Observable<T> {
    return this.http
      .get<T>(url, {
        headers: this.headers,
        responseType: (responseType as 'json') || 'json',
      })
      .pipe(catchError(this.errorHandle));
  }

  // Post request
  post<T>(data: any, url: string): Observable<T> {
    return this.http
      .post<T>(url, data, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandle));
  }

  // Patch request
  patch<T>(data: any, url: string): Observable<T> {
    return this.http
      .patch<T>(url, data, { headers: this.headers })
      .pipe(catchError(this.errorHandle));
  }

  delete<T>(data: any, url: string): Observable<T> {
    return this.http
      .delete<T>(url, {
        body: data,
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandle));
  }
}
