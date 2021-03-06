﻿/*
Auto Type Pashto
Version: 1.0
This Javascript module is developed to ease typing pashto in web forms without the need to change the system language or where
there is no Pashto Keyboard installed on a PC. This module assumes the keyboard structure as that of the built-in Pashto keyboard 
added to linux, windows and other Operating Systems.
*/
var shift_is_pressed = false;
var ctrl_is_pressed = false;

var pashto_keyboard = {
    // pashto keyboard map based on Afghanistan Official Pashto Keyboard Layout
    pashto_code_and_characters: {
        '104': 'ا',
        'shift+71': 'أ',
        '102': 'ب',
        'shift+70': 'پ',
        'shift+72': 'آ',
        'shift+76': 'ة',
        'shift+78': 'ډ',
        '106': 'ت',
        'shift+74': 'ټ',
        '101': 'ث',
        '91': 'ج',
        '112': 'ح',
        '105': 'ه',
        '111': 'خ',
        'shift+80': 'څ',
        'shift+90': 'ئ',
        'shift+86': 'ء',
        'shift+79': 'ځ',
        '93': 'چ',
        '110': 'د',
        '98': 'ذ',
        '118': 'ر',
        '99': 'ز',
        'shift+67': 'ژ',
        '109': 'ړ',
        'shift+77': 'ؤ',
        '44': 'و',
        '115': 'س',
        '97': 'ش',
        'shift+65': 'ښ',
        '119': 'ص',
        '113': 'ض',
        'shift+88': 'ط',
        '122': 'ظ',
        '117': 'ع',
        '121': 'غ',
        '116': 'ف',
        '114': 'ق',
        '59': 'ک',
        '39': 'ګ',
        '108': 'م',
        '107': 'ن',
        'shift+75': 'ڼ',
        '103': 'ل',
        '100': 'ی',
        'shift+83': 'ۍ',
        'shift+68': 'ي',
        '120': 'ې',
        '32': ' ',
        '49': '۱',
        '50': '۲',
        '51': '۳',
        '52': '۴',
        '53': '۵',
        '54': '۶',
        '55': '۷',
        '56': '۸',
        '57': '۹',
        '48': '۰',
        ',': ',',
        '-': '-',
    },
}

pashto_keyboard.init = function() {
    var Inputs = document.getElementsByTagName('INPUT');
    for (var i = 0; i < Inputs.length; i++) {
        if (Inputs[i].type.toLowerCase() == 'text' && (Inputs[i].lang.toLowerCase() == 'ps-af')) {
            new pashto_keyboard.KeyObject(Inputs[i]);
        }
    }
    
    var textareas = document.getElementsByTagName('TEXTAREA');
    for (var i = 0; i < textareas.length; i++) {
        if (textareas[i].lang.toLowerCase() == 'ps-af') {
            new pashto_keyboard.KeyObject(textareas[i]);
        }
    }
    
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++) {
        if(divs[i].contentEditable && divs[i].contentEditable == 'true'){
            if (divs[i].lang.toLowerCase() == 'ps-af') {
                new pashto_keyboard.KeyObject(divs[i]);
            }
        }
    }
}

pashto_keyboard.key_downed = function(e) {
    if (e.key == 'Shift')
        shift_is_pressed = true;

    if (e.ctrlKey)
        ctrl_is_pressed = true;
}

pashto_keyboard.key_up = function(e) {
    if (e.key == 'Shift')
        shift_is_pressed = false;

    if (e.ctrlKey)
        ctrl_is_pressed = false;
}

pashto_keyboard.KeyObject = function(input) {
    input.pashto = true;

    input.style.textAlign = "right";
    input.style.direction = "rtl";

    if(input.isContentEditable){
        input.style.float="left"
        // input.style.textAlign="right"
    }
    Convert = function(e) {
        if (!ctrl_is_pressed) {
            if (e == null)
                e = window.event;

            var eElement = e.target || e.originalTarget || e.srcElement;
            var key_code = e.charCode.toString();
            var pashto_char = null;

            if (shift_is_pressed)
                pashto_char = pashto_keyboard.pashto_code_and_characters["shift+" + key_code];
            else
                pashto_char = pashto_keyboard.pashto_code_and_characters[key_code];

            if (pashto_char != undefined) {
                if(!eElement.isContentEditable){
                    var text = $(eElement).val();
                    text = text.slice(0, eElement.selectionStart) + pashto_char + text.slice(eElement.selectionEnd);    
                    var caretPos = eElement.selectionStart + 1;
                    $(eElement).val(text)
                    eElement.focus();
                    eElement.setSelectionRange(caretPos, caretPos);
                }
                else{
                    text = eElement.textContent;
                    var selection_anchor_offset = window.getSelection().anchorOffset
                    var selection_focus_offset = window.getSelection().focusOffset
                    var ct_caretPos =  selection_anchor_offset + 1;

                    if (window.getSelection().toString() == text)
                        text = pashto_char
                    else if(selection_anchor_offset < selection_focus_offset)
                        text = text.slice(0, selection_anchor_offset) + pashto_char + text.slice(selection_focus_offset)
                    else
                        text = text.slice(0,selection_focus_offset) + pashto_char + text.slice(selection_anchor_offset) 
                        
                    eElement.textContent = text
                    var range = document.createRange();
                    var sel = window.getSelection();

                    if (selection_anchor_offset > selection_focus_offset)
                        ct_caretPos = selection_focus_offset + 1
                    else
                        ct_caretPos = selection_anchor_offset + 1

                    range.setStart(eElement.childNodes[0], ct_caretPos);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    eElement.focus();
                }

                if (e.preventDefault)
                    e.preventDefault();

                e.returnValue = false;
            }
            return true;
        }
    }

    input.onkeypress = Convert;
    input.onkeydown = pashto_keyboard.key_downed;
    input.onkeyup = pashto_keyboard.key_up;
}

if (window.attachEvent) {
    window.attachEvent('onload', pashto_keyboard.init)
} else if (window.addEventListener) {
    window.addEventListener('load', pashto_keyboard.init, false)
}