import App from "./App.svelte";
import pubsub from "micro-pubsub";
import { retrieveDisplayPaletteMethod } from "./displayMethod";

class CommandPal {
  constructor(options) {
    if (options.debugOutput) { console.log("CommandPal", { options });}
    this.options = options || {};
    this.ps = pubsub.create();

    // if function already defined follow the Beatles and Let It Be
    if (typeof(window.cp_hashFromString) === 'undefined') {
      if ( ! this.options.reportStyleHash ) {
	window.cp_hashFromString = async function (name, string) {return null}
      } else {
	window.cp_hashFromString = async function (name, string) {
	  if (typeof(crypto.subtle) !== 'object' ) {
	    return "Crypto.subtle not available are you using localhost or https?"
	  }
	  const hash = await crypto.subtle.digest(
	    "SHA-256",
	    (new TextEncoder()).encode(string))
	  let csp = "sha256-" + btoa(String.fromCharCode(
	    ...new Uint8Array(hash)));
	  return `${name} '${csp}'`;
	}
      }
    }
  }

  start() {
    this.app = new App({
      target: document.body,
      props: {
        debugOutput: this.options.debugOutput || false,
        hotkey: this.options.hotkey || 'ctrl+space',
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        inputData: this.options.commands || [],
        noButton: this.options.noButton || false,
        paletteId: this.options.paletteId || "CommandPalette",
        placeholderText: this.options.placeholder || "What are you looking for?",
        reportStyleHash: this.options.reportStyleHash || false,
        hotkeysGlobal: this.options.hotkeysGlobal || false,
	displayHints: this.options.displayHints || false,
      },
    });
    this.displayPalette = retrieveDisplayPaletteMethod();
    const ctx = this;
    function subTo(eventName) {
      ctx.app.$on(eventName, (e) => ctx.ps.publish(eventName, e.detail));
    }
    subTo("opened");
    subTo("closed");
    subTo("textChanged");
    subTo("exec");
    this.ps.subscribe("exec", (item) => {
      if (item.handler && typeof item.handler === "function") {
        item.handler();
      }
    });
  }

  subscribe(eventName, cb) {
    this.ps.subscribe(eventName, (e) => cb(e));
  }

  destroy() {
    this.app.$destroy()
  }
}

export default CommandPal;
window.CommandPal = CommandPal;
