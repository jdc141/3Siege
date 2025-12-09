export const MAP_CONFIG = {
  // Safe zone is a vertical strip on each player's far edge
  SAFE_ZONE_WIDTH_PERCENT: 0.06,
  // Lane configuration
  LANE_COUNT: 3,
  LANE_HEIGHT_PERCENT: 0.22, // Each lane takes ~22% of map height
  LANE_GAP_PERCENT: 0.04, // Gap between lanes
  LANE_TOP_MARGIN_PERCENT: 0.08, // Top margin before first lane
  // HUD at bottom
  HUD_HEIGHT: 140,
  // Center line
  CENTER_LINE_WIDTH: 2,
  // Colors
  COLORS: {
    BACKGROUND: 0x1a1a2e,
    SAFE_ZONE_P1: 0x1a4a8a,
    SAFE_ZONE_P2: 0x8a1a1a,
    LANE_BORDER: 0x4a4a6a,
    LANE_FILL: 0x2a2a4a,
    CENTER_LINE: 0xffffff,
    HUD_BG: 0x0d0d1a,
    HUD_BORDER: 0x3a3a5a,
  },

  TOWER_POSITIONS: {
      // Boss tower: percentage offset from safe zone edge (negative = before, positive = after)
      // e.g., -0.3 means 30% of safe zone width BEFORE the edge
      BOSS_OFFSET_FROM_SAFE_ZONE_PERCENT: .7,  // Just before safe zone edge
      
      // Lane towers: percentage offset from boss position
      LANE_OFFSET_FROM_BOSS_PERCENT: 0.8, // 80% of safe zone width ahead of boss
      
      // Lead tower: percentage of playable width from center toward safe zone
      LEAD_DISTANCE_FROM_CENTER_PERCENT: 0.15, // 15% of playable width from center
  },
} as const;


