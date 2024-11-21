export interface ProvidableInstance {
    key: InstanceKey<any>;
}

export class InstanceKey<TInstance extends ProvidableInstance> {
    public readonly key: string;

    public constructor(key: string) {
        this.key = key;
    }
}