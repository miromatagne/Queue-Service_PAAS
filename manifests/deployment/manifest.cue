package paas_deployment

import (
  // Kumori Service model (mandatory)
  k "kumori.systems/kumori/kmv"

  // Kumori Service Appication to be deployed.
  // "vera.kumori.cloud/sm/paas is the name of the CUE module (defined
  // in cue.mod/module.cue file), "service" is its directory path, and "paas"
  // is the name of the CUE package.
  // Note: When the package name and directory are the same, the package name
  // can be omitted.
  s "vera.kumori.cloud/sm/paas/service:paas"
)

// A Kumori Service Application is deployed as a service within a Kumori Platform.
// 'DeploymentManifest' describes the configuration to be used.
#Manifest: k.#DeploymentManifest & {

  // Manifest reference. Manifest are "immutable", so if manifest changes, at least
  // its version must change.
  ref: {
    domain: "vera.kumori.cloud"
    name: "smpaas_cfg"
    version: [0,0,1]
  }

  description: {


    // Imported service aplication manifest to be deployed
    service: s.#Manifest

    // Configuration to be injected (no configuration in this example)
    // All configuration parameters of the service application must be set to
    // concrete values.
    configuration: {
      parameter: {}
      resource: {}
    }

    // Horizontal size: in this case, just the initial number of instances of
    // each role
    hsize: {
      frontend: {
        $_instances: 1
      }
      queue: {
        $_instances: 1
      }
      worker: {
        $_instances: 1
      }
    }

  }
}

// Exposed to be used by kumorictl tool (mandatory)
deployment: (k.#DoDeploy & {_params:manifest: #Manifest}).deployment
