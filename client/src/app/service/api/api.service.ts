import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { throwError as ObservableThrowError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  VideoModel,
  VideoPaginationModel
} from "../../core/models/video.model";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  // Get list of videos
  getVideos$(): Observable<VideoPaginationModel> {
    return this.http
      .get<VideoPaginationModel>("http://localhost:5000/api/videos")
      .pipe(catchError(err => this._handleError(err)));
  }
  getVideoById$(id): Observable<VideoModel> {
    return this.http
      .get<VideoModel>(`http://localhost:5000/api/videos/${id}`)
      .pipe(catchError(err => this._handleError(err)));
  }
  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || "Error: Unable to complete request.";
    // if (err.status && err.status == 401) {
    //   this.auth.login();
    // }
    console.log(err);
    return ObservableThrowError(errorMsg);
  }
}
