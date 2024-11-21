import {Option} from "./Option";

export class Options {
    private readonly map: ReadonlyMap<number, Object>

    constructor(map: ReadonlyMap<number, Object>) {
        this.map = map;
    }

    getValue<T>(key: Option<T>): T {
        return this.map.get(key.tag) as T
    }

    asMap(): ReadonlyMap<number, Object> {
        return this.map;
    }
}