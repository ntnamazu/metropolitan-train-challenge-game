/**
 * VehicleCardRepositoryのユニットテスト
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VehicleCardRepository } from '../../../../src/repositories/VehicleCardRepository';
import { NotFoundError } from '../../../../src/types';

const sampleCards = [
  {
    id: 'vehicle-e233-sobu',
    name: 'E233系 0番台',
    description: 'テスト用',
    rarity: 'common' as const,
    lineId: 'line-sobu',
  },
  {
    id: 'vehicle-e235-yamanote',
    name: 'E235系',
    description: 'テスト用',
    rarity: 'rare' as const,
    lineId: 'line-yamanote',
  },
];

describe('VehicleCardRepository', () => {
  let repository: VehicleCardRepository;

  beforeEach(() => {
    repository = new VehicleCardRepository();
    vi.restoreAllMocks();
  });

  describe('loadVehicleCards', () => {
    it('車両カードリストを取得できる', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => sampleCards,
        })
      );

      const cards = await repository.loadVehicleCards();

      expect(cards).toHaveLength(2);
      expect(cards[0].id).toBe('vehicle-e233-sobu');
    });

    it('2回目の呼び出しはキャッシュから返す', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleCards,
      });
      vi.stubGlobal('fetch', fetchMock);

      await repository.loadVehicleCards();
      await repository.loadVehicleCards();

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('fetch が 404 を返す場合は NotFoundError をスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        })
      );

      await expect(repository.loadVehicleCards()).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('getVehicleCardById', () => {
    beforeEach(async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => sampleCards,
        })
      );
    });

    it('存在するIDのカードを返す', async () => {
      const card = await repository.getVehicleCardById('vehicle-e233-sobu');

      expect(card).toBeDefined();
      expect(card?.name).toBe('E233系 0番台');
    });

    it('存在しないIDの場合は undefined を返す', async () => {
      const card = await repository.getVehicleCardById('vehicle-unknown');

      expect(card).toBeUndefined();
    });
  });
});
