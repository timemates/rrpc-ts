// Helper function to create instances with a builder pattern
import {InstanceKey, ProvidableInstance} from "./ProvidableInstance";
import {InstancesBuilder} from "./InstanceBuilder";

export function instances(block: (builder: InstancesBuilder) => void): ProvidableInstance[] {
    const builder = new InstancesBuilder();
    block(builder);  // Configure the builder
    return builder.build();  // Return the final built instances
}

// InstanceContainer interface for holding instances
export interface InstanceContainer {

    // Retrieves an instance by its key
    getInstance<T extends ProvidableInstance>(key: InstanceKey<T>): T | undefined;

    // Add a single instance to the container
    add(instance: ProvidableInstance): InstanceContainer;

    // Add multiple instances to the container
    addAll(instances: ProvidableInstance[]): InstanceContainer;

    // Combine current container with another container
    merge(container: InstanceContainer): InstanceContainer;

    // Convert the container to a map
    asMap(): Map<InstanceKey<any>, ProvidableInstance>;
}

// Implementation of InstanceContainer
class InstanceContainerImpl implements InstanceContainer {
    private readonly instances: Map<InstanceKey<any>, ProvidableInstance>;

    constructor(instances: Map<InstanceKey<any>, ProvidableInstance>) {
        this.instances = instances;
    }

    // Get an instance by key
    public getInstance<T extends ProvidableInstance>(key: InstanceKey<T>): T | undefined {
        return this.instances.get(key) as T;
    }

    // Add a single instance to the container
    public add(instance: ProvidableInstance): InstanceContainer {
        const newMap = new Map(this.instances);
        newMap.set(instance.key, instance);
        return new InstanceContainerImpl(newMap);
    }

    // Add multiple instances to the container
    public addAll(instances: ProvidableInstance[]): InstanceContainer {
        const newMap = new Map(this.instances);
        instances.forEach(instance => {
            newMap.set(instance.key, instance);
        });
        return new InstanceContainerImpl(newMap);
    }

    public merge(container: InstanceContainer): InstanceContainer {
        return new InstanceContainerImpl(new Map([...this.instances, ...container.asMap()]));
    }

    public asMap(): Map<InstanceKey<any>, ProvidableInstance> {
        return this.instances;
    }
}

namespace InstanceContainer {
    export function create(instances: Map<InstanceKey<any>, ProvidableInstance>): InstanceContainer {
        return new InstanceContainerImpl(instances);
    }
}