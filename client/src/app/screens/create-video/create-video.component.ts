/*eslint-disable */
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AdminReducerModel } from "../../models/admin.model";
import { AppState } from "../../models/store.model";
import { VideoFormModel } from "../../models/video.model";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ApiService } from "../../service/api/api.service";
import {
  FormGroup,
  FormControl,
  Validators,
  NgForm,
  AbstractControl,
  ValidatorFn
} from "@angular/forms";
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
  imageFile: any;
  form: any;
  submitting: boolean = false;
  isSelectionInvalid: boolean = false;
  @Input()
  videoModel: VideoFormModel = new VideoFormModel();
  videoForm: FormGroup;
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
    private api: ApiService
  ) {}

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
      this.api.createVideo(data).subscribe(
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
      : `url('../../../assets/profile.png')`;
  }
  onClose(event) {
    console.log(event);
  }
  getCurrentGenre(event) {
    console.log(event);
  }
  getCurrentRating(event) {
    console.log(this.selectedRating);
  }
  getCurrentStatus(event) {
    console.log(event);
  }
  get title() {
    return this.videoForm.get("title");
  }
  get time() {
    return this.videoForm.get("time");
  }
  get director() {
    return this.videoForm.get("director");
  }
  // shouldDisable() {
  //   let res = true;
  //   if (this.videoForm.valid) {
  //     if (this.selectedGenre && this.selectedRating && this.selectedStatus) {
  //       res = false;
  //     }
  //   }
  //   return res;
  // }
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

  ngOnInit() {
    this.admin = this.store.select("admin");
    this.admin.subscribe(v => {
      if (!v.authorized) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.loading = false;
      }
    });
    this.videoForm = new FormGroup({
      title: new FormControl(this.videoModel.title, [Validators.required]),
      time: new FormControl(this.videoModel.time, [
        Validators.required,
        this.inputNumberValidator(),
        this.timeNotZero()
      ]),
      director: new FormControl(this.videoModel.director, [Validators.required])
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
