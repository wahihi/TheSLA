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
    }

    init (data){
        this.cameras.main.setBackgroundColor('#0x5f6e7a')
        
    }

    createAlien () {
        const alienXLocation = Math.floor(Math.random() * 1920) + 1
        let alienXVelocity = Math.floor(Math.random() * 50) + 1
        alienXVelocity *= Math.round(Math.random()) ? 1 : -1
        const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien')
        
        // 적기의 물리적 충돌 영역을 조정 (다음 라인 추가)
        anAlien.body.setSize(anAlien.width * 1.2, anAlien.height * 1.2, true)

        anAlien.body.velocity.y = 200
        anAlien.body.velocity.x = alienXVelocity
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
        this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
        this.background.setOrigin(0, 0)

        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)

        this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

        this.missileGroup = this.physics.add.group()

        this.alienGroup = this.add.group()
        this.createAlien()

        // 컨트롤 이미지 추가 (화면 좌측 하단에 작게 표시)
        this.controlsImage = this.add.image(100, 750, 'controls')
            .setScale(0.2)       // 이미지 크기 20%로 축소 (필요에 따라 조정)
            .setAlpha(0.7)       // 약간 투명하게
            .setDepth(1)         // 다른 요소보다 위에 표시
            .setOrigin(0, 0);    // 좌측 상단 기준점으로 설정

        this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
        alienCollide.destroy()
        missileCollide.destroy()
        this.sound.play('explosion')
        this.score = this.score + 1
        this.scoreText.setText('Score: ' + this.score.toString())
        this.createAlien()
        this.createAlien()
        }.bind(this))

        // Collisions between ship and aliens
        this.physics.add.collider(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
        this.sound.play('bomb')
        this.physics.pause()
        alienCollide.destroy()
        shipCollide.destroy()
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'))
        }.bind(this))
    }

    update(time, delta) {
        const keyLeftObj = this.input.keyboard.addKey('LEFT')
        const keyRightObj = this.input.keyboard.addKey('RIGHT')
        const keySpaceObj = this.input.keyboard.addKey('SPACE')

        // 왼쪽 키
        if (keyLeftObj.isDown === true){
            this.ship.x -= 15
            if (this.ship.x < 0){
                this.ship.x = 0
            }
        }

        // 오른쪽 키
        if (keyRightObj.isDown === true){
            this.ship.x += 15
            if (this.ship.x > 1920){
                this.ship.x = 1920
            }
        }

        if ( keySpaceObj.isDown === true){
            if (this.fireMissile === false){
                this.fireMissile = true
                const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')

                // 미사일의 물리적 충돌 영역을 조정 (다음 라인 추가)
                aNewMissile.body.setSize(aNewMissile.width * 1.5, aNewMissile.height * 1.5, true)
                
                this.missileGroup.add(aNewMissile)
                this.sound.play('laser')
            }
        }

        if (keySpaceObj.isUp === true){
            this.fireMissile = false
        }

        this.missileGroup.children.each(function (item) {
            item.y = item.y - 15
            if (item.y < 50) {
              item.destroy()
            }
          })

           // 추가된 코드: 적이 하나도 없으면 새 적을 생성
            if (this.alienGroup.getChildren().length === 0) {
                this.createAlien()
            }
            
            // 화면 밖으로 나간 적 제거 (추가)
            this.alienGroup.children.each(function (item) {
                if (item.y > 1080) {
                    item.destroy()
                }
            })
        }        
}
