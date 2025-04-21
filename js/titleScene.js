
class TitleScene extends Phaser.Scene {
    constructor () {
        super({ key: 'titleScene'})

        this.titleSceneBackgroundImage = null
        this.titleSceneText = null
        this.titleSceneTextStyle = { font: '200px Times', fill: '#fde4b9', align: 'center'}

        this.villain_1 = null
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

        this.time.delayedCall(1500, () => {
            this.titleSceneBackgroundImage.visible =false
            this.villain_1.visible = true
        }, [], this);
    }

    update (time, delta){
        if (time > 7000){
            this.scene.switch('menuScene')
        }
    }

}

// export default TitleScene