import {ReactiveSocket} from "rsocket-types/ReactiveSocketTypes";
import {Interceptors} from "../../core/src/interceptors/Interceptors";
import {InstanceContainer} from "../../core/src/instances/InstanceContainer";

export class RRpcServerModule {
    public readonly interceptors: Interceptors
    public readonly instances: InstanceContainer

    public constructor(
        interceptors: Interceptors,
        instances: InstanceContainer,
    ) {
        this.interceptors = interceptors;
        this.instances = instances;
    }
}