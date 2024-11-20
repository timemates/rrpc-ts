import {Interceptor} from "./Interceptor";
import {ClientMetadata, ServerMetadata} from "../RRpcMetadata";
import {Options} from "../options/Options";
import {InstanceContainer} from "../instances/InstanceContainer";
import {InterceptorContext} from "./InterceptorContext";
import {DataVariant} from "../DataVariant";

class Interceptors {
    request: Interceptor<ClientMetadata>[];
    response: Interceptor<ServerMetadata>[];

    constructor(request: Interceptor<ClientMetadata>[], response: Interceptor<ServerMetadata>[]) {
        this.request = request;
        this.response = response;
    }

    // Runs input interceptors and returns the result of the provided block.
    public async runInputInterceptors(
        data: DataVariant,
        clientMetadata: ClientMetadata,
        options: Options,
        instanceContainer: InstanceContainer
    ): Promise<InterceptorContext<ClientMetadata> | null> {
        if (this.request.length > 0) {
            let initialContext: InterceptorContext<ClientMetadata> = new InterceptorContext(
                data,
                clientMetadata,
                options,
                instanceContainer,
            );

            // Apply each interceptor sequentially
            for (const interceptor of this.request) {
                try {
                    initialContext = await interceptor.intercept(initialContext);
                } catch (e) {
                    // Handle failure by returning a Failure context
                    initialContext = await interceptor.intercept(
                        new InterceptorContext(
                            initialContext.data,
                            initialContext.metadata,
                            initialContext.options,
                            initialContext.instances,
                        )
                    );
                }
            }

            return initialContext;
        }

        return null;
    }

    // Runs output interceptors on the provided data.
    public async runOutputInterceptors(
        data: DataVariant<any>,
        serverMetadata: ServerMetadata,
        options: Options,
        instanceContainer: InstanceContainer
    ): Promise<InterceptorContext<ServerMetadata> | null> {
        if (this.response.length > 0) {
            let initialContext: InterceptorContext<ServerMetadata> = new InterceptorContext(
                data,
                serverMetadata,
                options,
                instanceContainer,
            );

            // Apply each interceptor sequentially
            for (const interceptor of this.response) {
                try {
                    initialContext = await interceptor.intercept(initialContext);
                } catch (e) {
                    // Handle failure by returning a Failure context
                    initialContext = await interceptor.intercept(
                        new InterceptorContext(
                            initialContext.data,
                            initialContext.metadata,
                            initialContext.options,
                            initialContext.instances,
                        )
                    );
                }
            }

            return initialContext;
        }

        return null;
    }
}