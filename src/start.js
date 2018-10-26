"use strict"

import { canvas, Core, halfCanvasHeight, halfCanvasWidth, scale, tutorialPageAssetsPath } from './core'
const { drawRect, drawImage, drawText, drawCircle , loadImg } = Core;
import $ from  'jquery';

/**
 * Credits page class
 */
export default class Start {

    framesPerSecond = 60;
    startInstructionOpacity = 0;
    reverseOpacity = false;
    useTouch = false;
    bestScore = 0;

    LIGHT_FONT_SIZE = 33
    BOLD_FONT_SIZE = 48
    CIRCLE_RADIUS = 10
    FirstFlag = true;
    ani ;

    draw() {
        
        // Background
        // drawRect(0, 0, canvas.width, canvas.height, 'black')
        // drawImage(
        //     0,
        //     0,
        //     'https://cdn.wcampaign.cn/20181019gl/h5/static/assets/bg.png',
		// 	canvas.width,
		// 	canvas.height
        // )

        // //绘制首页头顶
        // drawImage(
        //     0,
        //     0,
        //     'https://cdn.wcampaign.cn/20181019gl/h5/static/assets/p1-t1.png',
		// 	canvas.width,
		// 	canvas.width / 1.953
        // )

        // //绘制那只大蜜蜂
        // drawImage(
        //     canvas.width * 0.1,
        //     canvas.height * 0.23,
        //     'https://cdn.wcampaign.cn/20181019gl/h5/static/assets/p1-t2.png',
        //     canvas.width * 0.8,
        //     canvas.width * 0.8 / 0.802
        // )
            
        // drawText(
        //     halfCanvasWidth - (50*scale), 
        //     halfCanvasHeight - (55*scale) - (canvas.height/4), 
        //     this.LIGHT_FONT_SIZE * scale, 
        //     'white', 
        //     'Montserrat-Thin', 
        //     'Snake'
        // )
        // drawText(
        //     halfCanvasWidth - (35*scale), 
        //     halfCanvasHeight - (canvas.height/4), 
        //     this.BOLD_FONT_SIZE * scale, 
        //     'white', 
        //     'Montserrat-Regular', 
        //     'VS'
        // )
        // drawText(
        //     halfCanvasWidth - (45*scale), 
        //     halfCanvasHeight + (45 * scale) - (canvas.height/4), 
        //     this.LIGHT_FONT_SIZE * scale, 
        //     'white', 
        //     'Montserrat-Thin', 
        //     'Block'
        // )

        // if(this.bestScore > 0) {
        //     drawText(
        //         halfCanvasWidth - (40 * scale), 
        //         halfCanvasHeight - (halfCanvasHeight / 7), 
        //         16 * scale, 
        //         'white', 
        //         'Montserrat-Thin', 
        //         'Best score :'
        //     )

        //     drawText(
        //         halfCanvasWidth - ((this.bestScore > 9 ? 20 : 10) * scale), 
        //         halfCanvasHeight + (10 * scale), 
        //         this.LIGHT_FONT_SIZE * scale, 
        //         'white', 
        //         'Montserrat-Regular', 
        //         this.bestScore
        //     )
        // }

        // Start instruction text
        // drawText(
        //     halfCanvasWidth - (55 * scale), 
        //     halfCanvasHeight + (canvas.height/3), 
        //     22 * scale, 
        //     `rgba(255, 255, 255, ${this.startInstructionOpacity.toFixed(2)})`, 
        //     'Montserrat-Thin', 
        //     'Tap to play'
        // );

        // drawText(
        //     halfCanvasWidth - (4*scale), 
        //     (halfCanvasHeight + canvas.height/6) - (20*scale),
        //      14 * scale, 
        //      'white', 
        //      'Montserrat-Regular', 
        //      '4')

        // drawCircle(
        //     halfCanvasWidth, 
        //     halfCanvasHeight + canvas.height/6, 
        //     this.CIRCLE_RADIUS * scale, 
        //     `rgb(255, 204, 0)`
        // );
    }

    /**
     * Show the start state
     */
    show(runGame) {

        this.runGame = runGame

        // canvas.addEventListener("touchstart", this.onTouch)
        //canvas.addEventListener("mousedown", this.onTouch)

        // document.querySelector('.play').addEventListener("touchstart", this.onTouch)
        document.querySelector('.play').addEventListener("mousedown", this.showTutorial)
        document.querySelector('.playAgain').addEventListener("mousedown", this.onTouch)

        // if(localStorage.key('bestScore') !== null) {
        //     this.bestScore = localStorage.getItem('bestScore')
        // }

        // Start instruction text blinking
        // this.instructionAnimation = setInterval(() => {
            
        //     const opacity = parseFloat(this.startInstructionOpacity.toFixed(2));

        //     if(opacity <= 1 && !this.reverseOpacity) {
        //         this.startInstructionOpacity += 0.04
        //         if(opacity === 1) {
        //             this.reverseOpacity = !this.reverseOpacity
        //         }
        //     } else if(opacity >= 0 && this.reverseOpacity) {
        //         this.startInstructionOpacity -= 0.04
        //         if(opacity === 0) {
        //             this.reverseOpacity = !this.reverseOpacity
        //         }
        //     }

        //     this.draw()
        // }, 20)

        this.draw()
    }

       //出现第一次的教程图片
       showTutorial = () => {
        drawImage(
            0,
            0,
            'https://cdn.wcampaign.cn/20181019gl/h5/static/assets/tutorial.png',
			canvas.width,
			canvas.height
        )
        $(".beeBox").hide();
        canvas.addEventListener("mousedown", this.onTouch)
    }

    onTouch = (evt) => {
        $(".beeBox").hide();
        $(".palyAgainBox").hide();
        if(this.FirstFlag){
            var n = 0;//帧数
            
            
            function drawAni(){
                drawImage(
                    0,
                    0,
                    tutorialPageAssetsPath[n],
                    canvas.width,
                    canvas.height
                )
                n++;
            }

            this.ani = setInterval(function(){
                if(n>208){
                    clearInterval(this.ani);
                }else{
                    drawAni();
                }
                
            }.bind(this),1000/20)
            canvas.addEventListener("mousedown", this.onTouch)
            this.FirstFlag = false;
        }else{
            evt.preventDefault();
            clearInterval(this.ani);
            if(evt.type === 'touchstart') {
                this.useTouch = true
            }

            if (evt.type === "touchend" || evt.type === "mousedown" && this.useTouch === true) {
                return false;
            }

            clearInterval(this.instructionAnimation);
            canvas.removeEventListener("touchstart", this.onTouch)
            canvas.removeEventListener("mousedown", this.onTouch)

            this.runGame(this.show.bind(this))
        }
        
      }
}