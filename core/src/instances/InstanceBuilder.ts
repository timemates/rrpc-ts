// InstancesBuilder class for building instances
import {ProvidableInstance} from "./ProvidableInstance";

export class InstancesBuilder {
    private instances: Set<ProvidableInstance> = new Set();

    // Register an instance
    public register(instance: ProvidableInstance): InstancesBuilder {
        this.instances.delete(instance);  // Remove if already exists
        this.instances.add(instance);     // Add the new instance
        return this;
    }

    // Build method that returns a list of ProvidableInstance
    public build(): ProvidableInstance[] {
        return Array.from(this.instances);
    }
}
