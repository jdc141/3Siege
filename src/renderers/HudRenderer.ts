import Phaser from 'phaser';
import { MAP_CONFIG } from '../config/MapConfig';

export class HudRenderer {
  private graphics: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];

  constructor(private scene: Phaser.Scene) {
    this.graphics = this.scene.add.graphics();
  }

  public draw(width: number, totalHeight: number): void {
    this.graphics.clear();
    this.clearLabels();

    const hudY = totalHeight - MAP_CONFIG.HUD_HEIGHT;
    const hudHeight = MAP_CONFIG.HUD_HEIGHT;

    // HUD background
    this.graphics.fillStyle(MAP_CONFIG.COLORS.HUD_BG, 0.95);
    this.graphics.fillRect(0, hudY, width, hudHeight);

    // HUD top border
    this.graphics.lineStyle(2, MAP_CONFIG.COLORS.HUD_BORDER, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(0, hudY);
    this.graphics.lineTo(width, hudY);
    this.graphics.strokePath();

    // Draw card slots + resource meter + score
    this.drawCardSlots(width, hudY);
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

  private drawCardSlots(width: number, hudY: number): void {
    const padding = 15;
    const cardGap = 10;
    const cardY = hudY + padding;
    const cardHeight = MAP_CONFIG.HUD_HEIGHT - padding * 2;
    const cardWidth = 80;

    // Next Card Up (left side) - slightly smaller
    const nextCardWidth = 65;
    const nextCardX = padding;
    this.drawCardSlot(nextCardX, cardY, nextCardWidth, cardHeight, 'Next\nCard Up');

    // Main cards (4 cards)
    const cardsStartX = nextCardX + nextCardWidth + cardGap;
    for (let i = 0; i < 4; i++) {
      const x = cardsStartX + i * (cardWidth + cardGap);
      this.drawCardSlot(x, cardY, cardWidth, cardHeight, `Card ${i + 1}`);
    }

    // Special Ability (after cards)
    const specialX = cardsStartX + 4 * (cardWidth + cardGap) + cardGap;
    this.drawCardSlot(specialX, cardY, cardWidth, cardHeight, 'Special\nAbility');

    // Score Board Area (right side) - bigger
    const scoreBoardWidth = 180;
    const scoreBoardX = width - scoreBoardWidth - padding;
    this.drawCardSlot(scoreBoardX, cardY, scoreBoardWidth, cardHeight, 'Score Board Area');

    // Resource Meter (between special ability and score board)
    const meterX = specialX + cardWidth + cardGap * 2;
    const meterWidth = scoreBoardX - meterX - cardGap * 2;
    const meterHeight = cardHeight;
    const meterY = cardY;

    this.drawResourceMeter(meterX, meterY, meterWidth, meterHeight);
  }

  private drawResourceMeter(x: number, y: number, width: number, height: number): void {
    const sections = 10;
    const sectionGap = 3;
    const sectionPadding = 8;
    const sectionWidth = (width - sectionPadding * 2 - sectionGap * (sections - 1)) / sections;
    const sectionHeight = height - sectionPadding * 2;

    // Outer border
    this.graphics.lineStyle(2, MAP_CONFIG.COLORS.HUD_BORDER, 0.8);
    this.graphics.strokeRoundedRect(x, y, width, height, 8);
    this.graphics.fillStyle(0x1a1a2a, 0.7);
    this.graphics.fillRoundedRect(x, y, width, height, 8);

    // Draw 10 sections
    for (let i = 0; i < sections; i++) {
      const sectionX = x + sectionPadding + i * (sectionWidth + sectionGap);
      const sectionY = y + sectionPadding;

      // Empty section background
      this.graphics.fillStyle(0x2a2a4a, 0.6);
      this.graphics.fillRoundedRect(sectionX, sectionY, sectionWidth, sectionHeight, 4);

      // Section border
      this.graphics.lineStyle(1, 0x4a4a6a, 0.5);
      this.graphics.strokeRoundedRect(sectionX, sectionY, sectionWidth, sectionHeight, 4);
    }

    // Label with current value
    this.addLabel(x + width / 2, y - 8, '0 / 10', {
      fontSize: '12px',
      color: '#8888aa',
      fontStyle: 'bold',
    });
  }

  private drawCardSlot(x: number, y: number, width: number, height: number, label: string): void {
    // Card background
    this.graphics.fillStyle(0x2a2a4a, 0.5);
    this.graphics.fillRoundedRect(x, y, width, height, 8);

    // Card border
    this.graphics.lineStyle(2, MAP_CONFIG.COLORS.HUD_BORDER, 0.8);
    this.graphics.strokeRoundedRect(x, y, width, height, 8);

    // Card label
    this.addLabel(x + width / 2, y + height / 2, label, {
      fontSize: '11px',
      color: '#666688',
      align: 'center',
    });
  }
}


