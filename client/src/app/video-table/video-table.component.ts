import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ApiService } from "../core/api.service";
import { VideoModel, VideoPaginationModel } from "../core/models/video.model";
@Component({
  selector: "app-video-table",
  templateUrl: "./video-table.component.html",
  styleUrls: ["./video-table.component.scss"]
})
export class VideoTableComponent implements OnInit {
  videoListSub: Subscription;
  videoPagination$: VideoPaginationModel;
  video$: VideoModel[];
  constructor(private api: ApiService) {}

  ngOnInit() {
    this.videoListSub = this.api.getVideos$().subscribe(
      res => {
        this.videoPagination$ = res;
        console.log(this.videoPagination$);
      },
      err => {
        console.log(err);
      }
    );
  }
  ngOnDestroy(): void {
    this.videoListSub.unsubscribe();
  }
}
