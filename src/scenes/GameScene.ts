import Phaser from 'phaser';
import { MAP_CONFIG } from '../config/MapConfig';
import { MapRenderer } from '../renderers/MapRenderer';
import { HudRenderer } from '../renderers/HudRenderer';
import { Tower } from '../entities/Tower';
import { TowerManager } from '../managers/TowerManager';

export class GameScene extends Phaser.Scene {
  private mapRenderer!: MapRenderer;
  private hudRenderer!: HudRenderer;
  private towers: Tower[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.mapRenderer = new MapRenderer(this);
    this.hudRenderer = new HudRenderer(this);

    this.drawAll();
    this.createTowers();

    // Handle window resize
    this.scale.on('resize', this.handleResize, this);
  }

  private handleResize(): void {
    this.drawAll();
    this.resetTowers();
  }

  private drawAll(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const mapHeight = height - MAP_CONFIG.HUD_HEIGHT;

    this.mapRenderer.draw(width, mapHeight);
    this.hudRenderer.draw(width, height);
  }

  private createTowers(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const mapHeight = height - MAP_CONFIG.HUD_HEIGHT;

    const laneConfig = {
      topMargin: mapHeight * MAP_CONFIG.LANE_TOP_MARGIN_PERCENT,
      laneHeight: mapHeight * MAP_CONFIG.LANE_HEIGHT_PERCENT,
      laneGap: mapHeight * MAP_CONFIG.LANE_GAP_PERCENT,
    };

    const positions = TowerManager.getTowerPositions(width, laneConfig);

    this.towers = positions.map(
      pos => new Tower(this, pos.x, pos.y, pos.lane, pos.type, pos.owner)
    );
  }

  private resetTowers(): void {
    this.towers.forEach(t => t.dispose());
    this.towers = [];
    this.createTowers();
  }
}
