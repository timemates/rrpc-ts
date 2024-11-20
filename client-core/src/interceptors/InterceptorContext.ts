import {ProvidableInstance} from "../instances/ProvidableInstance";

require("@protobufjs")

import {RRpcMetadata} from "../RRpcMetadata";
import {InstanceContainer} from "../instances/InstanceContainer";
import {Options} from "../options/Options";
import {DataVariant} from "../DataVariant";

/**
 * Represents the context for interceptors to access and modify request-related data,
 * metadata, and options during request processing.
 */
export class InterceptorContext<TMetadata extends RRpcMetadata> {
    public readonly data: DataVariant;
    public readonly metadata: TMetadata;
    public readonly options: Options;
    public readonly instances: InstanceContainer;

    /**
     * Constructs an InterceptorContext instance with required metadata, options, and instances.
     * @param data - The request/response data linked to the request.
     * @param metadata - The metadata linked to the request.
     * @param options - The options linked to the request.
     * @param instances - The instances container for the request pipeline.
     */
    public constructor(
        data: DataVariant,
        metadata: TMetadata,
        options: Options,
        instances: InstanceContainer
    ) {
        this.data = data;
        this.metadata = metadata;
        this.options = options;
        this.instances = instances;
    }

    public builder(): InterceptorContextBuilder<TMetadata> {
        return new InterceptorContextBuilder(this);
    }

    /**
     * Modifies the context immutably using a configuration block.
     * @param configBlock - The configuration block to modify the context.
     * @returns A new `InterceptorContext` instance with the modifications.
     */
    public modify(configBlock: (builder: InterceptorContextBuilder<TMetadata>) => void): InterceptorContext<TMetadata> {
        const builder = this.builder();
        configBlock(builder);
        return builder.build();
    }
}

/**
 * Builder class for modifying an immutable InterceptorContext.
 */
export class InterceptorContextBuilder<TMetadata extends RRpcMetadata> {
    private data: DataVariant;
    private metadata: TMetadata;
    private options: Options;
    private instances: InstanceContainer;

    constructor(context: InterceptorContext<TMetadata>) {
        this.data = context.data;
        this.metadata = context.metadata;
        this.options = context.options;
        this.instances = context.instances;
    }

    /**
     * Sets the request/response data in the builder.
     * @param data - The new request/response data.
     * @returns The builder instance for chaining.
     */
    public setData(data: DataVariant): this {
        this.data = data;
        return this;
    }

    /**
     * Sets the metadata in the builder.
     * @param metadata - The new metadata for the request.
     * @returns The builder instance for chaining.
     */
    public setMetadata(metadata: TMetadata): this {
        this.metadata = metadata;
        return this;
    }

    /**
     * Sets the options in the builder.
     * @param options - The new options for the request.
     * @returns The builder instance for chaining.
     */
    public setOptions(options: Options): this {
        this.options = options;
        return this;
    }

    /**
     * Adds local instances to the request pipeline.
     * @param instances - The list of local instances to add.
     * @returns The builder instance for chaining.
     */
    public addLocalInstances(instances: ProvidableInstance[]): this {
        this.instances.addAll(instances);
        return this;
    }

    /**
     * Constructs the immutable InterceptorContext based on the current builder state.
     * @returns The newly built InterceptorContext.
     */
    public build(): InterceptorContext<TMetadata> {
        return new InterceptorContext(this.data, this.metadata, this.options, this.instances);
    }
}