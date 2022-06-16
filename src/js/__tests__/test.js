import Validator from '../validator';

test('check class Validator', () => {
  const valid = new Validator('52.258525, 85.145222');
  const novalid = new Validator('125444/45jvkjvglj,bglkhnl;j;l');
  const expected = { latitude: '52.258525', longitude: '85.145222' };
  expect(valid.isvalid()).toEqual(expected);
  expect(() => novalid.isvalid()).toThrow();
});
