class SplashScene extends Phaser.Scene {
  constructor () {
    super({ key: 'splashScene' })

    this.splashSceneBackgroundImage = null
    this.gameWidth = 0
    this.gameHeight = 0
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
    // 현재 게임 캔버스 크기 저장
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
  }

  preload () {
    console.log('Splash Scene')
    this.load.image('splashSceneBackground', './assets/splashSceneImage.png')
  }

  create (data) {
    // 화면 크기 변경시 이벤트 등록
    this.scale.on('resize', this.resize, this)
    
    // 배경 이미지 생성 및 화면 중앙에 배치
    this.splashSceneBackgroundImage = this.add.sprite(
      this.gameWidth / 2, 
      this.gameHeight / 2, 
      'splashSceneBackground'
    )
    
    // 이미지 크기를 화면에 맞게 조정
    this.resizeImage()
  }
  
  // 화면 크기 변경 시 호출되는 메서드
  resize(gameSize) {
    this.gameWidth = gameSize.width
    this.gameHeight = gameSize.height
    
    // 배경 이미지 중앙 재배치
    if (this.splashSceneBackgroundImage) {
      this.splashSceneBackgroundImage.setPosition(this.gameWidth / 2, this.gameHeight / 2)
      this.resizeImage()
    }
  }
  
  // 이미지 크기 조정 메서드
  resizeImage() {
    if (this.splashSceneBackgroundImage) {
      // 화면에 맞추기 위한 이미지 크기 계산
      const scaleX = this.gameWidth / this.splashSceneBackgroundImage.width
      const scaleY = this.gameHeight / this.splashSceneBackgroundImage.height
      const scale = Math.min(scaleX, scaleY)
      
      // 이미지 크기 적용
      this.splashSceneBackgroundImage.setScale(scale)
    }
  }

  update (time, delta) {
    if (time > 3000) {
        this.scene.switch('titleScene')
    }
  }
}