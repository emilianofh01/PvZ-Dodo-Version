import { BroadcasterKey, InputBroadcaster } from './broadcasting.ts';

export enum KeyboardEventType {
  DOWN,
  UP,
  PRESSED,
}

export class KeyboardEventData {
  readonly type: KeyboardEventType;

  readonly alt: boolean;

  readonly ctrl: boolean;

  readonly code: KeyCode;

  readonly timestamp: DOMHighResTimeStamp;

  readonly repeat: boolean;

  readonly shift: boolean;

  readonly location: KeyLocation;

  static of(type: KeyboardEventType, event: KeyboardEvent) {
    return new KeyboardEventData(
      type,
      event.altKey,
      event.ctrlKey,
      event.code as KeyCode,
      performance.now(),
      event.repeat,
      event.shiftKey,
      event.location as KeyLocation,
    );
  }

  constructor(
    type: KeyboardEventType,
    alt: boolean,
    ctrl: boolean,
    code: KeyCode,
    timestamp: DOMHighResTimeStamp,
    repeat: boolean,
    shift: boolean,
    location: KeyLocation,
  ) {
    this.type = type;
    this.alt = alt;
    this.ctrl = ctrl;
    this.code = code;
    this.timestamp = timestamp;
    this.repeat = repeat;
    this.shift = shift;
    this.location = location;
  }
}

export const KEYBOARD: BroadcasterKey<KeyboardEventData> = BroadcasterKey.make(KeyboardEventData);

enum KeyLocation {
  DOM_KEY_LOCATION_STANDARD = 0,
  DOM_KEY_LOCATION_LEFT = 1,
  DOM_KEY_LOCATION_RIGHT = 2,
  DOM_KEY_LOCATION_NUMPAD = 3,
}

type KeyCode = 'Unidentified' | 'Pause' | 'Backspace' | 'Tab' | 'NumLock' | 'Enter' | 'ShiftLeft' | 'ShiftRight' | 'ControlLeft' | 'ControlRight' | 'AltLeft' | 'AltRight' | 'CapsLock' | 'Lang1' | 'Lang2' | 'Escape' | 'Space' | 'Numpad9' | 'Numpad3' | 'Numpad1' | 'Numpad7' | 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'F13' | 'Numpad0' | 'NumpadDecimal' | 'Digit0' | 'Digit1' | 'Digit2' | 'Digit3' | 'Digit4' | 'Digit5' | 'Digit6' | 'Digit7' | 'Digit8' | 'Digit9' | 'Period' | 'Semicolon' | 'Backquote' | 'Equal' | 'Minus' | 'KeyA' | 'KeyB' | 'KeyC' | 'KeyD' | 'KeyE' | 'KeyF' | 'KeyG' | 'KeyH' | 'KeyI' | 'KeyJ' | 'KeyK' | 'KeyL' | 'KeyM' | 'KeyN' | 'KeyO' | 'KeyP' | 'KeyQ' | 'KeyR' | 'KeyS' | 'KeyT' | 'KeyU' | 'KeyV' | 'KeyW' | 'KeyX' | 'KeyY' | 'KeyZ' | 'MetaLeft' | 'MetaRight' | 'ContextMenu' | 'Numpad2' | 'Numpad4' | 'Numpad5' | 'Numpad6' | 'Numpad8' | 'NumpadMultiply' | 'NumpadAdd' | 'NumpadSubtract' | 'NumpadDivide' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12' | 'F14' | 'F15' | 'F16' | 'F17' | 'F18' | 'F19' | 'F20' | 'F21' | 'F22' | 'F23' | 'F24' | 'F25' | 'F26' | 'F27' | 'F28' | 'F29' | 'F30' | 'F31' | 'F32' | 'ScrollLock' | 'BracketLeft' | 'BracketRight' | 'Backslash' | 'Quote' | 'MediaTrackNext' | 'MediaTrackPrevious' | 'VolumeMute' | 'VolumeDown' | 'VolumeUp' | 'Comma' | 'Slash' | 'IntlBackslash' | 'IntlRo' | 'NumpadComma' | 'OSLeft' | 'WakeUp';

export class KeyboardBroadcaster implements InputBroadcaster<KeyboardEventData> {
  public readonly key: BroadcasterKey<KeyboardEventData> = KEYBOARD;

  public callbacks: Set<(event: KeyboardEventData) => void | boolean> = new Set();

  keydown = (event: KeyboardEvent) => {
    this.dispatchEvent(KeyboardEventData.of(KeyboardEventType.DOWN, event));
  };

  keyup = (event: KeyboardEvent) => {
    this.dispatchEvent(KeyboardEventData.of(KeyboardEventType.UP, event));
  };

  keypress = (event: KeyboardEvent) => {
    this.dispatchEvent(KeyboardEventData.of(KeyboardEventType.PRESSED, event));
  };

  attach(_: HTMLCanvasElement): void {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
    document.addEventListener('keypress', this.keypress);
  }

  detach(_: HTMLCanvasElement): void {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
    document.removeEventListener('keypress', this.keypress);
  }

  addEventListener(callback: (event: KeyboardEventData) => void | boolean): void {
    this.callbacks.add(callback);
  }

  dispatchEvent(event: KeyboardEventData): boolean {
    let d = false;
    this.callbacks.forEach(e => e(event) && (d = true));
    return d;
  }

  removeEventListener(callback: (event: KeyboardEventData) => void | boolean): void {
    this.callbacks.delete(callback);
  }
}
