package frontend

import (
  // Kumori Service model (mandatory)
  k "kumori.systems/kumori/kmv"

  // CUE package includes conversion utilities
  "strconv"
)

// In Kumori Platform a microservice is represented by a set of executions
// ("instances" or "replicas") of a Kumori Component, all of them equally configured.
// 'ComponentManifest' describes the Kumori Component.
#Manifest : k.#ComponentManifest & {

  // Manifest reference. Manifest are "immutable", so if manifest changes, at least
  // its version must change.
  ref: {
    domain: "vera.kumori.cloud"
    name: "paas_frontend"
    version: [0,0,1]
  }

  description: {

    // Connectivity of a component: the set of channels it exposes.
    srv: {
      // Server channels: functionality provided by the component through an endpoint.
      server: {
        //Channel that allows to access the Fron-End
        entrypoint: { protocol: "http", port: 8080 }
      }
      // Client channels: dependency on some other component.
      client: {
        //Channel that allows to communicate with the Queue
        queueclient: { protocol: "tcp" }
      }
      // Duplex channels: channels code both a client and a server channel,
      // modeling endpoints used to initiate requests as well as serve them.
      // (useful in scenarios where a group of instances must carry out complex
      // coordination protocols (e.g., consensus), and each one of those instances
      // plays both a "client" and a "server" role.
      duplex: {}
    }

    // Component configuration (no configuration in this example).
    config: {
      // Configuration parameter data that a component can consume.
      parameter: {}
      // Dictionary of resources (persistent volumes, secrets) used by the component.
      resource: {}
    }

    // Amount of machine resources given to each running instance of the
    // component (vertical size).
    size: {
      $_memory: "100Mi"
      $_cpu: "100m"
      $_bandwidth: "10M"
    }

    // Component code: docker images and configuration mapping.
    // A component’s code may consist of more than one image, each of which
    // should be ran within its own container.
    code: {

      // Only one container, in this case.
      frontend: {
        name: "frontend"

        // Docker image
        image: {
          // Docker registry
          hub: {
            name: "registry.gitlab.com"
            // In this case a public image is used: credentials (secret) not required
            secret: ""
          }
          // Image name
          tag: "mmatagne/sad2122/frontend:0.0.7"
        }

        // Maps parts of the component configuration to content that can be
        // placed in files and environment variables so that code running can
        // access its configured parameters.
        mapping: {

          // Filesystem mappings are organizad as an array of mappings. Each
          // element of the array may map a file or, potentially, a tree of
          // folders and files.
          filesystem: []

          // The environment mapping is organized as a dictionary of environment
          // variables, whose values will be made available to the container on execution.
          env: {
            // The web server of component 'frontend' uses the TCP port specified
            // in HTTP_SERVER_PORT_ENV environment variable, so it is injected.
            // 'strconv' CUE package includes the FromtUint function, that returns
            // the string representation of i in the given base
          }
        }
      }

    }
  }
}
