/*eslint-disable */
import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AdminReducerModel } from "../../models/admin.model";
import { AppState } from "../../models/store.model";
import { VideoFormModel } from "../../models/video.model";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-create-video",
  templateUrl: "./create-video.component.html",
  styleUrls: ["./create-video.component.scss"]
})
export class CreateVideoComponent implements OnInit {
  admin: Observable<AdminReducerModel>;
  loading: boolean = true;
  authorized: boolean;
  isFormValid: boolean = false;
  imageUpload: any;
  @Input()
  videoModel: VideoFormModel = new VideoFormModel();

  selectedGenre: any;
  genreList: Array<Object> = [
    {
      content: "Action",
      selected: false
    },
    {
      content: "Adventure",
      selected: false
    },
    {
      content: "Science Fiction",
      selected: false
    },
    {
      content: "Fantasy",
      selected: false
    }
  ];
  selectedRating: any;
  ratingList: Array<Object> = [
    {
      content: 1,
      selected: false
    },
    {
      content: 2,
      selected: false
    },
    {
      content: 3,
      selected: false
    },
    {
      content: 4,
      selected: false
    },
    {
      content: 5,
      selected: false
    }
  ];
  selectedStatus: any;
  statusList: Array<Object> = [
    {
      content: "Available",
      actualContent: true,
      selected: false
    },
    {
      content: "Unavailable",
      actualContent: false,
      selected: false
    }
  ];
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private sanitizer: DomSanitizer
  ) {}

  onImageUpload(event) {
    console.log(event);
    this.readUrl(event);
  }
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageUpload = URL.createObjectURL(event.target.files[0]);
    }
  }
  getUrl() {
    return `url(${this.imageUpload})`;
  }
  onClose(event) {
    console.log(event);
  }
  getCurrentGenre(event) {
    console.log(event);
  }
  getCurrentRating(event) {
    console.log(event);
  }
  getCurrentStatus(event) {
    console.log(event);
  }

  ngOnInit() {
    this.admin = this.store.select("admin");
    this.admin.subscribe(v => {
      if (!v.authorized) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.loading = false;
      }
    });
  }
}
