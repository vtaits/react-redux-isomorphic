import ExtendableError from 'es6-error';

// eslint-disable-next-line import/prefer-default-export
export class LoadContextError<IsomorphicError> extends ExtendableError {
  error: IsomorphicError;

  constructor(error: IsomorphicError) {
    super('Context load failed');

    this.error = error;
  }
}
