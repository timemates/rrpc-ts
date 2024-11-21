import {Interceptors} from "./interceptors/Interceptors";
import {InstanceContainer} from "./instances/InstanceContainer";
import {ReactiveSocket} from "rsocket-types/ReactiveSocketTypes";

export class RRpcClientModule {
    public readonly rsocket: ReactiveSocket<Uint8Array, Uint8Array>
    public readonly interceptors: Interceptors
    public readonly instances: InstanceContainer

    public constructor(
        rsocket: ReactiveSocket<Uint8Array, Uint8Array>,
        interceptors: Interceptors,
        instances: InstanceContainer,
    ) {
        this.rsocket = rsocket;
        this.interceptors = interceptors;
        this.instances = instances;
    }
}