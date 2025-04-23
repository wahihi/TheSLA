class GameScene extends Phaser.Scene {
    constructor () {
        super({ key: 'gameScene' })

        this.ship = null
        this.fireMissile = false
        this.score = 0
        this.scoreText = null
        this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }

        this.gameOverText = null
        this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }

        this.controlsImage = null
        
        // 게임 영역 설정을 위한 속성
        this.gameWidth = 0
        this.gameHeight = 0
        this.scaleRatio = 1
    }

    init (data){
        this.cameras.main.setBackgroundColor('#0x5f6e7a')
        
        // 현재 캔버스 크기 가져오기
        this.gameWidth = this.scale.width
        this.gameHeight = this.scale.height
        
        // 원본 디자인 크기(1920x1080)와 현재 크기의 비율 계산
        this.scaleRatio = Math.min(
            this.gameWidth / window.gameWidth,
            this.gameHeight / window.gameHeight
        )
    }

    createAlien () {
        // 화면 너비에 맞게 적 위치 설정
        const alienXLocation = Math.floor(Math.random() * this.gameWidth) + 1
        let alienXVelocity = Math.floor(Math.random() * 50) + 1
        alienXVelocity *= Math.round(Math.random()) ? 1 : -1
        const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien')
        
        // 적기의 물리적 충돌 영역을 조정
        anAlien.body.setSize(anAlien.width * 1.2, anAlien.height * 1.2, true)

        // 속도를 화면 크기에 비례하게 조정
        anAlien.body.velocity.y = 200 * this.scaleRatio
        anAlien.body.velocity.x = alienXVelocity * this.scaleRatio
        this.alienGroup.add(anAlien)
    }

    preload(){
        console.log('Game Scene')

        // images
        this.load.image('starBackground', 'assets/starBackground.png')
        this.load.image('ship', 'assets/spaceShip.png')
        this.load.image('missile', 'assets/missile.png')
        this.load.image('alien', 'assets/alien.png')

        // 컨트롤 이미지 하나만 로드
        this.load.image('controls', 'assets/game_controls.png')  // 방향키와 스페이스키가 모두 포함된 하나의 이미지
     
        // 로딩 오류 디버깅을 위한 오류 처리 추가
        this.load.on('loaderror', function(file) {
            console.error('로딩 오류:', file.src);
        });
        
        // sound
        this.load.audio('laser', 'assets/laser1.wav')
        this.load.audio('explosion', 'assets/barrelExploding.wav')
        this.load.audio('bomb', 'assets/bomb.wav')
    }

    create(data) {
        // 화면 크기 업데이트 (resize 이벤트 발생 시 호출됨)
        this.scale.on('resize', this.resize, this);
        
        // 배경 이미지 설정
        this.background = this.add.image(0, 0, 'starBackground')
            .setOrigin(0, 0)
            .setDisplaySize(this.gameWidth, this.gameHeight); // 화면에 맞게 비율 조정

        // 점수 텍스트 설정 (폰트 크기를 화면 크기에 비례하게 조정)
        const scaledFontSize = Math.max(20, Math.floor(65 * this.scaleRatio));
        this.scoreTextStyle.font = `${scaledFontSize}px Arial`;
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle);

        // 우주선 초기 위치 설정
        this.ship = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight - 100, 'ship');
        
        // 우주선 크기 조정 (선택 사항)
        if (this.scaleRatio < 0.8) {
            this.ship.setScale(this.scaleRatio * 1.2); // 작은 화면에서는 약간 더 크게
        }

        this.missileGroup = this.physics.add.group();
        this.alienGroup = this.add.group();
        this.createAlien();

        // 컨트롤 이미지 추가 (화면 크기에 비례)
        const controlScale = Math.max(0.1, 0.2 * this.scaleRatio);
        this.controlsImage = this.add.image(10, this.gameHeight - 10, 'controls')
            .setScale(controlScale)
            .setAlpha(0.7)
            .setDepth(1)
            .setOrigin(0, 1); // 좌측 하단 기준

        this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
            alienCollide.destroy();
            missileCollide.destroy();
            this.sound.play('explosion');
            this.score = this.score + 1;
            this.scoreText.setText('Score: ' + this.score.toString());
            this.createAlien();
            this.createAlien();
        }.bind(this));

        // Collisions between ship and aliens
        this.physics.add.collider(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
            this.sound.play('bomb');
            this.physics.pause();
            alienCollide.destroy();
            shipCollide.destroy();
            
            // 게임오버 텍스트 크기 조정
            const gameOverFontSize = Math.max(30, Math.floor(65 * this.scaleRatio));
            this.gameOverTextStyle.font = `${gameOverFontSize}px Arial`;
            
            this.gameOverText = this.add.text(
                this.gameWidth / 2, 
                this.gameHeight / 2, 
                'Game Over!\nClick to play again.', 
                this.gameOverTextStyle
            ).setOrigin(0.5);
            
            this.gameOverText.setInteractive({ useHandCursor: true });
            this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'));
        }.bind(this));
    }

    // 화면 크기 변경 시 호출되는 메서드
    resize(gameSize) {
        // 새 게임 크기 저장
        this.gameWidth = gameSize.width;
        this.gameHeight = gameSize.height;
        
        // 스케일 비율 업데이트
        this.scaleRatio = Math.min(
            this.gameWidth / window.gameWidth,
            this.gameHeight / window.gameHeight
        );
        
        // 배경 이미지 리사이징
        if (this.background) {
            this.background.setDisplaySize(this.gameWidth, this.gameHeight);
        }
        
        // 점수 텍스트 업데이트
        if (this.scoreText) {
            const scaledFontSize = Math.max(20, Math.floor(65 * this.scaleRatio));
            this.scoreTextStyle.font = `${scaledFontSize}px Arial`;
            this.scoreText.setStyle(this.scoreTextStyle);
        }
        
        // 컨트롤 이미지 업데이트
        if (this.controlsImage) {
            const controlScale = Math.max(0.1, 0.2 * this.scaleRatio);
            this.controlsImage.setScale(controlScale);
            this.controlsImage.setPosition(10, this.gameHeight - 10);
        }
        
        // 게임오버 텍스트 업데이트
        if (this.gameOverText) {
            const gameOverFontSize = Math.max(30, Math.floor(65 * this.scaleRatio));
            this.gameOverTextStyle.font = `${gameOverFontSize}px Arial`;
            this.gameOverText.setStyle(this.gameOverTextStyle);
            this.gameOverText.setPosition(this.gameWidth / 2, this.gameHeight / 2);
        }
    }

    update(time, delta) {
        const keyLeftObj = this.input.keyboard.addKey('LEFT');
        const keyRightObj = this.input.keyboard.addKey('RIGHT');
        const keySpaceObj = this.input.keyboard.addKey('SPACE');

        // 이동 속도를 화면 크기에 비례하게 조정
        const moveSpeed = 15 * this.scaleRatio;

        // 왼쪽 키
        if (keyLeftObj.isDown === true){
            this.ship.x -= moveSpeed;
            if (this.ship.x < 0){
                this.ship.x = 0;
            }
        }

        // 오른쪽 키
        if (keyRightObj.isDown === true){
            this.ship.x += moveSpeed;
            if (this.ship.x > this.gameWidth){
                this.ship.x = this.gameWidth;
            }
        }

        if (keySpaceObj.isDown === true){
            if (this.fireMissile === false){
                this.fireMissile = true;
                const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile');

                // 미사일 크기 조정 (선택 사항)
                if (this.scaleRatio < 0.8) {
                    aNewMissile.setScale(this.scaleRatio * 1.5);
                }

                // 미사일의 물리적 충돌 영역을 조정
                aNewMissile.body.setSize(aNewMissile.width * 1.5, aNewMissile.height * 1.5, true);
                
                this.missileGroup.add(aNewMissile);
                this.sound.play('laser');
            }
        }

        if (keySpaceObj.isUp === true){
            this.fireMissile = false;
        }

        // 미사일 이동 속도를 화면 크기에 맞게 조정
        const missileSpeed = 15 * this.scaleRatio;
        
        this.missileGroup.children.each(function (item) {
            item.y = item.y - missileSpeed;
            if (item.y < 50) {
                item.destroy();
            }
        });

        // 적이 하나도 없으면 새 적을 생성
        if (this.alienGroup.getChildren().length === 0) {
            this.createAlien();
        }
        
        // 화면 밖으로 나간 적 제거
        this.alienGroup.children.each(function (item) {
            if (item.y > this.gameHeight) {
                item.destroy();
            }
        }, this);
    }        
}
