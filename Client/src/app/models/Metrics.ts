export interface Metrics {
    _id?: String,
    name: String,
    alias: String,
    descriptions: {
      en:String,
      es:String
    },
    dataType: String,
    max: Number,
    interval: Number,
    __v?: Number
  }