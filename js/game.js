export class Game {
  constructor(rank, appid, playerCount, peakPlayerCount, name, image, description, website, dev, genres, platforms) {
    this._rank = rank;
    this._appid = appid;
    this._playerCount = playerCount;
    this._peakPlayerCount = peakPlayerCount;
    this._name = name;
    this._image = image;
    this._description = description;
    this._website = website;
    this._dev = dev;
    this._genres = genres;
    this._platforms = platforms;
  }
}