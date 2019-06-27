import ExtendableError from 'es6-error';

// eslint-disable-next-line import/prefer-default-export
export class LoadContextError extends ExtendableError {
  constructor(error) {
    super('Context load failed');

    this.error = error;
  }
}
