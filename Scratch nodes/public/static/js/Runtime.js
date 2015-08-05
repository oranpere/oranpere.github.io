// Copyright (C) 2013 Massachusetts Institute of Technology
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 2,
// as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

// Scratch HTML5 Player
// Runtime.js
// Tim Mickel, July 2011

// Runtime takes care of the rendering and stepping logic.

'use strict';

var Runtime = function () {
    this.mouseDown = false;
    this.mousePos = [0, 0];
    this.audioContext = null;
    this.audioGain = null;
    this.audioPlaying = [];
    this.notesPlaying = [];
};

// Initializer for the drawing and audio contexts.
Runtime.prototype.init = function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    try {
        this.audioGain = this.audioContext.createGain();
    } catch (err) {
        this.audioGain = this.audioContext.createGainNode();
    }
    this.audioGain.connect(runtime.audioContext.destination);
};

