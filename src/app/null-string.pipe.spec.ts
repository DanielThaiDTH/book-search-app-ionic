import { NullStringPipe } from './null-string.pipe';

describe('NullStringPipe', () => {
  it('create an instance', () => {
    const pipe = new NullStringPipe();
    expect(pipe).toBeTruthy();
  });
});
