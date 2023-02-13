import App from "./App.svelte";
import pubsub from "micro-pubsub";
import { retrieveDisplayPaletteMethod } from "./displayMethod";

let appApi = {
  Fuse: null,
  displayPalette: null,              // cp.display()
  focusedElement: null,              // cp.focusedElement set/get
  focusedElementFocusVisible: null,  // not exposed by CommandPal.
  hotkeysGlobal: null,               // cp.hotkeysGlobal()
};

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
        // # of consecutive backspaces to exit. 0: don't exit on backspace.
        backspaceCloseCount: this.options.backspaceCloseCount || 0,
        debugOutput: this.options.debugOutput || false,
        displayHints: this.options.displayHints || false,
        footerText: this.options.footerText ||  null,
        hideButton: this.options.hideButton || false,
        hotkey: this.options.hotkey || 'ctrl+space',
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        inputData: this.options.commands || [],
        orderedCommands: this.options.orderedCommands || false,
        paletteId: this.options.id || "CommandPal",
        placeholderText: this.options.placeholder || "What are you looking for?",
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        hideButton: this.options.hideButton || false,
        displayHints: this.options.displayHints || false,
        orderedCommands: this.options.orderedCommands || false,
        debugOutput: this.options.debugOutput || false,
        headerText: this.options.headerText || null,
        appApi: appApi,
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
    // only allow access to appApi if debugging is turned on
    if (! this.options.debugOutput) { delete(this.appApi);}

  }

  subscribe(eventName, cb) {
    this.ps.subscribe(eventName, (e) => cb(e));
  }

  destroy() {
    this.app.$destroy()
  }

  display(state) { appApi.displayPalette(state) }
  
  /* use setter/getter on (virtual) property */
  get focusedElement() {
    return appApi.focusedElement()
  }
  
  set focusedElement(newElement) {
    // try to make new focused element visible
    appApi.focusedElementFocusVisible.visible = true
    return appApi.focusedElement(newElement)
  }

  get Fuse() { return appApi.Fuse }

  // only available if debugOutput is defined
  appApi = appApi;

  hotkeysGlobal = (enable = true) => {
    appApi.hotkeysGlobal(enable);
  }
  
}

export default CommandPal;
window.CommandPal = CommandPal;
