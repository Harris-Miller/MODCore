

/**
 *
 *
 *
 */
const container = {
  registries: {
    controllers: Object.create(null),
    templates: Object.create(null)
  },

  createRegistry(registry) {
    this.registries[registry] = Object.create(null);
  },

  register(registryName, className, obj) {
    if (!(registryName in this.registries)) {
      this.createRegistry(registryName);
    }

    let registry = this.registries[registryName];

    if (className in registry) {
      // TODO: keep this error? or fail silently
      throw new Error(`a class under name ${className} has already been registered under the ${registryName} registry`);
    }

    registry[className] = obj;
  },

  lookup(registryName, className) {
    if (!(registryName in this.registries)) {
      throw new Error(`A ${registryName} registry does not exist!`);
    }

    let registry = this.registries[registryName];

    if (!(className in registry)) {
     throw new Error(`a class under name ${className} does not exist in the ${registryName} registry`) ;
    }

    return registry[className];
  },
}

export default container;
