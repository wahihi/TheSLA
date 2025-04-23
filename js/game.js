// import SplashScene from './splashScene.js'
// import TitleScene from './titleScene.js'
// import MenuScene from './menuScene.js'
// import GameScene from './gameScene.js'

// 전역 변수로 게임 기본 크기 설정 (다른 파일에서 접근 가능)
const gameWidth = 1920;
const gameHeight = 1080;
window.gameWidth = gameWidth;
window.gameHeight = gameHeight;

const splashScene = new SplashScene()
const titleScene = new TitleScene()
const menuScene = new MenuScene()
const gameScene = new GameScene()

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    backgroundColor: 0xffffff,
    scale: {
        mode: Phaser.Scale.RESIZE,       // FIT 대신 RESIZE로 변경
        parent: 'game-container',        // HTML에 추가될 div ID
        width: '100%',                   // 컨테이너의 100% 사용
        height: '100%',                  // 컨테이너의 100% 사용
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // 최소/최대 크기 설정 (선택 사항 - 너무 작거나 큰 화면에서 레이아웃 깨짐 방지)
        min: {
            width: 480,                  // 최소 너비
            height: 270                  // 최소 높이
        },
        max: {
            width: 1920,                 // 최대 너비
            height: 1080                 // 최대 높이
        }
    }
}

const game = new Phaser.Game(config)

game.scene.add('splashScene', splashScene)
game.scene.add('titleScene', titleScene)
game.scene.add('menuScene', menuScene)
game.scene.add('gameScene', gameScene)

game.scene.start('splashScene')
