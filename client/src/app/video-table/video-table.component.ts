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
import { ApiService } from "../core/api.service";
import { VideoModel, VideoPaginationModel } from "../core/models/video.model";
import { AppState } from "../core/models/store.model";
import { AdminReducerModel } from "../core/models/admin.model";
import {
  TableModel,
  TableItem,
  TableHeaderItem
} from "carbon-components-angular";

@Component({
  selector: "app-video-table",
  templateUrl: "./video-table.component.html",
  styleUrls: ["./video-table.component.scss"]
})
export class VideoTableComponent implements OnInit {
  videoListSub: Subscription;
  videoPagination$: VideoPaginationModel;
  video$: VideoModel[];
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

  @ViewChild("filter")
  filter: TemplateRef<any>;
  @ViewChild("filterableHeaderTemplate")
  protected filterableHeaderTemplate: TemplateRef<any>;
  @ViewChild("videoTablePaginationTemplate")
  protected videoTablePaginationTemplate: TemplateRef<any>;
  @ViewChild("videoTablePaginationTemplateUpdate")
  protected videoTablePaginationTemplateUpdate: TemplateRef<any>;
  @ViewChild("videoTablePaginationTemplateDelete")
  protected videoTablePaginationTemplateDelete: TemplateRef<any>;
  constructor(
    private api: ApiService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.admin = this.store.select("admin");
  }
  ngOnInit() {
    this.videoTable.pageLength = 10;

    this.admin.subscribe(state => {
      this.loading = state.loading;
      setTimeout(() => {
        this.videoTable.header = this.generateHeader();
      }, 300);

      this.authorized = state.authorized;

      this.videoListSub = this.api.getVideos$().subscribe(
        res => {
          this.videoPagination$ = res;
          this.videoTable.data = this.generateBody(
            this.videoPagination$.videos
          );
          this.videoTable.totalDataLength = this.videoPagination$.count;
          this.selectPage(1);
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
        return acc || cell.data.toLowerCase().includes(keyword);
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
              data: video._id,
              template: this.videoTablePaginationTemplate
            })
          ];
    });
  }
  generateHeader() {
    return this.authorized
      ? [
          new TableHeaderItem({
            data: "Title",
            filterTemplate: this.filter
          }),
          new TableHeaderItem({
            data: "Running Time"
          }),
          new TableHeaderItem({ data: "Genre" }),
          new TableHeaderItem({ data: "Rating" }),
          new TableHeaderItem({
            data: "Director"
          }),
          new TableHeaderItem({ data: "Status" }),
          new TableHeaderItem({ data: "Update" }),
          new TableHeaderItem({ data: "Delete" })
        ]
      : [
          new TableHeaderItem({ data: "Title", filterTemplate: this.filter }),
          // new FilterableHeaderItem({
          //   data: "Title",
          //   filterTemplate: this.filter
          // }),
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

    for (
      let i = (page - 1) * this.videoTable.pageLength;
      i < page * this.videoTable.pageLength &&
      i < this.videoTable.totalDataLength;
      i++
    ) {
      fullPage.push(line(this.videoTable.data[i]));
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(fullPage), 150);
    });
  }

  handleReserve(id) {
    console.log(id);
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

class FilterableHeaderItem extends TableHeaderItem {
  filter(item: TableItem): boolean {
    if (
      typeof item.data === "string" &&
      item.data.indexOf(this.filterData.data) >= 0
    ) {
      this.filterCount = 1;
      return false;
    }
    this.filterCount = 0;
    return true;
  }
}
