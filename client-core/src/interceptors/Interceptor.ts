import {RRpcMetadata} from "../RRpcMetadata";
import {InterceptorContext} from "./InterceptorContext";

export interface Interceptor<TMetadata extends RRpcMetadata> {
    /**
     * Intercepts and processes the given [context].
     *
     * @param context The context containing metadata to be processed by the interceptors.
     * @returns The processed [InterceptorContext] with potentially modified metadata.
     */
    intercept(context: InterceptorContext<TMetadata>): Promise<InterceptorContext<TMetadata>>;
}