import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { throwError as ObservableThrowError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { VideoModel, VideoPaginationModel } from "../../models/video.model";
import { CustomerModelDropDown } from "../../models/customer.model";
import { ResponseContentType } from "@angular/http";

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
  getImageBlob(videoId, imagepath): Observable<any> {
    return this.http
      .get(
        `http://localhost:5000/api/videos/${videoId}/banner?imagepath=${imagepath}`,
        { responseType: "blob" }
      )
      .pipe(catchError(err => this._handleError(err)));
  }
  getCustomerInfoDropDown(): Observable<CustomerModelDropDown> {
    return this.http
      .get("http://localhost:5000/api/customers/names")
      .pipe(catchError(err => this._handleError(err)));
  }
  reserveVideo(videoId, customerId): Observable<VideoModel> {
    return this.http
      .get<VideoModel>(
        `http://localhost:5000/api/videos/${videoId}/reserve/${customerId}`
      )
      .pipe(catchError(err => this._handleError(err)));
  }
  createVideo({
    title,
    time,
    genre,
    rating,
    director,
    imagefile,
    available
  }): Observable<VideoModel> {
    let formData: FormData = new FormData();
    formData.append("title", title);
    formData.append("time", time);
    formData.append("genre", genre);
    formData.append("rating", rating);
    formData.append("director", director);
    formData.append("banner", imagefile, imagefile.name);
    formData.append("available", available);
    return this.http
      .post<VideoModel>(`http://localhost:5000/api/videos`, formData, {
        withCredentials: true
      })
      .pipe(catchError(err => this._handleError(err)));
  }

  deleteVideo(id) {
    return this.http
      .delete(`http://localhost:5000/api/videos/${id}`, {
        withCredentials: true
      })
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
