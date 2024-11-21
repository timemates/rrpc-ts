import {RRpcServerModule} from "./RRpcServerModule";
import {Flowable, Single} from "rsocket-flowable";
import {ReactiveSocket} from "rsocket-types/ReactiveSocketTypes";
import {Payload, Responder} from "rsocket-types"

export class RRpcServerResponder implements Responder<Uint8Array, Uint8Array> {
    private readonly module: RRpcServerModule;

    public constructor(module: RRpcServerModule) {
        this.module = module;
    }

    fireAndForget(payload: Payload<Uint8Array, Uint8Array>): void {

    }

    metadataPush(payload: Payload<Uint8Array, Uint8Array>): Single<void> {
        return undefined;
    }

    requestChannel(payloads: Flowable<Payload<Uint8Array, Uint8Array>>): Flowable<Payload<Uint8Array, Uint8Array>> {
        return undefined;
    }

    requestResponse(payload: Payload<Uint8Array, Uint8Array>): Single<Payload<Uint8Array, Uint8Array>> {
        return undefined;
    }

    requestStream(payload: Payload<Uint8Array, Uint8Array>): Flowable<Payload<Uint8Array, Uint8Array>> {
        return undefined;
    }

}