import Phaser from 'phaser';
import './style.css';
import { GameScene } from './scenes/GameScene';
import {
  hideUnsupportedOverlay,
  isDesktopSupported,
  showUnsupportedOverlay,
} from './config/ClientSupport';

let game: Phaser.Game | null = null;

const startGame = (): void => {
  if (game) return;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#2d5a27',
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  game = new Phaser.Game(config);
};

const stopGame = (): void => {
  if (game) {
    game.destroy(true);
    game = null;
  }
};

const updateSupportState = (): void => {
  if (isDesktopSupported()) {
    hideUnsupportedOverlay();
    startGame();
  } else {
    stopGame();
    showUnsupportedOverlay();
  }
};

const debounce = <T extends (...args: never[]) => void>(fn: T, delay = 200): T => {
  let timer: number | undefined;
  return ((...args: never[]) => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => fn(...args), delay);
  }) as T;
};

const handleResize = debounce(updateSupportState);

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

updateSupportState();

