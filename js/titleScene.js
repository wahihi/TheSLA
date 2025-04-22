
class TitleScene extends Phaser.Scene {
    constructor () {
        super({ key: 'titleScene'})

        this.titleSceneBackgroundImage = null
        this.titleSceneText = null
        this.titleSceneTextStyle = { font: '200px Times', fill: '#fde4b9', align: 'center'}

        this.villain_1 = null
        this.scrollText = null
        this.scrollComplete = false
    }

    init (data) {
        this.cameras.main.setBackgroundColor('#ffffff')
    }

    preload () {
        console.log('Title Scene')
        this.load.image('titleSceneBackground', 'assets/aliens_screen_image.jpg')
        this.load.image("villain_1",'assets/the.jpg')
    }

    create (data) {        
        this.titleSceneBackgroundImage = this.add.sprite(0, 0, 'titleSceneBackground').setScale(2.75)
        this.titleSceneBackgroundImage.x = 1920 /2
        this.titleSceneBackgroundImage.y = 1080 /2

        this.titleSceneText = this.add.text(1920 / 2, (1080/2) + 350, 'Space Aliens', this.titleSceneTextStyle).setOrigin(0.5)

        this.villain_1 = this.add.sprite(1920/2, 1080/2, 'villain_1').setScale(1.0).setOrigin(0.5)
        this.villain_1.visible = false

        const scrollTextContent = 
        "* 1969년 화성에서 내전이 전쟁이 발발하여, 핵전쟁이 일어 나게 되었다.\n\n" + 
        "* 그때, 마지막 생명을 살리기 위해, 화성왕자 슬라를 지구로 극비리에 보내게된다.\n\n" + 
        "* 슬라는, 어느날 자신이 화성에서 온 왕자임을 깨닫게 되고,\n\n" + 
        "* 화성으로 돌아가, 잃어버린 왕국을 되찾고, 부모의 복수를 위해,\n\n" + 
        "* 창업을 해서 부자가 되고, 화성에 돌아가기 위한 준비를 한다.\n\n" + 
        "* 모든 준비를 마친 슬라는, 화성으로 출발을 하게 되는데…";

        // 스크롤 텍스트의 스타일 설정
        const scrollTextStyle = { 
            font: '56px Arial', 
            fill: '#fde4b9', 
            align: 'center',
            wordWrap: { width: 1000 }
        };

        this.scrollText = this.add.text(1920/2, 1200, scrollTextContent, scrollTextStyle)
            .setOrigin(0.5)
            .setVisible(false);


        this.time.delayedCall(1500, () => {
            this.titleSceneBackgroundImage.visible =false
            this.titleSceneText.visible = false
            this.villain_1.visible = true

            this.scrollText.setVisible(true)

            this.tweens.add({
                targets: this.scrollText,
                y: -600,
                duration: 25000,
                ease: 'Linear',
                onComplete: () => {
                    this.scrollComplete = true;
                }
            });

        }, [], this);
    }

    update (time, delta){
        if (this.scrollComplete){
            this.scene.switch('menuScene')
        }
    }

}

// export default TitleScene