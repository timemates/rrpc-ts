import {Interceptor} from "./Interceptor";
import {ClientMetadata, ServerMetadata} from "../RRpcMetadata";
import {Options} from "../options/Options";
import {InstanceContainer} from "../instances/InstanceContainer";
import {InterceptorContext} from "./InterceptorContext";
import {DataVariant} from "../instances/DataVariant";
import {Single} from "rsocket-flowable";

export class Interceptors {
    request: Interceptor<ClientMetadata>[];
    response: Interceptor<ServerMetadata>[];

    constructor(request: Interceptor<ClientMetadata>[], response: Interceptor<ServerMetadata>[]) {
        this.request = request;
        this.response = response;
    }

    // Runs input interceptors and returns the result of the provided block.
    public runInputInterceptors(
        data: DataVariant,
        clientMetadata: ClientMetadata,
        options: Options,
        instanceContainer: InstanceContainer
    ): Single<InterceptorContext<ClientMetadata>> {
        const initialContext: InterceptorContext<ClientMetadata> = new InterceptorContext(
            data,
            clientMetadata,
            options,
            instanceContainer,
        );

        if (this.response.length == 0)
            return Single.of(initialContext);


        if (this.response.length == 1)
            this.response[0].intercept(initialContext);

        if (this.response.length > 1) {
            let single = this.request[0]
                .intercept(initialContext)

            for (const interceptor of this.request) {
                single = single.flatMap(
                    (context) => interceptor.intercept(context)
                );
            }

            return single;
        }

        throw new Error("Shouldn't reach this state.");
    }

    // Runs output interceptors on the provided data.
    public runOutputInterceptors(
        data: DataVariant,
        serverMetadata: ServerMetadata,
        options: Options,
        instanceContainer: InstanceContainer
    ): Single<InterceptorContext<ServerMetadata>> {
        const initialContext: InterceptorContext<ServerMetadata> = new InterceptorContext(
            data,
            serverMetadata,
            options,
            instanceContainer,
        );

        if (this.response.length == 0)
            return Single.of(initialContext);

        if (this.response.length == 1)
            this.response[0].intercept(initialContext);

        if (this.response.length > 1) {
            let single = this.response[0]
                .intercept(initialContext)

            for (const interceptor of this.response) {
                single = single.flatMap(
                    (context) => interceptor.intercept(context)
                );
            }

            return single;
        }

        throw new Error("Shouldn't reach this state.");
    }
}