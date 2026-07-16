'use client';

import type Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import '../app/phaser-town.css';
import { AvatarConfig } from '../data/avatar';

type DestinationId = 'boba' | 'dimsum' | 'market' | 'park';

interface Destination {
  id: DestinationId;
  title: string;
  chinese: string;
  x: number;
  y: number;
}

interface PhaserTownProps {
  avatar: AvatarConfig;
  onEnter: (destination: DestinationId) => void;
}

const WORLD_WIDTH = 1672;
const WORLD_HEIGHT = 941;

const DESTINATIONS: Destination[] = [
  { id: 'boba', title: 'Tiệm trà sữa', chinese: '奶茶', x: 485, y: 320 },
  { id: 'park', title: 'Công viên', chinese: '公园', x: 1220, y: 320 },
  { id: 'dimsum', title: 'Nhà hàng Dim Sum', chinese: '点心', x: 485, y: 760 },
  { id: 'market', title: 'Siêu thị HSK', chinese: '超市', x: 1205, y: 770 },
];

const OUTFIT_COLORS: Record<AvatarConfig['outfit'], number> = {
  apron: 0xef5350,
  casual: 0x2563eb,
  hanfu: 0xdb2777,
  varsity: 0x15803d,
  overalls: 0xca8a04,
};

function colorToNumber(color: string) {
  return Number.parseInt(color.replace('#', ''), 16);
}

export default function PhaserTown({ avatar, onEnter }: PhaserTownProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const onEnterRef = useRef(onEnter);
  const [nearby, setNearby] = useState<Destination | null>(null);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    void import('phaser').then(({ default: PhaserRuntime }) => {
      if (cancelled || !mountRef.current) return;
      const parent = mountRef.current;

      class TownScene extends PhaserRuntime.Scene {
        private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private wasd!: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
        private actionKeys!: Phaser.Input.Keyboard.Key[];
        private lastNearby: DestinationId | null = null;
        private joystickVector = new PhaserRuntime.Math.Vector2();
        private joystickPointerId: number | null = null;
        private joystickBase!: Phaser.GameObjects.Arc;
        private joystickThumb!: Phaser.GameObjects.Arc;

        constructor() {
          super('town');
        }

        preload() {
          this.load.image('town-map', '/assets/world/hsk-pixel-town-tile.webp');
        }

        private createPlayerTexture() {
          const graphics = this.make.graphics({ x: 0, y: 0 });
          const skin = colorToNumber(avatar.skinTone);
          const hair = colorToNumber(avatar.hairColor);
          const outfit = OUTFIT_COLORS[avatar.outfit];
          graphics.fillStyle(0x172033).fillRect(8, 4, 28, 26);
          graphics.fillStyle(hair).fillRect(10, 2, 24, 11).fillRect(7, 8, 7, 16).fillRect(30, 8, 7, 16);
          if (avatar.hairStyle === 'ponytail') graphics.fillRect(34, 10, 7, 18);
          if (avatar.hairStyle === 'spiky') graphics.fillTriangle(10, 7, 15, 0, 19, 7).fillTriangle(20, 6, 25, 0, 29, 7);
          graphics.fillStyle(skin).fillRect(12, 11, 20, 18);
          graphics.fillStyle(0x172033).fillRect(16, 18, 3, 4).fillRect(26, 18, 3, 4);
          graphics.fillStyle(0xb91c1c).fillRect(20, 25, 5, 2);
          graphics.fillStyle(outfit).fillRect(9, 30, 27, 19);
          graphics.fillStyle(skin).fillRect(4, 32, 6, 15).fillRect(35, 32, 6, 15);
          graphics.fillStyle(0x172033).fillRect(10, 49, 11, 6).fillRect(25, 49, 11, 6);
          if (avatar.accessory === 'glasses') {
            graphics.lineStyle(2, 0x172033).strokeRect(13, 16, 8, 7).strokeRect(24, 16, 8, 7).lineBetween(21, 19, 24, 19);
          }
          if (avatar.accessory === 'bow') graphics.fillStyle(0xef4444).fillTriangle(8, 7, 16, 11, 8, 15).fillTriangle(20, 11, 28, 7, 28, 15);
          if (avatar.accessory === 'cap') graphics.fillStyle(0x0e7490).fillRect(9, 2, 27, 8).fillRect(32, 8, 9, 4);
          graphics.generateTexture('player-avatar', 45, 56);
          graphics.destroy();
        }

        private addObstacle(x: number, y: number, width: number, height: number, group: Phaser.Physics.Arcade.StaticGroup) {
          const obstacle = this.add.rectangle(x, y, width, height, 0x000000, 0);
          this.physics.add.existing(obstacle, true);
          group.add(obstacle);
        }

        create() {
          this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
          this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
          this.add.image(0, 0, 'town-map').setOrigin(0).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);

          const obstacles = this.physics.add.staticGroup();
          this.addObstacle(430, 145, 520, 260, obstacles);
          this.addObstacle(1210, 145, 330, 245, obstacles);
          this.addObstacle(1530, 170, 270, 340, obstacles);
          this.addObstacle(445, 630, 570, 255, obstacles);
          this.addObstacle(1215, 650, 520, 260, obstacles);

          for (const destination of DESTINATIONS) {
            this.add.text(destination.x, destination.y - 38, `${destination.chinese}\n${destination.title}`, {
              fontFamily: 'serif',
              fontSize: '17px',
              fontStyle: 'bold',
              color: '#172033',
              align: 'center',
              backgroundColor: '#fff8dc',
              padding: { x: 8, y: 5 },
              stroke: '#fff8dc',
              strokeThickness: 1,
            }).setOrigin(0.5, 1).setDepth(4);
          }

          this.createPlayerTexture();
          this.player = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'player-avatar').setDepth(8);
          this.player.body.setSize(24, 20).setOffset(10, 34);
          this.player.setCollideWorldBounds(true);
          this.physics.add.collider(this.player, obstacles);

          this.cameras.main.startFollow(this.player, true, 0.14, 0.14);
          this.cameras.main.setDeadzone(70, 54);
          this.cameras.main.setRoundPixels(true);

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wasd = this.input.keyboard!.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' }) as typeof this.wasd;
          this.actionKeys = [
            this.input.keyboard!.addKey(PhaserRuntime.Input.Keyboard.KeyCodes.E),
            this.input.keyboard!.addKey(PhaserRuntime.Input.Keyboard.KeyCodes.SPACE),
            this.input.keyboard!.addKey(PhaserRuntime.Input.Keyboard.KeyCodes.ENTER),
          ];

          const joystickY = this.scale.height - 84;
          this.joystickBase = this.add.circle(82, joystickY, 48, 0xfffdf4, 0.52).setStrokeStyle(3, 0x172033, 0.65).setScrollFactor(0).setDepth(50);
          this.joystickThumb = this.add.circle(82, joystickY, 22, 0xfbbf24, 0.82).setStrokeStyle(3, 0x172033, 0.82).setScrollFactor(0).setDepth(51);
          const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
          this.joystickBase.setVisible(coarsePointer);
          this.joystickThumb.setVisible(coarsePointer);

          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!coarsePointer || pointer.x > 160 || pointer.y < this.scale.height - 170) return;
            this.joystickPointerId = pointer.id;
            this.updateJoystick(pointer);
          });
          this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.id === this.joystickPointerId) this.updateJoystick(pointer);
          });
          const releaseJoystick = (pointer: Phaser.Input.Pointer) => {
            if (pointer.id !== this.joystickPointerId) return;
            this.joystickPointerId = null;
            this.joystickVector.set(0, 0);
            this.joystickThumb.setPosition(82, this.scale.height - 84);
          };
          this.input.on('pointerup', releaseJoystick);
          this.input.on('pointerupoutside', releaseJoystick);
        }

        private updateJoystick(pointer: Phaser.Input.Pointer) {
          const origin = new PhaserRuntime.Math.Vector2(82, this.scale.height - 84);
          const delta = new PhaserRuntime.Math.Vector2(pointer.x - origin.x, pointer.y - origin.y);
          const distance = Math.min(44, delta.length());
          if (delta.lengthSq() > 0) delta.normalize();
          this.joystickVector.copy(delta);
          this.joystickThumb.setPosition(origin.x + delta.x * distance, origin.y + delta.y * distance);
        }

        update() {
          const keyboardX = Number(this.cursors.right.isDown || this.wasd.right.isDown) - Number(this.cursors.left.isDown || this.wasd.left.isDown);
          const keyboardY = Number(this.cursors.down.isDown || this.wasd.down.isDown) - Number(this.cursors.up.isDown || this.wasd.up.isDown);
          const direction = new PhaserRuntime.Math.Vector2(keyboardX, keyboardY);
          if (direction.lengthSq() === 0) direction.copy(this.joystickVector);
          if (direction.lengthSq() > 1) direction.normalize();

          const targetX = direction.x * 210;
          const targetY = direction.y * 210;
          this.player.setVelocity(
            PhaserRuntime.Math.Linear(this.player.body.velocity.x, targetX, 0.34),
            PhaserRuntime.Math.Linear(this.player.body.velocity.y, targetY, 0.34),
          );
          if (Math.abs(this.player.body.velocity.x) < 2 && targetX === 0) this.player.setVelocityX(0);
          if (Math.abs(this.player.body.velocity.y) < 2 && targetY === 0) this.player.setVelocityY(0);
          this.player.setFlipX(this.player.body.velocity.x < -3);
          this.player.setAngle(direction.lengthSq() > 0 ? Math.sin(this.time.now / 70) * 1.4 : 0);

          const nearbyDestination = DESTINATIONS.find((destination) => (
            PhaserRuntime.Math.Distance.Between(this.player.x, this.player.y, destination.x, destination.y) < 84
          )) ?? null;
          const nearbyId = nearbyDestination?.id ?? null;
          if (nearbyId !== this.lastNearby) {
            this.lastNearby = nearbyId;
            setNearby(nearbyDestination);
          }
          if (nearbyDestination && this.actionKeys.some((key) => PhaserRuntime.Input.Keyboard.JustDown(key))) {
            onEnterRef.current(nearbyDestination.id);
          }
        }
      }

      const game = new PhaserRuntime.Game({
        type: PhaserRuntime.AUTO,
        parent,
        width: Math.max(320, parent.clientWidth),
        height: Math.max(420, parent.clientHeight),
        backgroundColor: '#173322',
        pixelArt: true,
        roundPixels: true,
        physics: { default: 'arcade', arcade: { debug: false } },
        audio: { noAudio: true },
        scale: { mode: PhaserRuntime.Scale.RESIZE, autoCenter: PhaserRuntime.Scale.CENTER_BOTH },
        scene: TownScene,
      });
      gameRef.current = game;
      resizeObserver = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) game.scale.resize(width, height);
      });
      resizeObserver.observe(parent);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [avatar]);

  return (
    <section className="phaser-town-shell" aria-label="Thị trấn HSK có thể khám phá">
      <div ref={mountRef} className="phaser-town-canvas" />
      {nearby && (
        <button type="button" className="phaser-town-interact" onClick={() => onEnter(nearby.id)}>
          <span>Vào</span>
          <strong>{nearby.title}</strong>
          <kbd>E</kbd>
        </button>
      )}
    </section>
  );
}
