export enum TowerType {
    BOSS = 'boss',
    LEAD = 'lead',
    LANE = 'lane',
}

export enum Player {
    ONE = 1,
    TWO = 2,
}

export interface TowerStats {
    type: TowerType;
    health: number;
    damage: number;
    range: number;       // Attack range in pixels
    attackSpeed: number; // Attacks per second
    flagPoints: number;  // Points when captured (0 = instant win)
    size: number;        // visual size in pixels
}

export const TOWER_STATS: Record<TowerType, TowerStats> = {
    [TowerType.BOSS]: {
        type: TowerType.BOSS,
        health: 2000,
        damage: 80,
        range: 200,
        attackSpeed: 1.0,
        flagPoints: 0, // Instant win
        size: 45,
      },
      [TowerType.LEAD]: {
        type: TowerType.LEAD,
        health: 1500,
        damage: 50,
        range: 150,
        attackSpeed: 1.2,
        flagPoints: 2,
        size: 38,
      },
      [TowerType.LANE]: {
        type: TowerType.LANE,
        health: 1000,
        damage: 40,
        range: 130,
        attackSpeed: 1.5,
        flagPoints: 1,
        size: 32,
      },
};
