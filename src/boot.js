"use strict"

import { canvas, Core, halfCanvasHeight, halfCanvasWidth, scale, homePageAssetsPath } from './core'
const { drawRect, drawImage, drawText, drawCircle , loadImg, clearRect } = Core;
import $ from  'jquery';

/**
 * Credits page class
 */
export default class Boot {

    VISIBILITY_DURATION = 1500
    HIDE_ANIMATION_DURATION = 1000

    VOODOO_LOGO_HEIGHT = 85
    VOODOO_LOGO_WIDTH = 300
    BENTO_LOGO_HEIGHT = 85
    BENTO_LOGO_WIDTH = 150

    LIGHT_FONT_SIZE = 33
    BOLD_FONT_SIZE = 48
    CIRCLE_RADIUS = 10

    framesPerSecond = 60
    bestScore = 0;

    blackBlock = {
        x: 0,
        y: 0
    }

    whiteBlock = {
        x: 0,
        y: (canvas.height/2)
    }

    constructor() {
        


        // this.voodooLogo = {
        //     x: halfCanvasWidth - ((this.VOODOO_LOGO_WIDTH * scale) / 2),
        //     y: (halfCanvasHeight / 2) - ((this.VOODOO_LOGO_HEIGHT * scale) / 2)
        // }

        // this.bentoLogo = {
        //     x: halfCanvasWidth - ((this.BENTO_LOGO_WIDTH * scale) / 2),
        //     y: ((halfCanvasHeight / 2) * 3) - ((this.BENTO_LOGO_HEIGHT * scale) / 2)
        // }

    }

    /**
     * Display the boot state the first time
     */
    display() {

        // Preload fonts because preload seems not working on chrome :'(
        drawText(0, -200, 1, 'black', 'Montserrat-Thin', 'a')
        drawText(0, -200, 1, 'black', 'Montserrat-Regular', 'a')


        // if(localStorage.key('bestScore') !== null) {
        //     this.bestScore = localStorage.getItem('bestScore')
        // }

        this.draw()
        return Promise.resolve()
    }

    /**
     * Hide the boot state with animation
     */
    hide() {
        this.hide_animation = window.requestAnimationFrame(this.hideAnimation)
    }

    hideAnimation = (timestamp) => {

        // if(this.blackBlock.x >= -(canvas.width) && this.whiteBlock.x <= canvas.width) {
        //     this.blackBlock.x -= (25 * scale)
        //     this.voodooLogo.x -= (25 * scale)

        //     this.whiteBlock.x += (25 * scale)
        //     this.bentoLogo.x += (25 * scale)
        //     this.draw()
        //     window.requestAnimationFrame(this.hideAnimation)
        // } else {
        //     window.cancelAnimationFrame(this.hide_animation)
        // }
    }

    draw() {
        // Background
        //一开始屏的背景
        // drawRect(0, 0, canvas.width, canvas.height, 'black')
        // drawImage(
        //     0,
        //     0,
        //     'https://glcdn.wcampaign.cn/assets/bg.png',
		// 	canvas.width,
		// 	canvas.height
        // )

        // Black and white block
        //drawRect(this.blackBlock.x, this.blackBlock.y, canvas.width, canvas.height / 2, '#212121')
        //drawRect(this.whiteBlock.x, this.whiteBlock.y, canvas.width, canvas.height / 2, 'white')

        // Voodoo and Bento logo
        //drawImage(this.voodooLogo.x, this.voodooLogo.y, "static/voodoo.png", this.VOODOO_LOGO_WIDTH*scale, this.VOODOO_LOGO_HEIGHT*scale)
        //drawImage(this.bentoLogo.x, this.bentoLogo.y, "static/bento.png", this.BENTO_LOGO_WIDTH*scale, this.BENTO_LOGO_HEIGHT*scale)

        // During the hide animation we display a preview of the start screen.
        // When the white and black block are enough away from the center we can
        // write the text without blink effect.
        // if(this.blackBlock.x < -(canvas.width/2) - (canvas.width/4)) {
        //     this.drawStartScreen()
        // }
        this.drawStartScreen();
        
    }


    drawStartScreen() {
        var n = 0;//帧数

        function drawAni(){
            drawImage(
                0,
                0,
                homePageAssetsPath[n],
                canvas.width,
                canvas.height
            )
            n++;
        }

        var ani = setInterval(function(){
            if(n>74){
                clearInterval(ani);
                drawImage(
                    0,
                    0,
                    'https://glcdn.wcampaign.cn/assets/bg.png',
                    canvas.width,
                    canvas.height
                )

                //绘制首页头顶
                drawImage(
                    0,
                    0,
                    'https://glcdn.wcampaign.cn/assets/p1-t1.png',
                    canvas.width,
                    canvas.width / 1.953
                )
                
                $(".beeBox").show();
            }else{
                drawAni();
            }
            
        },1000/20)
    }

    drawLoadingProcess(percentage){
        //绘制首页头顶
        clearRect();

        drawText(
            halfCanvasWidth - (50*scale), 
            halfCanvasHeight - (50*scale), 
            16 * scale,
            'white', 
            'Montserrat-Thin', 
            "Loading " + percentage + "%"
        );
    }
}