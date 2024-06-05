export interface IAssetKey <AssetType> {
  readonly key: string
  readonly type: AssetType
  readonly url: string
}

export interface AssetType<ReturnType> {
  readonly key: string
  load: (key: IAssetKey<AssetType<ReturnType>>) => Promise<ReturnType>
}

export interface AssetTypeMap {
  IMAGE: AssetType<HTMLImageElement>
  AUDIO: AssetType<HTMLAudioElement>
}

export const ASSET_TYPES: AssetTypeMap = {
  IMAGE: {
    key: 'image',
    async load (key) {
      const data = await fetch(key.url)
      const imageBlob = await data.blob()
      const imageObjectURL = URL.createObjectURL(imageBlob)

      const image = document.createElement('img')
      image.src = imageObjectURL
      await (new Promise((res) => image.onload = res))
      return image
    }
  },
  AUDIO: {
    key: 'audio',
    async load (key) {
      const data = await fetch(key.url)
      const audioBlob = await data.blob()
      const audioObjectURL = URL.createObjectURL(audioBlob)
      const audio = document.createElement('audio')
      audio.src = audioObjectURL
      await (new Promise((res) => audio.onload = res))
      return audio
    }
  }
}

export class AssetKey<T extends typeof ASSET_TYPES[keyof AssetTypeMap]> implements IAssetKey<T> {
  readonly type: T
  readonly url: string
  readonly key: string

  constructor (asset_type: T, url: string) {
    this.type = asset_type
    this.url = url
    this.key = this.type.key + '_' + url
  }
}

export default interface IResourceLoader {
  load: <T>(asset_key: IAssetKey<AssetType<T>>) => Promise<T>
}
