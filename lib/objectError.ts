export class BaseObjectError {
  public response: any;

  constructor(code: string, message: string) {
    this.response = {
      data: {
        message,
        exceptionMessage: code,
      },
    };
  }

  toString() {
    return this.response?.data?.message;
  }
}
