import ExtendableError from 'es6-error';

export class LoadListError<ErrorType, Additional> extends ExtendableError {
  error: ErrorType;
  additional: Additional;

  constructor({
    error,
    additional,
  }: {
    error?: ErrorType,
    additional?: Additional,
  }) {
    super('List loading failed');

    this.error = error;
    this.additional = additional;
  }
}
