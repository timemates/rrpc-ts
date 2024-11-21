// Helper function to create instances with a builder pattern
import {InstanceKey, ProvidableInstance} from "./ProvidableInstance";
import {InstancesBuilder} from "./InstanceBuilder";

// Implementation of InstanceContainer
export class InstanceContainer {
    private readonly instances: Map<InstanceKey<any>, ProvidableInstance>;

    public static EMPTY: InstanceContainer = new InstanceContainer(new Map());

    static create(instances: Map<InstanceKey<any>, ProvidableInstance>): InstanceContainer {
        return new InstanceContainer(instances);
    }

    static builder(): InstancesBuilder {
        return new InstancesBuilder();
    }

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
        return new InstanceContainer(newMap);
    }

    // Add multiple instances to the container
    public addAll(instances: ProvidableInstance[]): InstanceContainer {
        const newMap = new Map(this.instances);
        instances.forEach(instance => {
            newMap.set(instance.key, instance);
        });
        return new InstanceContainer(newMap);
    }

    public merge(container: InstanceContainer): InstanceContainer {
        return new InstanceContainer(new Map([...this.instances, ...container.asMap()]));
    }

    public asMap(): Map<InstanceKey<any>, ProvidableInstance> {
        return this.instances;
    }
}