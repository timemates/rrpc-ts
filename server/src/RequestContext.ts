import { InstanceContainer } from "../../core/src/instances/InstanceContainer";
import {ClientMetadata} from "../../core/src/RRpcMetadata";
import {Options} from "rsocket-core/RSocketResumableTransport";

export class RequestContext {
    public readonly instances: InstanceContainer
    public readonly options: Options
    public readonly metadata: ClientMetadata

    public constructor(instances: InstanceContainer, options: Options, metadata: ClientMetadata) {
        this.instances = instances;
        this.options = options;
        this.metadata = metadata;
    }
}