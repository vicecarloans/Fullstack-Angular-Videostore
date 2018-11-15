export class VideoModel {
  constructor(
    public _id: string,
    public title: string,
    public time: number,
    public genre: string,
    public rating: number,
    public director: string,
    public image: string,
    public available: boolean,
    public _customerId?: string
  ) {}
}

export class VideoPaginationModel {
  constructor(
    public videos: VideoModel[],
    public offset: number,
    public count: number
  ) {}
}

export class VideoFormModel {
  constructor(
    public _id: string = "",
    public title: string = "",
    public time: number = 0,
    public genre: string = "",
    public rating: number = 0,
    public director: string = "",
    public image: any = null,
    public available: boolean = false
  ) {}
}
