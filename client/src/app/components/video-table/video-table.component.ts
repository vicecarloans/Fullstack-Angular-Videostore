import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  ViewChild
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { ApiService } from "../../service/api/api.service";
import { VideoModel, VideoPaginationModel } from "../../models/video.model";
import { AppState } from "../../models/store.model";
import { AdminReducerModel } from "../../models/admin.model";
import {
  TableModel,
  TableItem,
  TableHeaderItem,
  ModalService
} from "carbon-components-angular";

@Component({
  selector: "app-video-table",
  templateUrl: "./video-table.component.html",
  styleUrls: ["./video-table.component.scss"]
})
export class VideoTableComponent implements OnInit {
  videoListSub: Subscription;
  videoPagination$: VideoPaginationModel;
  admin: Observable<AdminReducerModel>;
  authorized: boolean;
  public loading: boolean = true;
  @Input() videoTable = new TableModel();
  @Input()
  get totalDataLength() {
    return this.videoTable.totalDataLength;
  }

  set totalDataLength(value) {
    this.videoTable.totalDataLength = value;
  }
  @ViewChild("videoTablePaginationTemplate")
  protected videoTablePaginationTemplate: TemplateRef<any>;
  @ViewChild("videoTablePaginationTemplateUpdate")
  protected videoTablePaginationTemplateUpdate: TemplateRef<any>;
  @ViewChild("videoTablePaginationTemplateDelete")
  protected videoTablePaginationTemplateDelete: TemplateRef<any>;
  constructor(
    private api: ApiService,
    private store: Store<AppState>,
    private router: Router,
    private modalService: ModalService
  ) {
    this.admin = this.store.select("admin");
  }
  ngOnInit() {
    this.videoTable.pageLength = 10;

    this.admin.subscribe(state => {
      this.authorized = state.authorized;

      this.videoListSub = this.api.getVideos$().subscribe(
        res => {
          this.videoPagination$ = res;
          this.videoTable.data = this.generateBody(
            this.videoPagination$.videos
          );
          this.videoTable.totalDataLength = this.videoPagination$.count;
          this.selectPage(1);
          this.videoTable.header = this.generateHeader();
          this.loading = false;
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  doFilter(event) {
    const keyword = event.target.value;
    this.videoTable.header = this.generateHeader();
    this.videoTable.data = this.generateBody(
      this.videoPagination$.videos
    ).filter(data => {
      const result = data.reduce((acc, cell, i) => {
        const match = cell.data
          ? cell.data
              .toString()
              .toLowerCase()
              .includes(keyword && keyword.toLowerCase())
          : false;
        return acc || match;
      }, false);
      return result;
    });
  }
  generateBody(videos) {
    return videos.map(video => {
      return this.authorized
        ? [
            new TableItem({ data: video.title }),
            new TableItem({ data: `${video.time} minutes` }),
            new TableItem({ data: video.genre }),
            new TableItem({ data: `${video.rating} stars` }),
            new TableItem({ data: video.director }),
            new TableItem({
              data: video.available ? "Available" : "Unavailable"
            }),
            new TableItem({
              data: video._id,
              template: this.videoTablePaginationTemplateUpdate
            }),
            new TableItem({
              data: video._id,
              template: this.videoTablePaginationTemplateDelete
            })
          ]
        : [
            new TableItem({ data: video.title }),
            new TableItem({ data: `${video.time} minutes` }),
            new TableItem({ data: video.genre }),
            new TableItem({ data: `${video.rating} stars` }),
            new TableItem({ data: video.director }),
            new TableItem({
              data: video.available ? "Available" : "Unavailable"
            }),
            new TableItem({
              data: { id: video._id, available: video.available },
              template: this.videoTablePaginationTemplate
            })
          ];
    });
  }

  addVideo() {
    this.router.navigateByUrl("videos/create");
  }
  generateHeader() {
    return this.authorized
      ? [
          new TableHeaderItem({ data: "Title" }),
          new TableHeaderItem({ data: "Running Time" }),
          new TableHeaderItem({ data: "Genre" }),
          new TableHeaderItem({ data: "Rating" }),
          new TableHeaderItem({ data: "Director" }),
          new TableHeaderItem({ data: "Status" }),
          new TableHeaderItem({ data: "Update" }),
          new TableHeaderItem({ data: "Delete" })
        ]
      : [
          new TableHeaderItem({ data: "Title" }),
          new TableHeaderItem({ data: "Running Time" }),
          new TableHeaderItem({ data: "Genre" }),
          new TableHeaderItem({ data: "Rating" }),
          new TableHeaderItem({ data: "Director" }),
          new TableHeaderItem({ data: "Status" }),
          new TableHeaderItem({ data: "Reserve" })
        ];
  }
  customSort(index: number) {
    this.sort(this.videoTable, index);
  }

  sort(model, index: number) {
    if (model.header[index].sorted) {
      // if already sorted flip sorting direction
      model.header[index].ascending = model.header[index].descending;
    }
    model.sort(index);
  }
  getPage(page: number) {
    const line = data => {
      return data.map(column => {
        return { data: column.data, template: column.template };
      });
    };

    const fullPage = [];
    const allData = this.generateBody(this.videoPagination$.videos);
    for (
      let i = (page - 1) * this.videoTable.pageLength;
      i < page * this.videoTable.pageLength &&
      i < this.videoTable.totalDataLength;
      i++
    ) {
      fullPage.push(line(allData[i]));
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(fullPage), 150);
    });
  }

  handleReserve(id) {
    this.router.navigateByUrl(`/reserve/${id}`);
  }
  handleDelete(id) {
    if (this.authorized) {
      this.modalService.show({
        modalType: "danger",
        modalTitle: "Delete this video",
        modalContent:
          "Are you sure you want to delete this video? Deletion of this content cannot be reversed",
        buttons: [
          {
            text: "Cancel"
          },
          {
            text: "Delete",
            click: () => this.confirmDelete(id)
          }
        ]
      });
    } else {
      this.modalService.show({
        modalType: "danger",
        modalTitle: "Uh-oh",
        modalContent:
          "I know what you're trying to do ;). Please don't do that without signing in",
        buttons: [
          {
            text: "I understand...Sorry..."
          }
        ]
      });
    }
  }
  confirmDelete(id) {
    this.api.deleteVideo(id).subscribe(
      res => {
        console.log(res);
        // location.reload();
      },
      err => console.log(err)
    );
  }
  handleUpdate(id) {
    this.router.navigateByUrl(`/update/video/${id}`);
  }
  selectPage(page) {
    this.getPage(page).then((data: Array<Array<any>>) => {
      // set the data and update page
      this.videoTable.data = this.prepareData(data);
      this.videoTable.currentPage = page;
    });
  }
  protected prepareData(data: Array<Array<any>>) {
    // create new data from the service data
    let newData = [];
    data.forEach(dataRow => {
      let row = [];
      dataRow.forEach(dataElement => {
        row.push(
          new TableItem({
            data: dataElement.data,
            template: dataElement.template
          })
        );
      });
      newData.push(row);
    });
    return newData;
  }

  ngOnDestroy(): void {
    this.videoListSub.unsubscribe();
  }
}
