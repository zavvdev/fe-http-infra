interface ReportError<T = unknown> {
  message?: string;
  location?: string;
  error: T;
}

class ErrorReporterService {
  private readonly repository: Console;

  constructor(repo: Console) {
    this.repository = repo;
  }

  public report<T = unknown>(error: ReportError<T>): void {
    const errorToReport = {
      message: error.message || null,
      location: error.location || null,
      error: error.error,
    };
    
    this.repository.error(errorToReport);
  }
}

export const errorReporterService = new ErrorReporterService(console);
