import Phaser from 'phaser';
import { Player, TowerType, TowerStats, TOWER_STATS } from '../config/TowerConfig';

export class Tower {
  private scene: Phaser.Scene;

  // Tower props
  public readonly type: TowerType;
  public readonly owner: Player;
  public readonly stats: TowerStats;

  // Positioning on map
  public x: number;
  public y: number;
  public lane: number;

  // State
  private currentHealth: number;
  private maxHealth: number;
  private isDestroyed = false;

  // game objects
  private graphics: Phaser.GameObjects.Graphics;
  private healthBarBackground: Phaser.GameObjects.Graphics;
  private healthBarFill: Phaser.GameObjects.Graphics;
  private sprite: Phaser.GameObjects.Text; // placeholder for tower emoji

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    lane: number,
    type: TowerType,
    owner: Player
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.lane = lane;
    this.type = type;
    this.owner = owner;
    this.stats = TOWER_STATS[type];
    this.currentHealth = this.stats.health;
    this.maxHealth = this.stats.health;
    this.graphics = this.scene.add.graphics();
    this.healthBarBackground = this.scene.add.graphics();
    this.healthBarFill = this.scene.add.graphics();
    this.sprite = this.scene.add.text(0, 0, '', { fontSize: '24px', fontStyle: 'bold' }).setOrigin(0.5);

    this.draw();
    this.updateHealthBar();
    this.graphics.setInteractive(
        new Phaser.Geom.Circle(this.x, this.y, this.stats.size),
        Phaser.Geom.Circle.Contains
      );
      
      this.graphics.on('pointerdown', () => {
        this.takeDamage(100);
        console.log(`Tower hit! Health: ${this.currentHealth}/${this.maxHealth}`);
      });
  }

  public takeDamage(amount: number): void {
    if (this.isDestroyed) return;

    this.currentHealth = Math.max(0, this.currentHealth - amount);
    this.updateHealthBar();

    if (this.currentHealth <= 0) {
      this.destroy();
    }
  }

  public getHealthPercent(): number {
    return this.currentHealth / this.maxHealth;
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.onDestroyed();
  }

  public dispose(): void {
    this.graphics.destroy();
    this.healthBarBackground.destroy();
    this.healthBarFill.destroy();
    this.sprite.destroy();
  }

  private onDestroyed(): void {
    this.scene.events.emit('tower-destroyed', {
      tower: this,
      x: this.x,
      y: this.y,
      owner: this.owner,
      type: this.type,
    });

    // TODO: Add animation for destroyed tower
    this.graphics.setAlpha(0.3);
    this.sprite.setAlpha(0.3);
  }

  private draw(): void {
    const color = this.owner === Player.ONE ? 0x4a9aff : 0xff4a4a;

    // Draw circle body
    this.graphics.clear();
    this.graphics.fillStyle(color, 1);
    this.graphics.fillCircle(this.x, this.y, this.stats.size);

    // Draw border
    this.graphics.lineStyle(3, 0xffffff, 0.8);
    this.graphics.strokeCircle(this.x, this.y, this.stats.size);

    // Tower emoji (🏰 for boss, 🗼 for others)
    const emoji = this.type === TowerType.BOSS ? '🏰' : '🗼';
    this.sprite.setText(emoji);
    this.sprite.setPosition(this.x, this.y);
  }

  private updateHealthBar(): void {
    const barWidth = this.stats.size * 2;
    const barHeight = 8;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.stats.size - 15;

    // Background (dark)
    this.healthBarBackground.clear();
    this.healthBarBackground.fillStyle(0x000000, 0.7);
    this.healthBarBackground.fillRoundedRect(barX, barY, barWidth, barHeight, 2);

    // Fill (green -> yellow -> red based on health)
    const percent = this.currentHealth / this.maxHealth;
    const fillWidth = barWidth * percent;
    const fillColor = percent > 0.5 ? 0x44ff44 : percent > 0.25 ? 0xffff44 : 0xff4444;

    this.healthBarFill.clear();
    this.healthBarFill.fillStyle(fillColor, 1);
    this.healthBarFill.fillRoundedRect(barX, barY, fillWidth, barHeight, 2);
  }
}

