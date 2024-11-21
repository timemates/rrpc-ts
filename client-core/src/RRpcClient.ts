import {RRpcClientEngine} from "./RRpcClientEngine";
import {RRpcClientModule} from "./RRpcClientModule";

/**
 * Abstract base class for RRpc clients, providing a foundation for implementing
 * specific RPC services. This class encapsulates the core functionality provided
 * by the `RRpcClientEngine`.
 *
 * ## Purpose:
 * - Acts as a base for clients that communicate with an RSocket server.
 * - Provides access to the `RRpcClientEngine` for handling RPC interactions.
 * - Encourages subclassing to define service-specific methods or behaviors.
 *
 * ## Usage:
 * Extend this class to create specific RPC service clients. Use the protected
 * `engine` to invoke RPC calls, leveraging the `RRpcClientEngine` methods like
 * `requestResponse`, `requestStream`, `requestChannel`, etc.
 *
 * ## Example:
 * ```typescript
 * class MyServiceClient extends RRpcClient {
 *     public getData(metadata: ClientMetadata, options: Options): Single<MyResponse> {
 *         return this.engine.requestResponse(
 *             metadata,
 *             new MyRequest({ ... }),
 *             (bytes) => MyResponse.decode(bytes),
 *             (value) => MyRequest.encode(value).finish(),
 *             rpcsOptions.get("getData"),
 *         );
 *     }
 * }
 * ```
 */
export abstract class RRpcClient {
    /**
     * Core engine for managing RPC interactions. Provides methods for making
     * requests (`requestResponse`, `requestStream`, `requestChannel`) and sending
     * metadata or fire-and-forget requests.
     */
    protected engine: RRpcClientEngine

    /**
     * Constructs a new RRpcClient instance and initializes the underlying engine.
     *
     * @param module The RRpcClientModule responsible for providing RSocket
     * transport and managing interceptors.
     */
    constructor(module: RRpcClientModule) {
        this.engine = new RRpcClientEngine(module);
    }
}