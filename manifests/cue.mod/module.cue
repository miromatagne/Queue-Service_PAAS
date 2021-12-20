// Name of the CUE module defined in this workspace
// The workspace includes three packages:
// - Manifest definition of the Kumori Component "frontend"
// - Manifest definition of the Kumori Service Application "helloworld"
// - Manifest definition to deploy the Kumori Service Application "helloworld"
module: "vera.kumori.cloud/sm/paas"

// TODO: kumori service model should be opensource, whith no credentials
creds = {
  kumori: {
    type: "token",
    username: "cuacua",
    token: "xB17FTzNCsgko3533Mnf"
  }
}

dependencies: {
  // Kumori service model
  "kumori.systems/kumori": {
    repository: "https://gitlab.com/kumori/cuemodules/kumori"
    credentials: creds.kumori
    tag: "2.0.4"
  }
}
