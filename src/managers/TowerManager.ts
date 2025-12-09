import { Player, TowerType } from '../config/TowerConfig';
import { MAP_CONFIG } from '../config/MapConfig';

export interface TowerPosition {
  x: number;
  y: number;
  lane: number;
  type: TowerType;
  owner: Player;
}

export class TowerManager {
    public static getTowerPositions(
      width: number,
      laneConfig: { topMargin: number; laneHeight: number; laneGap: number }
    ): TowerPosition[] {
      const safeZoneWidth = width * MAP_CONFIG.SAFE_ZONE_WIDTH_PERCENT;
      const centerX = width / 2;
      const playableWidth = width - (safeZoneWidth * 2);
      const { topMargin, laneHeight, laneGap } = laneConfig;
  
      // Calculate lane center Y positions
      const laneY = (laneIndex: number) =>
        topMargin + laneIndex * (laneHeight + laneGap) + laneHeight / 2;
  
      // Safe zone edges
      const p1SafeZoneEdge = safeZoneWidth; // Right edge of P1 safe zone
      const p2SafeZoneEdge = width - safeZoneWidth; // Left edge of P2 safe zone
  
      // Boss: just before safe zone edge (using percentage of safe zone width)
      const bossOffset = safeZoneWidth * MAP_CONFIG.TOWER_POSITIONS.BOSS_OFFSET_FROM_SAFE_ZONE_PERCENT;
      const p1BossX = p1SafeZoneEdge + bossOffset; // Negative offset = before edge
      const p2BossX = p2SafeZoneEdge - bossOffset; // Negative offset = before edge
      
      // Lane towers: slightly ahead of boss (using percentage of safe zone width)
      const laneOffset = safeZoneWidth * MAP_CONFIG.TOWER_POSITIONS.LANE_OFFSET_FROM_BOSS_PERCENT;
      const p1LaneX = p1BossX + laneOffset;
      const p2LaneX = p2BossX - laneOffset;
      
      // Lead tower: closer to center line (percentage of playable width from center)
      const leadOffsetFromCenter = playableWidth * MAP_CONFIG.TOWER_POSITIONS.LEAD_DISTANCE_FROM_CENTER_PERCENT;
      const p1LeadX = centerX - leadOffsetFromCenter;
      const p2LeadX = centerX + leadOffsetFromCenter;
  
      return [
        // Player 1 towers
        { x: p1BossX, y: laneY(1), lane: 1, type: TowerType.BOSS, owner: Player.ONE },
        { x: p1LaneX, y: laneY(0), lane: 0, type: TowerType.LANE, owner: Player.ONE },
        { x: p1LeadX, y: laneY(1), lane: 1, type: TowerType.LEAD, owner: Player.ONE },
        { x: p1LaneX, y: laneY(2), lane: 2, type: TowerType.LANE, owner: Player.ONE },
  
        // Player 2 towers
        { x: p2BossX, y: laneY(1), lane: 1, type: TowerType.BOSS, owner: Player.TWO },
        { x: p2LaneX, y: laneY(0), lane: 0, type: TowerType.LANE, owner: Player.TWO },
        { x: p2LeadX, y: laneY(1), lane: 1, type: TowerType.LEAD, owner: Player.TWO },
        { x: p2LaneX, y: laneY(2), lane: 2, type: TowerType.LANE, owner: Player.TWO },
      ];
    }
  }