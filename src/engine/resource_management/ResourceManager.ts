import IResourceLoader, { AssetType, IAssetKey } from "./IResourceLoader";

export default class ResourceManagement implements IResourceLoader {
    private assets_loaded : Map<string, Promise<unknown> | unknown> = new Map();

    private constructor() { }

    private static _instance: ResourceManagement | null;

    static get instance(){
        return (this._instance ??= new ResourceManagement());
    }

    load<T>(asset_key: IAssetKey<AssetType<T>>): Promise<T> {
        if(this.assets_loaded.has(asset_key.key)){
            const n = this.assets_loaded.get(asset_key.key);
            if(n instanceof Promise){
                return n;
            }
            return Promise.resolve(n as T);
        }
        const n = asset_key.type.load(asset_key).then(e => {
            this.assets_loaded.set(asset_key.key, e);
            return Promise.resolve(e);
        });
        this.assets_loaded.set(asset_key.key,  n)
        return n;
    }
    
}