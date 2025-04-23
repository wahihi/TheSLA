class TitleScene extends Phaser.Scene {
    constructor () {
        super({ key: 'titleScene'})

        this.titleSceneBackgroundImage = null
        this.titleSceneText = null
        this.titleSceneTextStyle = { font: '200px Times', fill: '#fde4b9', align: 'center'}

        this.villain_1 = null
        this.scrollText = null
        this.scrollComplete = false
        
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
        console.log('Title Scene')
        this.load.image('titleSceneBackground', 'assets/aliens_screen_image.jpg')
        this.load.image("villain_1",'assets/the.jpg')
    }

    create (data) {        
        // 화면 크기 변경시 이벤트 등록        
        this.scale.on('resize', this.resize, this)
        
        // 배경 이미지 설정
        this.titleSceneBackgroundImage = this.add.sprite(
            this.gameWidth / 2, 
            this.gameHeight / 2, 
            'titleSceneBackground'
        )
        
        // 배경 이미지 크기 조정
        const bgScale = Math.max(2.0, 2.75 * this.scaleRatio)
        this.titleSceneBackgroundImage.setScale(bgScale)
        
        // 폰트 크기를 화면 크기에 비례하게 조정
        const titleFontSize = Math.max(50, Math.floor(200 * this.scaleRatio))
        this.titleSceneTextStyle.font = `${titleFontSize}px Times`
        
        // 타이틀 텍스트 추가
        this.titleSceneText = this.add.text(
            this.gameWidth / 2, 
            (this.gameHeight / 2) + (350 * this.scaleRatio), 
            'Space Aliens', 
            this.titleSceneTextStyle
        ).setOrigin(0.5)

        // 빌런 이미지 추가
        this.villain_1 = this.add.sprite(
            this.gameWidth / 2, 
            this.gameHeight / 2, 
            'villain_1'
        ).setOrigin(0.5)
        
        // 이미지 크기 조정
        const villainScale = Math.max(0.5, 1.0 * this.scaleRatio)
        this.villain_1.setScale(villainScale)
        
        this.villain_1.visible = false

        const scrollTextContent = 
        "* 1969년 화성에서 내전이 전쟁이 발발하여, 핵전쟁이 일어 나게 되었다.\\n\\n" + 
        "* 그때, 마지막 생명을 살리기 위해, 화성왕자 슬라를 지구로 극비리에 보내게된다.\\n\\n" + 
        "* 슬라는, 어느날 자신이 화성에서 온 왕자임을 깨닫게 되고,\\n\\n" + 
        "* 화성으로 돌아가, 잃어버린 왕국을 되찾고, 부모의 복수를 위해,\\n\\n" + 
        "* 창업을 해서 부자가 되고, 화성에 돌아가기 위한 준비를 한다.\\n\\n" + 
        "* 모든 준비를 마친 슬라는, 화성으로 출발을 하게 되는데…";

        // 스크롤 텍스트 폰트 크기 조정
        const scrollFontSize = Math.max(24, Math.floor(56 * this.scaleRatio))
        
        // 스크롤 텍스트의 스타일 설정
        const scrollTextStyle = { 
            font: `${scrollFontSize}px Arial`, 
            fill: '#fde4b9', 
            align: 'center',
            wordWrap: { width: Math.min(1000, this.gameWidth * 0.8) }
        };

        // 스크롤 텍스트 위치 설정
        this.scrollText = this.add.text(
            this.gameWidth / 2, 
            this.gameHeight + 100, 
            scrollTextContent, 
            scrollTextStyle
        )
        .setOrigin(0.5)
        .setVisible(false);

        // 지연 후 애니메이션 시작
        this.time.delayedCall(1500, () => {
            this.titleSceneBackgroundImage.visible = false
            this.titleSceneText.visible = false
            this.villain_1.visible = true

            this.scrollText.setVisible(true)

            // 화면 크기에 맞게 스크롤 애니메이션 조정
            this.tweens.add({
                targets: this.scrollText,
                y: -this.scrollText.height,
                duration: 25000,
                ease: 'Linear',
                onComplete: () => {
                    this.scrollComplete = true;
                }
            });

        }, [], this);
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
        
        // 이미지와 텍스트 위치 및 크기 업데이트
        if (this.titleSceneBackgroundImage) {
            this.titleSceneBackgroundImage.setPosition(this.gameWidth / 2, this.gameHeight / 2)
            const bgScale = Math.max(2.0, 2.75 * this.scaleRatio)
            this.titleSceneBackgroundImage.setScale(bgScale)
        }
        
        if (this.villain_1) {
            this.villain_1.setPosition(this.gameWidth / 2, this.gameHeight / 2)
            const villainScale = Math.max(0.5, 1.0 * this.scaleRatio)
            this.villain_1.setScale(villainScale)
        }
        
        if (this.titleSceneText) {
            // 타이틀 텍스트 폰트 크기 조정
            const titleFontSize = Math.max(50, Math.floor(200 * this.scaleRatio))
            this.titleSceneTextStyle.font = `${titleFontSize}px Times`
            this.titleSceneText.setStyle(this.titleSceneTextStyle)
            this.titleSceneText.setPosition(
                this.gameWidth / 2, 
                (this.gameHeight / 2) + (350 * this.scaleRatio)
            )
        }
        
        if (this.scrollText && this.scrollText.visible) {
            // 스크롤 텍스트 폰트 크기 및 위치 조정
            const scrollFontSize = Math.max(24, Math.floor(56 * this.scaleRatio))
            const style = this.scrollText.style
            style.setFont(`${scrollFontSize}px Arial`)
            style.wordWrapWidth = Math.min(1000, this.gameWidth * 0.8)
            this.scrollText.setStyle(style)
            this.scrollText.setPosition(this.gameWidth / 2, this.scrollText.y)
            
            // 진행 중인 애니메이션이 있다면 중지하고 새로 시작
            this.tweens.killTweensOf(this.scrollText)
            if (!this.scrollComplete) {
                this.tweens.add({
                    targets: this.scrollText,
                    y: -this.scrollText.height,
                    duration: 25000,
                    ease: 'Linear',
                    onComplete: () => {
                        this.scrollComplete = true
                    }
                })
            }
        }
    }

    update (time, delta){
        if (this.scrollComplete){
            this.scene.switch('menuScene')
        }
    }
}
