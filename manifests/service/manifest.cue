package paas

import (
  // Kumori Service Model (mandatory)
  k "kumori.systems/kumori/kmv"

  // Kumori Component used in this Kumori Service Application
  // "kumori.systems/examples/helloworld is the name of the CUE module (defined
  // in cue.mod/module.cue file), "components/frontend" is its directory path and
  // "frontend" is the name of the CUE package.
  // Note: When the package name and directory are the same, the package name
  // can be omitted.
  // f "kumori.systems/examples/helloworld/components/frontend:frontend"
  f "vera.kumori.cloud/saulmiro/paas/components/frontend"
)

// In Kumori Platform, a Service Application represents a set of interconnected
// Kumori Components working together.
// 'ServiceManifest' describes the Kumori Service Application.
#Manifest: k.#ServiceManifest & {

  // Manifest reference. Manifest are "immutable", so if manifest changes, at least
  // its version must change.
  ref: {
    domain: "vera.kumori.cloud"
    name: "paas"
    version: [0,0,1]
  }

  description: {

    //
    // Kumori Component roles and configuration
    //

    // Configuration (parameters and resources) to be provided to the Kumori
    // Service Application.
    // (no configuration in this example)
    config: {
      parameter: {}
      resource: {}
    }

    // List of Kumori Components of the Kumori Service Application.
    // In a service, the same component could be run playing multiple roles, with
    // different purposes, each of them with its own configuration.
    // In this case there is only one role ("frontend") for only one component
    // described in the imported component manifest.
    role: {
      frontend: k.#Role
      frontend: artifact: f.#Manifest
    }

    // Configuration spread: computing each role configuration based on service
    // configuration (no configuration in this example).
    role: {
      frontend: {
        cfg: {
          parameter: {}
          resource: {}
        }
      }
    }

    //
    // Kumori Service topology: how roles are interconnected
    //

    // Connectivity of a service application: the set of channels it exposes.
    srv: {
      // Server channels: functionality provided by the service through an endpoint.
      server: {
        paas: { protocol: "http", port: 80 }
      }
    }

    // Connectors, providing specific patterns of communication among channels.
    connector: {
      inbound: { kind: "lb" }
    }

    // Links specify the topology graph.
    // In this case, there is only one load-balancer connector connecting the
    // service channel and the role channel
    link: {

      // Outside -> FrontEnd (LB connector)
			self: paas: to: "inbound"
      inbound: to: frontend: "restapi"

    }
  }
}

