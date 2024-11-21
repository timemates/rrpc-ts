type RpcDefinition<TInput, TOutput> = {
    kind: RpcKind;
    handler: (input: TInput) => TOutput;
    serialize: (response: TOutput) => Uint8Array;
    deserialize: (data: Uint8Array) => TInput;
};

export class RpcContainer {
    private readonly rpcs: Record<string, RpcDefinition<any, any>>;

    public constructor(rpcs: Record<string, RpcDefinition<any, any>>) {
        this.rpcs = rpcs;
    }

    public getRpc<TInput, TOutput>(
        name: string,
        kind: RpcKind
    ): RpcDefinition<TInput, TOutput> {
        const rpc = this.rpcs[name];
        if (!rpc) throw new Error(`RPC with name '${name}' not found.`);
        if (rpc.kind !== kind) throw new Error(`RPC '${name}' does not match the expected kind '${RpcKind[kind]}'.`);
        return rpc as RpcDefinition<TInput, TOutput>;
    }
}

export enum RpcKind {
    REQUEST_RESPONSE,
    REQUEST_STREAM,
    REQUEST_CHANNEL,
    METADATA_PUSH,
    FIRE_AND_FORGET,
}