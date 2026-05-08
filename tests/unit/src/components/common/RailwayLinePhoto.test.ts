import { describe, it, expect } from 'vitest';
import { buildAttributionText } from '../../../../../src/components/common/RailwayLinePhoto';
import type { RailwayPhoto } from '../../../../../src/types';

describe('buildAttributionText', () => {
  it('CC BY-SA ライセンス + バージョンありの帰属表示を生成する', () => {
    const photo: RailwayPhoto = {
      imageUrl: 'https://example.com/photo.jpg',
      photographer: '山田太郎',
      license: 'CC BY-SA',
      licenseVersion: '4.0',
      commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:photo.jpg',
    };

    const result = buildAttributionText(photo);

    expect(result).toBe('📷 山田太郎 / Wikimedia Commons / CC BY-SA 4.0');
  });

  it('CC BY ライセンス + バージョンありの帰属表示を生成する', () => {
    const photo: RailwayPhoto = {
      imageUrl: 'https://example.com/photo.jpg',
      photographer: 'John Doe',
      license: 'CC BY',
      licenseVersion: '3.0',
      commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:photo.jpg',
    };

    const result = buildAttributionText(photo);

    expect(result).toBe('📷 John Doe / Wikimedia Commons / CC BY 3.0');
  });

  it('CC0 ライセンス (バージョンなし) でも帰属表示を生成する', () => {
    const photo: RailwayPhoto = {
      imageUrl: 'https://example.com/photo.jpg',
      photographer: '佐藤花子',
      license: 'CC0',
      commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:photo.jpg',
    };

    const result = buildAttributionText(photo);

    expect(result).toBe('📷 佐藤花子 / Wikimedia Commons / CC0');
  });

  it('licenseVersion が undefined のとき、バージョンなしで帰属表示を生成する', () => {
    const photo: RailwayPhoto = {
      imageUrl: 'https://example.com/photo.jpg',
      photographer: 'Photographer',
      license: 'CC BY-SA',
      licenseVersion: undefined,
      commonsPageUrl: 'https://commons.wikimedia.org/wiki/File:photo.jpg',
    };

    const result = buildAttributionText(photo);

    expect(result).toBe('📷 Photographer / Wikimedia Commons / CC BY-SA');
  });
});
