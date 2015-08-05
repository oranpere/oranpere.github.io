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

'use strict';


var playDrum = function(drum, secs, client) {
    var player = SoundBank.getDrumPlayer(drum, secs);
    player.client = client;
    player.setDuration(secs);
    var source = runtime.audioContext.createScriptProcessor(4096, 1, 1);
    source.onaudioprocess = function(e) { player.writeSampleData(e); };
    source.soundPlayer = player;
    source.connect(runtime.audioGain);
    runtime.notesPlaying.push(source);
    source.finished = function() {
        var i = runtime.notesPlaying.indexOf(source);
        if (i > -1 && runtime.notesPlaying[i] != null) {
            runtime.notesPlaying.splice(i, 1);
        }
    }
    window.setTimeout(source.finished, secs * 1000);
    return player;
};

var playSound = function(snd) {
    if (snd.source) {
        // If this particular sound is already playing, stop it.
        snd.source.disconnect();
        snd.source = null;
    }

    snd.source = runtime.audioContext.createBufferSource();
    snd.source.buffer = snd.buffer;
    snd.source.connect(runtime.audioGain);

    // Track the sound's completion state
    snd.source.done = false;
    snd.source.finished = function() {
        // Remove from the active audio list and disconnect the source from
        // the sound dictionary.
        var i = runtime.audioPlaying.indexOf(snd);
        if (i > -1 && runtime.audioPlaying[i].source != null) {
            runtime.audioPlaying[i].source.done = true;
            runtime.audioPlaying[i].source = null;
            runtime.audioPlaying.splice(i, 1);
        }
    }
    window.setTimeout(snd.source.finished, snd.buffer.duration * 1000);
    // Add the global list of playing sounds and start playing.
    runtime.audioPlaying.push(snd);
    snd.source.start();
    return snd.source;
};