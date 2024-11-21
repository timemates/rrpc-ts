import {RRpcClientModule} from "./RRpcClientModule";
import {Message} from "protobufjs/light";
import {ClientMetadata, ServerMetadata} from "./RRpcMetadata";
import {Flowable, Single} from "rsocket-flowable";
import {Options} from "./options/Options";

/**
 * RRpcClientEngine: Core engine to handle communication between the client
 * and server over RSocket. This engine manages input/output interceptors,
 * serializes/deserializes data, and executes RSocket interactions.
 *
 * ## Supported RPC Methods:
 * - `requestResponse`: A single request yielding a single response.
 * - `requestStream`: A single request yielding a stream of responses.
 * - `requestChannel`: A bidirectional channel between client and server.
 * - `fireAndForget`: A one-way request without expecting a response.
 * - `metadataPush`: Sends only metadata to the server without data.
 *
 * This engine relies on interceptors for preprocessing and postprocessing
 * requests and responses, ensuring consistency and allowing extensibility.
 */
export class RRpcClientEngine {
    private readonly module: RRpcClientModule

    /**
     * Constructs a new RRpcClientEngine instance.
     *
     * @param module The RRpcClientModule responsible for providing RSocket
     * transport and managing interceptors.
     */
    constructor(module: RRpcClientModule) {
        this.module = module;
    }


    /**
     * Sends a single request to the server and waits for a single response.
     *
     * @template T The type of the request message.
     * @template R The type of the response message.
     *
     * @param metadata Metadata to accompany the request.
     * @param requestData The request payload to send to the server.
     * @param serialize Converts response bytes to the corresponding response object.
     * @param deserialize Converts the request object into bytes to send.
     * @param options Additional options for the RPC call.
     * @returns A `Single<R>` containing the server's response.
     */
    public requestResponse<T extends Message<T>, R extends Message<T>>(
        metadata: ClientMetadata,
        requestData: T,
        serialize: (bytes: Uint8Array | undefined) => R,
        deserialize: (value: T) => Uint8Array,
        options: Options
    ): Single<R> {
        return this.module.interceptors.runInputInterceptors(
            requestData,
            metadata,
            options,
            this.module.instances,
        ).flatMap((context) => {
            return this.module.rsocket.requestResponse({
                metadata: ClientMetadata.encode(context.metadata).finish(),
                data: deserialize(context.data as T)
            }).flatMap((payload) => {
                const metadata = payload.metadata
                    ? ServerMetadata.decode(payload.metadata)
                    : new ServerMetadata();
                const data = serialize(payload.metadata)

                const interceptorsOutput = this.module.interceptors.runOutputInterceptors(
                    data,
                    metadata,
                    options,
                    context.instances,
                )

                if (interceptorsOutput == null) {
                    return Single.of(data);
                } else {
                    return interceptorsOutput.map((context) => context.data as R)
                }
            });
        });
    }

    /**
     * Sends a single request to the server and processes a stream of responses.
     *
     * @template T The type of the request message.
     * @template R The type of each response message in the stream.
     *
     * @param metadata Metadata to accompany the request.
     * @param requestData The request payload to send to the server.
     * @param serialize Converts response bytes to the corresponding response object.
     * @param deserialize Converts the request object into bytes to send.
     * @param options Additional options for the RPC call.
     * @returns A `Flowable<R>` emitting each response from the server.
     */
    public requestStream<T extends Message<T>, R extends Message<T>>(
        metadata: ClientMetadata,
        requestData: T,
        serialize: (bytes: Uint8Array | undefined) => R,
        deserialize: (value: T) => Uint8Array,
        options: Options
    ): Flowable<R> {
        return new Flowable<R>((subscriber) => {
            // Run input interceptors
            this.module.interceptors.runInputInterceptors(
                requestData,
                metadata,
                options,
                this.module.instances
            ).subscribe({
                onComplete: (context) => {
                    const flowableResponse = this.module.rsocket.requestStream({
                        metadata: ClientMetadata.encode(context.metadata).finish(),
                        data: deserialize(context.data as T)
                    })

                    flowableResponse.take(1)
                        .subscribe({
                            onNext: (payload) => {
                                if (payload.metadata == null)
                                    throw new Error("Shouldn't reach this state; invalid server output")

                                const serverMetadata = ServerMetadata.decode(payload.metadata)

                                this.module.interceptors.runOutputInterceptors(
                                    flowableResponse.map((payload) => {
                                        if (payload.data == null)
                                            throw new Error("Cannot be null, server error.")
                                        return serialize(payload.data)
                                    }),
                                    serverMetadata,
                                    options,
                                    context.instances,
                                ).subscribe({
                                    onComplete: (context) => {
                                        (context.data as Flowable<R>).subscribe(subscriber)
                                    },
                                    onError: (error) => { subscriber.onError(error)}
                                })
                            }
                        })
                },
                onError: (error) => subscriber.onError(error),
            });
        });
    }

    /**
     * Establishes a bidirectional channel where the client sends a stream of
     * requests and receives a stream of responses.
     *
     * @template T The type of the request messages in the stream.
     * @template R The type of each response message in the stream.
     *
     * @param metadata Metadata to accompany the request.
     * @param requestData A `Flowable<T>` emitting each request payload to send.
     * @param serialize Converts response bytes to the corresponding response object.
     * @param deserialize Converts each request object into bytes to send.
     * @param options Additional options for the RPC call.
     * @returns A `Flowable<R>` emitting each response from the server.
     */
    public requestChannel<T extends Message<T>, R extends Message<T>>(
        metadata: ClientMetadata,
        requestData: Flowable<T>,
        serialize: (bytes: Uint8Array | undefined) => R,
        deserialize: (value: T) => Uint8Array,
        options: Options
    ): Flowable<R> {
        return new Flowable<R>((subscriber) => {
            // Run input interceptors
            this.module.interceptors.runInputInterceptors(
                requestData,
                metadata,
                options,
                this.module.instances
            ).subscribe({
                onComplete: (context) => {
                    const flowableResponse = this.module.rsocket.requestChannel(
                        new Flowable((sending) => {
                            sending.onNext({ metadata: ClientMetadata.encode(metadata).finish() });

                            (context.data as Flowable<T>).subscribe({
                                onNext: (value) => sending.onNext({ data: deserialize(value) }),
                                onError: (error) => sending.onError(error),
                                onComplete: () => sending.onComplete()
                            })
                        })
                    )

                    flowableResponse.take(1)
                        .subscribe({
                            onNext: (payload) => {
                                if (payload.metadata == null)
                                    throw new Error("Shouldn't reach this state; invalid server output")

                                const serverMetadata = ServerMetadata.decode(payload.metadata)

                                this.module.interceptors.runOutputInterceptors(
                                    flowableResponse.map((payload) => {
                                        if (payload.data == null)
                                            throw new Error("Cannot be null, server error.")
                                        return serialize(payload.data)
                                    }),
                                    serverMetadata,
                                    options,
                                    context.instances,
                                ).subscribe({
                                    onComplete: (context) => {
                                        (context.data as Flowable<R>).subscribe(subscriber)
                                    },
                                    onError: (error) => { subscriber.onError(error)}
                                })
                            }
                        })
                },
                onError: (error) => subscriber.onError(error),
            });
        });
    }

    /**
     * Sends a single request to the server without expecting a response.
     *
     * @template T The type of the request message.
     *
     * @param metadata Metadata to accompany the request.
     * @param requestData The request payload to send to the server.
     * @param deserialize Converts the request object into bytes to send.
     * @param options Additional options for the RPC call.
     * @returns A `Single<void>` resolving when the request has been sent. The reason why it
     * returns `Single<void>` instead of a regular `void` – interceptors.
     */
    public fireAndForget<T extends Message<T>>(
        metadata: ClientMetadata,
        requestData: T,
        deserialize: (value: T) => Uint8Array,
        options: Options
    ): Single<void> {
        return this.module.interceptors.runInputInterceptors(
            requestData,
            metadata,
            options,
            this.module.instances,
        ).map((context) => {
            return this.module.rsocket.fireAndForget({
                metadata: ClientMetadata.encode(context.metadata).finish(),
                data: deserialize(context.data as T)
            });
        });
    }

    /**
     * Sends metadata to the server without sending a payload or expecting a response.
     *
     * @template T The type of metadata to be sent.
     *
     * @param metadata Metadata to send to the server.
     * @param options Additional options for the RPC call.
     * @returns A `Single<void>` resolving when the metadata has been sent.
     */
    public metadataPush<T extends Message<T>>(
        metadata: ClientMetadata,
        options: Options
    ): Single<void> {
        return this.module.interceptors.runInputInterceptors(
            null,
            metadata,
            options,
            this.module.instances,
        ).flatMap((context) => {
            return this.module.rsocket.metadataPush({
                metadata: ClientMetadata.encode(context.metadata).finish(),
            });
        });
    }
}