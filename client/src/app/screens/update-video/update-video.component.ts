import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, Route } from "@angular/router";
import { AdminReducerModel } from "../../models/admin.model";
import { VideoModel, VideoFormModel } from "../../models/video.model";
import { AppState } from "../../models/store.model";
import { ApiService } from "../../service/api/api.service";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  FormGroup,
  ValidatorFn,
  AbstractControl,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-update-video",
  templateUrl: "./update-video.component.html",
  styleUrls: ["./update-video.component.scss"]
})
export class UpdateVideoComponent implements OnInit {
  videoId$: string;
  admin: Observable<AdminReducerModel>;
  loading: boolean = true;
  authorized: boolean = true;
  isFormValid: boolean = false;
  imageUpload: any;
  imageFile: any;
  submitting: boolean = false;
  isSelectionInvalid: boolean = false;
  @Input()
  videoModel: VideoFormModel;
  videoForm: FormGroup;
  selectedGenre: any;

  genreList: Array<{ content: string; selected: boolean }> = [
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
  ratingList: Array<{ content: number; selected: boolean }> = [
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
  statusList: Array<{
    content: string;
    actualContent: boolean;
    selected: boolean;
  }> = [
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

  get title() {
    return this.videoForm.get("title");
  }
  get time() {
    return this.videoForm.get("time");
  }
  get director() {
    return this.videoForm.get("director");
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private api: ApiService
  ) {
    this.route.params.subscribe(params => {
      this.videoId$ = params.id;
    });
  }

  onImageUpload(event) {
    console.log(event);
    this.readUrl(event);
  }
  onSubmit() {
    if (
      this.videoForm.valid &&
      this.selectedGenre &&
      this.selectedRating &&
      this.selectedStatus
    ) {
      const data = {
        title: this.title.value,
        time: this.time.value,
        genre: this.selectedGenre.content,
        rating: this.selectedRating.content,
        director: this.director.value,
        imagefile: this.imageFile,
        available: this.selectedStatus.actualContent
      };
      this.submitting = true;
      this.api.updateVideo(this.videoId$, data).subscribe(
        res => {
          console.log(res);
          this.router.navigateByUrl("/dashboard");
        },
        err => console.log(err)
      );
    } else {
      this.isSelectionInvalid = true;
    }
  }
  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      this.imageUpload = URL.createObjectURL(event.target.files[0]);
    }
  }
  getUrl() {
    return this.imageUpload
      ? `url(${this.imageUpload})`
      : `url(${this.videoModel.image})`;
  }
  inputNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return isNaN(control.value) ? { isNotNumber: true } : null;
    };
  }
  timeNotZero(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return Number(control.value) === 0 ? { isZero: true } : null;
    };
  }

  getVideo() {
    this.api.getVideoById$(this.videoId$).subscribe(res => {
      this.videoModel = res;
      this.videoForm = new FormGroup({
        title: new FormControl(this.videoModel.title, [Validators.required]),
        time: new FormControl(this.videoModel.time, [
          Validators.required,
          this.inputNumberValidator(),
          this.timeNotZero()
        ]),
        director: new FormControl(this.videoModel.director, [
          Validators.required
        ])
      });
      this.genreList.forEach(genre => {
        if (genre.content == this.videoModel.genre) {
          this.selectedGenre = { ...genre, selected: true };
        }
      });
      this.ratingList.forEach(rating => {
        if (rating.content == this.videoModel.rating) {
          this.selectedRating = { ...rating, selected: true };
        }
      });
      this.statusList.forEach(status => {
        if (status.actualContent == this.videoModel.available) {
          this.selectedStatus = { ...status, selected: true };
        }
      });
      this.loading = false;
    });
  }
  ngOnInit() {
    this.admin = this.store.select("admin");
    this.admin.subscribe(v => {
      if (!v.authorized) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.getVideo();
      }
    });
  }
}
