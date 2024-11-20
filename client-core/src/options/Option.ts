/**
 * This interface represents protobuf options.
 *
 * **For now, RRpc supports only service and rpc options.**
 *
 * @property name the name assigned to the given option. It's used mostly for debugging
 * and better understanding of the code. It has no actual connection with resolving
 * options within requests or responses.
 * @property tag unique identifier assigned to the given option.
 */
export interface Option<T> {
    name: string;
    tag: number;
}

/**
 * ServiceOption represents the option related to a service in the protobuf options.
 */
export class ServiceOption<T> implements Option<T> {
    public name: string;
    public tag: number;

    constructor(name: string, tag: number) {
        this.name = name;
        this.tag = tag;
    }
}

/**
 * RPCOption represents the option related to an RPC in the protobuf options.
 */
export class RPCOption<T> implements Option<T> {
    public name: string;
    public tag: number;

    constructor(name: string, tag: number) {
        this.name = name;
        this.tag = tag;
    }
}

/**
 * FileOption represents the option related to a file in the protobuf options.
 */
export class FileOption<T> implements Option<T> {
    public name: string;
    public tag: number;

    constructor(name: string, tag: number) {
        this.name = name;
        this.tag = tag;
    }
}