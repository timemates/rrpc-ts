import {RRpcMetadata} from "../RRpcMetadata";
import {InterceptorContext} from "./InterceptorContext";
import {Single} from "rsocket-flowable";

export interface Interceptor<TMetadata extends RRpcMetadata> {
    /**
     * Intercepts and processes the given [context].
     *
     * **Should never throw any exceptions.** All exceptions should be handled and correctly
     * passed into `InterceptorContext.data`.
     *
     * @param context The context containing metadata to be processed by the interceptors.
     * @returns The processed [InterceptorContext] with potentially modified metadata.
     */
    intercept(context: InterceptorContext<TMetadata>): Single<InterceptorContext<TMetadata>>;
}