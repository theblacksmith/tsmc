module jack.server.messages {
  export class ExceptionMessage {
    message: string;
    exceptionMessage: string;
    exceptionType: string;
    stackTrace: string;
  }
}