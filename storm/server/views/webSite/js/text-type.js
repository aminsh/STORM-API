"use strict";

import $ from "./libs/jQuery/jquery-3.2.1.min.js";

//TextTyping Plugin By SMRSAN
let text_typing = (function(window, document, $){

    let tt_elems = [];

    function text_typing_use(elemSelection, textArray, intervalSpeed){

        let elem = $(elemSelection)[0],
            writeFlag = true,
            stringIndex = 0,
            charIndex = 1,
            waitTime = false,
            waitFrame = 0,
            newTTElem = {
                elem: elem,
                txtArr: textArray,
                interval: setInterval(function(){

                    let str = "";
                    if( !waitTime ) {//NoWait for user reading
                        if (writeFlag) {//Typing...
                            if (charIndex <= textArray[stringIndex].length) {
                                str = "";
                                for (let i = 0; i < charIndex; i++) {
                                    str += textArray[stringIndex][i];
                                }
                                charIndex++;
                                $(elem)
                                    .html(str);
                            } else {
                                charIndex--;
                                waitTime  = true;
                                writeFlag = false;
                            }
                        } else {//Backspace
                            if (charIndex >= 0) {
                                str = "";
                                for (let i = 0; i < charIndex; i++) {
                                    str += textArray[stringIndex][i];
                                }
                                charIndex--;
                                $(elem)
                                    .html(str);
                            } else {
                                writeFlag = true;
                                stringIndex++;
                                stringIndex = (stringIndex >= textArray.length) ? 0 : stringIndex;
                                charIndex = 1;
                            }
                        }
                    } else {
                        if( waitFrame === 20 ){
                            waitTime  = false;
                            waitFrame = 0;
                        } else {
                            waitFrame++;
                        }
                    }

                }, intervalSpeed? intervalSpeed:100)
            };
        tt_elems.push( newTTElem );

    }
    return text_typing_use;

}(window, document, $));

export default text_typing;