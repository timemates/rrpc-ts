require("@protobufjs")

import {Field, Type, Message, MapField} from "protobufjs/light";

export interface RRpcMetadata {}

/**
 * Represents metadata information.
 *
 * @property schemaVersion The current version of the schema.
 * @property serviceName The name of the service.
 * @property procedureName The name of the procedure.
 * @property extra Additional key-value metadata as a map of integers to binary data.
 */
@Type.d("ClientMetadata")
export class ClientMetadata extends Message<ClientMetadata> implements RRpcMetadata {
    /**
     * The current schema version.
     */
    @Field.d(1, "int32")
    public readonly schemaVersion: number;

    /**
     * The name of the service.
     */
    @Field.d(2, "string")
    public readonly serviceName: string;

    /**
     * The name of the procedure.
     */
    @Field.d(3, "string")
    public readonly procedureName: string;

    /**
     * Additional metadata, represented as a map of string to binary data.
     */
    @MapField.d(4, "string", "bytes")
    public readonly extra: Map<string, Uint8Array>;

    /**
     * Creates a new instance of `ClientMetadata`.
     *
     * @param schemaVersion The current version of the schema.
     * @param serviceName The name of the service.
     * @param procedureName The name of the procedure.
     * @param extra Additional metadata as a map.
     */
    constructor(
        schemaVersion: number = ClientMetadata.CURRENT_SCHEMA_VERSION,
        serviceName: string = "",
        procedureName: string = "",
        extra: Map<string, Uint8Array> = new Map()
    ) {
        super({ schemaVersion, serviceName, procedureName, extra });
        this.schemaVersion = schemaVersion;
        this.serviceName = serviceName;
        this.procedureName = procedureName;
        this.extra = extra;
    }

    /**
     * The current schema version for `ClientMetadata`.
     */
    public static readonly CURRENT_SCHEMA_VERSION = 1;

    /**
     * An empty instance of `ClientMetadata`.
     */
    public static readonly EMPTY: ClientMetadata = new ClientMetadata();

    /**
     * Creates a new instance with updated extra metadata.
     *
     * @param extra A map of additional metadata.
     * @returns A new `ClientMetadata` instance with the updated `extra` field.
     */
    public withExtra(extra: Map<string, Uint8Array>): ClientMetadata {
        return new ClientMetadata(
            this.schemaVersion,
            this.serviceName,
            this.procedureName,
            extra
        );
    }
}

/**
 * Represents metadata information sent from the server to the client.
 *
 * @property schemaVersion The current version of the schema.
 * @property extra Additional key-value metadata as a map of integers to binary data.
 */
@Type.d("ServerMetadata")
export class ServerMetadata extends Message<ServerMetadata> implements RRpcMetadata {
    /**
     * The current schema version.
     */
    @Field.d(1, "int32")
    public readonly schemaVersion: number;

    /**
     * Additional metadata, represented as a map of strings to binary data.
     */
    @MapField.d(2, "uint32", "bytes")
    public readonly extra: Map<string, Uint8Array>;

    /**
     * Creates a new instance of `ServerMetadata`.
     *
     * @param schemaVersion The current version of the schema.
     * @param extra Additional metadata as a map.
     */
    constructor(
        schemaVersion: number = ServerMetadata.CURRENT_SCHEMA_VERSION,
        extra: Map<string, Uint8Array> = new Map()
    ) {
        super({ schemaVersion, extra });
        this.schemaVersion = schemaVersion;
        this.extra = extra;
    }

    /**
     * The current schema version for `ServerMetadata`.
     */
    public static readonly CURRENT_SCHEMA_VERSION = 1;

    /**
     * An empty instance of `ServerMetadata`.
     */
    public static readonly EMPTY: ServerMetadata = new ServerMetadata();

    /**
     * Creates a new instance with updated extra metadata.
     *
     * @param extra A map of additional metadata.
     * @returns A new `ServerMetadata` instance with the updated `extra` field.
     */
    public withExtra(extra: Map<string, Uint8Array>): ServerMetadata {
        return new ServerMetadata(this.schemaVersion, extra);
    }
}