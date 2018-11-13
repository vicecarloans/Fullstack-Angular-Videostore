export class VideoModel {
  constructor(
    public _id: String,
    public title: String,
    public time: Number,
    public genre: String,
    public rating: Number,
    public director: String,
    public image: String,
    public available: Boolean,
    public _customerId?: String
  ) {}
}

export class VideoPaginationModel {
  constructor(
    public videos: VideoModel[],
    public offset: Number,
    public count: Number
  ) {}
}
