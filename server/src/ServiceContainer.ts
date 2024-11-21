import {InstanceKey, ProvidableInstance} from "../../core/src/instances/ProvidableInstance";
import {RRpcService} from "./RRpcService";

export class ServiceContainer implements ProvidableInstance {
    public static KEY: InstanceKey<ServiceContainer> = new InstanceKey("ServerServiceContainer");

    key: InstanceKey<ProvidableInstance> = ServiceContainer.KEY

    private readonly services: Map<string, RRpcService>;

    constructor(services: Map<string, RRpcService>) {
        this.services = services;
    }

    public getService(identifier: string): RRpcService | undefined {
        return this.services.get(identifier);
    }
}