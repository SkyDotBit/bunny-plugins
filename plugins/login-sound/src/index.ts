// I made this code really messy because I was in a rush - Sky.Bit
import { ReactNative } from "@vendetta/metro/common"
import { storage } from "@vendetta/plugin";
import Settings from "./Settings";
import { MobileAudioSound } from './deps'; // Thank you Nexpid for this <3
const { DCDSoundManager } = ReactNative.NativeModules;

export const settings: {
    customUrl?: string
} = storage

const soundUrl = settings.customUrl ? settings.customUrl : "https://raw.githubusercontent.com/Rico040/meine-themen/master/sounds/discordo-discord.mp3";
const soundId = 6970;
let soundDuration = -1;
let notificationSound = new MobileAudioSound(
    'https://raw.githubusercontent.com/Rico040/meine-themen/master/sounds/discordo-discord.mp3',  
    'media',                                  
    1.0,                                             
    {
      onPlay: () => console.log('Audio started playing'),
      onStop: () => console.log('Audio stopped'),
      onEnd: () => console.log('Audio finished'),
      onLoad: (loaded) => console.log('Audio loaded:', loaded),
    }
  );
// Function to prepare the sound
const prepareSound = () =>
    new Promise((resolve) => {
      console.log("Hi");
      if (storage.ignoreSilent ?? false) {
        if (storage.customUrl) {
          console.log("There is a custom URL")
          let notificationSound = new MobileAudioSound(
            storage.customUrl,  
            'media',                                  
            1.0,                                             
            {
              onPlay: () => console.log('Audio started playing'),
              onStop: () => console.log('Audio stopped'),
              onEnd: () => console.log('Audio finished'),
              onLoad: (loaded) => console.log('Audio loaded:', loaded),
            }
          );
        }
      
      } else {
        DCDSoundManager.prepare(soundUrl, "notification", soundId, (_, meta) =>
          resolve(meta)
        );
      }
    });

// Variables to manage sound playback state
let timeoutId = null;
async function playSoundsil() {
    notificationSound.play();
  }
let isPlaying = false;
function playSounds() {
    prepareSound()
    if (storage.ignoreSilent ?? false) {
      playSoundsil()
    } else {
      playSound()
    }
  }
// Function to play the sound, thanks to moyai obfuscated code
let playingTimeout: number | null = null;
let playing = false;
let SOUND_DURATION = -1;
async function playSound() {
    if (playing) {
      if (playingTimeout != null) clearTimeout(playingTimeout);
      DCDSoundManager.stop(soundId);
      playing = false;
    }
    playing = true;
    await DCDSoundManager.play(soundId);
    
      setTimeout(() => {
      playing = false;
      DCDSoundManager.stop(soundId);
      playingTimeout = null;
    }, SOUND_DURATION);
  }
let isPrepared = false;

export default {
    onLoad: () => {
        if (!isPrepared) {
            prepareSound().then(function (sound) {
                isPrepared = true;
                //@ts-ignore
                soundDuration = sound.duration;
                playSounds()
            })
        }
    },
    settings: Settings
}