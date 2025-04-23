class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menuScene' })

    this.menuSceneBackgroundImage = null
    this.startButton = null
    
    // 화면 크기 정보
    this.gameWidth = 0
    this.gameHeight = 0
    this.scaleRatio = 1
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
    
    // 현재 게임 캔버스 크기 저장
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
    
    // 스케일 비율 계산
    this.scaleRatio = Math.min(
        this.gameWidth / window.gameWidth,
        this.gameHeight / window.gameHeight
    )
  }

  preload () {
    console.log('Menu Scene')

    this.load.image('menuSceneBackground', 'assets/aliens_screen_image2.jpg')
    this.load.image('startButton', 'assets/start.png')
  }

  create (data) {
    // 화면 크기 변경시 이벤트 등록
    this.scale.on('resize', this.resize, this)
    
    // 배경 이미지 설정
    this.menuSceneBackgroundImage = this.add.sprite(
      this.gameWidth / 2, 
      this.gameHeight / 2, 
      'menuSceneBackground'
    )
    
    // 배경 이미지 크기 조정 (화면에 맞게)
    this.resizeBackgroundImage()

    // 시작 버튼 추가 (위치는 화면 크기에 맞게 조정)
    this.startButton = this.add.sprite(
      this.gameWidth / 2, 
      (this.gameHeight / 2) + (100 * this.scaleRatio), 
      'startButton'
    )
    
    // 버튼 크기 조정
    const buttonScale = Math.max(0.5, 1.0 * this.scaleRatio)
    this.startButton.setScale(buttonScale)
    
    this.startButton.setInteractive({ useHandCursor: true })
    this.startButton.on('pointerdown', () => this.clickButton())
  }
  
  // 화면 크기 변경 시 호출되는 메서드
  resize(gameSize) {
    this.gameWidth = gameSize.width
    this.gameHeight = gameSize.height
    
    // 스케일 비율 업데이트
    this.scaleRatio = Math.min(
        this.gameWidth / window.gameWidth,
        this.gameHeight / window.gameHeight
    )
    
    // 배경 이미지 업데이트
    if (this.menuSceneBackgroundImage) {
      this.menuSceneBackgroundImage.setPosition(this.gameWidth / 2, this.gameHeight / 2)
      this.resizeBackgroundImage()
    }
    
    // 시작 버튼 업데이트
    if (this.startButton) {
      this.startButton.setPosition(
        this.gameWidth / 2, 
        (this.gameHeight / 2) + (100 * this.scaleRatio)
      )
      const buttonScale = Math.max(0.5, 1.0 * this.scaleRatio)
      this.startButton.setScale(buttonScale)
    }
  }
  
  // 배경 이미지 크기 조정
  resizeBackgroundImage() {
    if (this.menuSceneBackgroundImage) {
      const scaleX = this.gameWidth / this.menuSceneBackgroundImage.width
      const scaleY = this.gameHeight / this.menuSceneBackgroundImage.height
      const scale = Math.max(scaleX, scaleY) // 화면을 완전히 채우기 위해
      this.menuSceneBackgroundImage.setScale(scale)
    }
  }

  update (time, delta) {
  }

  clickButton () {
    this.scene.start('gameScene')
  }
}