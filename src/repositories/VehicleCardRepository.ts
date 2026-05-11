/**
 * 車両カードリポジトリ
 */

import type { VehicleCard } from '../types';
import { NotFoundError } from '../types';

export class VehicleCardRepository {
  private vehicleCards: VehicleCard[] | null = null;

  async loadVehicleCards(): Promise<VehicleCard[]> {
    if (this.vehicleCards !== null) {
      return this.vehicleCards;
    }

    try {
      const response = await fetch('/data/vehicles.json');
      if (!response.ok) {
        throw new NotFoundError('VehicleCards', 'vehicles');
      }
      this.vehicleCards = (await response.json()) as VehicleCard[];
      return this.vehicleCards;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new NotFoundError('VehicleCards', 'unknown');
    }
  }

  async getVehicleCardById(id: string): Promise<VehicleCard | undefined> {
    const cards = await this.loadVehicleCards();
    return cards.find((c) => c.id === id);
  }
}
