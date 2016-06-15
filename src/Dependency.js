export default class Dependency {
  constructor ({ name, version, type }) {
    this.name = name
    this.version = version
    this.type = type
  }

  updateTo (version) {
    this.next = version
  }

}
