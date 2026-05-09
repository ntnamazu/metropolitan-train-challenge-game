/**
 * 共通型定義
 */

/**
 * 難易度レベル
 * 1: ビギナー
 * 2: 中級者
 * 3: 上級者
 * 4: マニア
 */
export type DifficultyLevel = 1 | 2 | 3 | 4;

/**
 * リソースが見つからないエラー
 */
export class NotFoundError extends Error {
  constructor(
    public resource: string,
    public id: string
  ) {
    super(`${resource} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}

/**
 * ストレージエラー
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * ネットワークエラー
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}
