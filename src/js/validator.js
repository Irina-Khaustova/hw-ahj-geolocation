export default class Validator {
  constructor(value) {
    this.value = value;
  }

  isvalid() {
    this.reg = /\[?(-?[0-9]+\.[0-9]+)\s?,\s?(-?[0-9]+\.[0-9]+)\]?/gm;
    const validCoords = this.reg.exec(this.value);
    if (!validCoords) {
      throw new Error('Неверный формат координат.');
    }
    const latitude = validCoords[1];
    const longitude = validCoords[2];
    return { latitude, longitude };
  }
}
