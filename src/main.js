import App from "./App.svelte";
import pubsub from "micro-pubsub";

let appApi = {
  Fuse: null,
  displayPalette: null,
  focusedElement: null,
  hotkeysGlobal: null,
};

class CommandPal {
  constructor(options) {
    if (options.debugOutput) { console.log("CommandPal", { options });}
    this.options = options || {};
    this.ps = pubsub.create();
  }

  start() {
    this.app = new App({
      target: document.body,
      props: {
        hotkey: this.options.hotkey || 'ctrl+space',
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        inputData: this.options.commands || [],
        paletteId: this.options.id || "CommandPal",
        placeholderText: this.options.placeholder || "What are you looking for?",
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        hideButton: this.options.hideButton || false,
        appApi: appApi,
      },
    });
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
