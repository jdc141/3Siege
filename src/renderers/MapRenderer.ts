import Phaser from 'phaser';
import { MAP_CONFIG } from '../config/MapConfig';

export class MapRenderer {
  private graphics: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];

  constructor(private scene: Phaser.Scene) {
    this.graphics = this.scene.add.graphics();
  }

  public draw(width: number, mapHeight: number): void {
    this.graphics.clear();
    this.clearLabels();

    // Draw background for map area
    this.graphics.fillStyle(MAP_CONFIG.COLORS.BACKGROUND, 1);
    this.graphics.fillRect(0, 0, width, mapHeight);

    // Safe zones
    this.drawSafeZones(width, mapHeight);

    // Lanes
    this.drawLanes(width, mapHeight);

    // Center line
    this.drawCenterLine(width, mapHeight);

    // Debug labels (tower positions, safe zones)
    this.addDebugLabels(width, mapHeight);
  }

  public destroy(): void {
    this.graphics.destroy();
    this.clearLabels();
  }

  private clearLabels(): void {
    this.labels.forEach(label => label.destroy());
    this.labels = [];
  }

  private addLabel(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ): Phaser.GameObjects.Text {
    const label = this.scene.add.text(x, y, text, style).setOrigin(0.5);
    this.labels.push(label);
    return label;
  }

  private drawSafeZones(width: number, mapHeight: number): void {
    const safeZoneWidth = width * MAP_CONFIG.SAFE_ZONE_WIDTH_PERCENT;

    // Player 1 safe zone (left side)
    this.graphics.fillStyle(MAP_CONFIG.COLORS.SAFE_ZONE_P1, 0.3);
    this.graphics.fillRect(0, 0, safeZoneWidth, mapHeight);
    this.graphics.lineStyle(2, MAP_CONFIG.COLORS.SAFE_ZONE_P1, 0.6);
    this.graphics.strokeRect(0, 0, safeZoneWidth, mapHeight);

    // Player 2 safe zone (right side)
    this.graphics.fillStyle(MAP_CONFIG.COLORS.SAFE_ZONE_P2, 0.3);
    this.graphics.fillRect(width - safeZoneWidth, 0, safeZoneWidth, mapHeight);
    this.graphics.lineStyle(2, MAP_CONFIG.COLORS.SAFE_ZONE_P2, 0.6);
    this.graphics.strokeRect(width - safeZoneWidth, 0, safeZoneWidth, mapHeight);
  }

  private drawLanes(width: number, mapHeight: number): void {
    const safeZoneWidth = width * MAP_CONFIG.SAFE_ZONE_WIDTH_PERCENT;
    const laneHeight = mapHeight * MAP_CONFIG.LANE_HEIGHT_PERCENT;
    const laneGap = mapHeight * MAP_CONFIG.LANE_GAP_PERCENT;
    const topMargin = mapHeight * MAP_CONFIG.LANE_TOP_MARGIN_PERCENT;

    // Lane area starts after safe zone and ends before opposite safe zone
    const laneStartX = safeZoneWidth;
    const laneWidth = width - safeZoneWidth * 2;

    for (let i = 0; i < MAP_CONFIG.LANE_COUNT; i++) {
      const laneY = topMargin + i * (laneHeight + laneGap);

      // Subtle lane fill
      this.graphics.fillStyle(MAP_CONFIG.COLORS.LANE_FILL, 0.15);
      this.graphics.fillRect(laneStartX, laneY, laneWidth, laneHeight);

      // Dotted lane border
      this.drawDottedRect(laneStartX, laneY, laneWidth, laneHeight);
    }
  }

  private drawDottedRect(x: number, y: number, width: number, height: number): void {
    const dashLength = 8;
    const gapLength = 6;

    this.graphics.lineStyle(1, MAP_CONFIG.COLORS.LANE_BORDER, 0.5);

    // Top edge
    this.drawDottedLine(x, y, x + width, y, dashLength, gapLength);
    // Bottom edge
    this.drawDottedLine(x, y + height, x + width, y + height, dashLength, gapLength);
    // Left edge
    this.drawDottedLine(x, y, x, y + height, dashLength, gapLength);
    // Right edge
    this.drawDottedLine(x + width, y, x + width, y + height, dashLength, gapLength);
  }

  private drawDottedLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLength: number,
    gapLength: number
  ): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;

    let currentPos = 0;
    let drawing = true;

    while (currentPos < distance) {
      const segmentLength = drawing ? dashLength : gapLength;
      const endPos = Math.min(currentPos + segmentLength, distance);

      if (drawing) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1 + unitX * currentPos, y1 + unitY * currentPos);
        this.graphics.lineTo(x1 + unitX * endPos, y1 + unitY * endPos);
        this.graphics.strokePath();
      }

      currentPos = endPos;
      drawing = !drawing;
    }
  }

  private drawCenterLine(width: number, mapHeight: number): void {
    const centerX = width / 2;

    // Dashed center line
    this.graphics.lineStyle(MAP_CONFIG.CENTER_LINE_WIDTH, MAP_CONFIG.COLORS.CENTER_LINE, 0.3);

    const dashLength = 15;
    const gapLength = 10;
    let y = 0;

    while (y < mapHeight) {
      this.graphics.beginPath();
      this.graphics.moveTo(centerX, y);
      this.graphics.lineTo(centerX, Math.min(y + dashLength, mapHeight));
      this.graphics.strokePath();
      y += dashLength + gapLength;
    }
  }

  private addDebugLabels(width: number, mapHeight: number): void {
    const safeZoneWidth = width * MAP_CONFIG.SAFE_ZONE_WIDTH_PERCENT;
    const laneHeight = mapHeight * MAP_CONFIG.LANE_HEIGHT_PERCENT;
    const laneGap = mapHeight * MAP_CONFIG.LANE_GAP_PERCENT;
    const topMargin = mapHeight * MAP_CONFIG.LANE_TOP_MARGIN_PERCENT;

    // Safe zone labels
    this.addLabel(safeZoneWidth / 2, mapHeight / 2, 'Safe Zone', {
      fontSize: '11px',
      color: '#6a9aff',
      align: 'center',
    }).setAngle(-90);

    this.addLabel(width - safeZoneWidth / 2, mapHeight / 2, 'Safe Zone', {
      fontSize: '11px',
      color: '#ff6a6a',
      align: 'center',
    }).setAngle(90);

    // Lane labels
    const laneNames = ['Lane\nTower', 'Lead\nTower', 'Lane\nTower'];
    for (let i = 0; i < MAP_CONFIG.LANE_COUNT; i++) {
      const laneY = topMargin + i * (laneHeight + laneGap) + laneHeight / 2;

      // P1 tower position label
      this.addLabel(safeZoneWidth + 80, laneY, laneNames[i], {
        fontSize: '11px',
        color: '#888888',
        align: 'center',
      });

      // P2 tower position label
      this.addLabel(width - safeZoneWidth - 80, laneY, laneNames[i], {
        fontSize: '11px',
        color: '#888888',
        align: 'center',
      });
    }

    // Boss tower labels (in safe zones, middle lane)
    const middleLaneY = topMargin + 1 * (laneHeight + laneGap) + laneHeight / 2;

    this.addLabel(safeZoneWidth / 2, middleLaneY - 40, 'Boss\nTower', {
      fontSize: '10px',
      color: '#4a7acc',
      align: 'center',
    });

    this.addLabel(width - safeZoneWidth / 2, middleLaneY - 40, 'Boss\nTower', {
      fontSize: '10px',
      color: '#cc4a4a',
      align: 'center',
    });
  }
}


