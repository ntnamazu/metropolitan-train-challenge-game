import { describe, it, expect } from 'vitest';
import { NetworkError } from '../../../../src/types/common';

describe('NetworkError', () => {
  it('メッセージとstatusCodeを受け取って生成される', () => {
    const error = new NetworkError('HTTPエラー: 404 Not Found', 404);

    expect(error.message).toBe('HTTPエラー: 404 Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NetworkError');
    expect(error).toBeInstanceOf(Error);
  });

  it('statusCodeなしでも生成される', () => {
    const error = new NetworkError('ネットワークエラーが発生しました');

    expect(error.message).toBe('ネットワークエラーが発生しました');
    expect(error.statusCode).toBeUndefined();
    expect(error.name).toBe('NetworkError');
  });

  it('causeを受け取れる', () => {
    const cause = new Error('原因エラー');
    const error = new NetworkError('ラップエラー', undefined, cause);

    expect(error.cause).toBe(cause);
  });

  it('Errorのインスタンスである', () => {
    const error = new NetworkError('テスト');

    expect(error).toBeInstanceOf(Error);
  });
});
