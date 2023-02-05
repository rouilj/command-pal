<h1 align="center" style="font-family: mono">command-pal</h1>
<p align="center">⌨ The hackable command palette for the web, inspired by <a href="https://github.com/microsoft/vscode">Visual Studio Code</a>.</p>
<div align="center">

<!-- [START badges] -->
[![NPM Version](https://img.shields.io/npm/v/command-pal.svg)](https://www.npmjs.com/package/command-pal) 
[![License](https://img.shields.io/npm/l/command-pal.svg)](https://github.com/benwinding/command-pal/blob/master/LICENSE) 
[![Downloads/week](https://img.shields.io/npm/dm/command-pal.svg)](https://www.npmjs.com/package/command-pal) 
[![Github Issues](https://img.shields.io/github/issues/benwinding/command-pal.svg)](https://github.com/benwinding/command-pal)
<!-- [END badges] -->

</div>

![screen cap](https://i.imgur.com/jhJjLVL.gif)

<div align="center">
  <i>Configure custom commands with custom keyboard shortcuts!</i>
</div>

## Demos

- [Demo Simple](https://benwinding.github.io/command-pal/demos/cp-simple)
- [Demo Advanced](https://benwinding.github.io/command-pal/demos/cp-advanced)
- [Demo Dynamic](https://benwinding.github.io/command-pal/demos/cp-dynamic)
- [Code Pen](https://codepen.io/benaloney/pen/BaobQmd)

## Benefit's of Command Palettes

- **Ease of use**
	- Simply 1 keyboard shortcut to remember
	- Fuzzy search allows you to find commands easily
- **Speed**
	- Keyboard makes it fast to access any command/function
	- Fuzzy search allows for quick ordering of commands
	- Efficient to find a commands that you used once a long time ago
- **Discoverability**
	- You can scroll down the entire list of commands
	- Find commands by simply searching the Command palette
	- Tips and functions can be given to you as you type

## Features

- JS framework agnostic (can be attached to any site)
- Keyboard first control (shortcuts configurable)
- Custom commands
- Dynamically Add/Remove commands
- Nested commands
- Fuzzy text matching (fuse.js)
- Themeable (theme-light.css and theme-dark.css included)
- Mobile friendly (button in bottom-left)

![screen cap](https://i.imgur.com/Bb6njpV.gif)

## Why?

_Command Palettes_ have alwyas impressed me with how easy they are to use and develop for. I rarely see them on the web platform, so I thought I'd give it a shot.

## Get Started

### Install

Either install from npm

`yarn add command-pal`

Or use the script tag

```html
<script src="https://cdn.jsdelivr.net/npm/command-pal"></script>
```

### Usage - Simple

``` js
const c = new CommandPal({
  hotkey: "ctrl+space",
  commands: [
    {
      name: "Send Message",
      shortcut: "ctrl+m",
      handler: () => alert("Send Message"),
    },
    {
      name: "Search Contacts",
      handler: () => alert("Searching contacts..."),
    },
    {
      name: "Goto Profile",
      shortcut: "ctrl+4",
      handler: () => window.location.hash = "profile",
    },
  ],
});
c.start();
```

### Usage - Avanced

``` js
const c = new CommandPal({
  hotkey: "ctrl+space",
  placeholder: "Custom placeholder text...",
  commands: [
    {
      name: "Change Language",
      children: [
        {
          name: "English",
          handler: () => alert("Changing to English")
        },
        {
          name: "Spanglish",
          handler: () => alert("Changing to Spanglish")
        }
      ]
    },
    {
      name: "Goto About",
      handler: () => window.location.hash = "about",
    },
  ],
});
c.start();
```

## API

### CommandPal instance
``` js
const c = new CommandPal({
  hotkey: "ctrl+space",  // Launcher shortcut
  hotkeysGlobal: true,       // Makes shortcut keys work in any <textarea>, <input> or <select>
  paletteId: "CommandPalette", // adds unique ID to aid in targeting with CSS
  placeholder: "Custom placeholder text...", //  Changes placeholder text of input
  debugOuput: false, // if true report debugging info to console
  reportStyleHash: false // if true, report the id and sha256 hashes
                         // of the svelt inlined style blocks. The hashes
                         // can be added to the CSP (Content Security Policy)
                         // style-src or default-src if your app uses them.
                         // Requires a modified svelt/internal/index.mjs
                         // append() function.
  noButton: false, // if true, do not generate mobile button

  commands: [
    // Commands go here
  ]
});
// Start the instance
c.start()
// Destroy the instance
c.destroy()
// Display the instance
c.displayPalette(true)
// Hide the instance
c.displayPalette(false)
// Toggle from display -> hide or hide -> display
c.displayPalette()
```

### Subscribe to events
There's a few events that can be subscribed to during command-pal's execution.

``` js
// When a command is executed
c.subscribe("exec", (e) => { console.log("exec", { e }); });
// On TextChanged
c.subscribe("textChanged", (e) => { console.log("textChanged", { e }); });
// When a command palette is opened
c.subscribe("opened", (e) => { console.log("opened", { e }); });
// When a command palette is closed
c.subscribe("closed", (e) => { console.log("closed", { e }); });
```

### Command Item

``` js
{
  // Required name of command (displayed)
  name: "Open Messages",
  // Required name of command (displayed)
  description: "View all messages in inbox",
  // HTML string to display an icon e.g. for </>
  icon: "<span class="icon">&lt;/&gt;</span>",
  // Shortcut of command
  shortcut: "ctrl+3",
  // Callback function of the command to execute
  handler: (e) => {
    // DO SOMETHING
  }
  // Child commands which can be executed
  children: [...]
},
```

#### Adding Icons

The `icon` property is interpreted as HTML and used as a 24x24 icon to
the left of the menu item.

If the icon property is not provided, an empty svg will be
generated. This keeps the commands aligned when only some commands
have icons. To remove/hide the empty svg, add `svg.cp-placeholder {
display: none; }` to your CSS. This will move all commands without an
icon property flush to the left of the list box.

The icon property can be set to `null`. In this case, no placeholder
icon will be generated. This will move the command flush to the left
of the list box.

If the icon property is set to a string, it is inserted as is into the
list box. You can insert characters as the icon (make sure to use
entities for characters like `<`).  Use `&nbsp;` to left pad the
character strings as needed. You should wrap the string in `<span
class="icon">` and `</span>` tags. This truncates the string at 24px
matching alignment with svg or img icons.

You can also include an `svg` or an `img` tag. For svg tags, you may
want to use CSS styling to set the `fill` property to `currentcolor`
so the svg strokes match the text color.

### Command Item Child

Note: Child commands cannot have shortcuts.

``` js
{
  // Required name of command (displayed)
  name: "Open Messages",
  // Required name of command (displayed)
  description: "View all messages in inbox",
  // Callback function of the command to execute
  handler: (e) => {
    // DO SOMETHING
  }
},
```

### Add/Remove Command's At Runtime

The command list is an observed array, which means you can modify it even after it's instantiated. The following snippet shows how commands can be dynamically added during runtime.

``` js
const commands = [
  {
    name: "Add Command to List",
    handler: () => {
      commands.push({
        name: 'New Command',
        handler: () => {
          // Do something
        },
      });
    },
  },
];
const c = new CommandPal({
  hotkey: "ctrl+space",
  commands: commands,
});
c.start();
```

### Styling CommandPal instances

The styles used by command-pal are included in the package, but you
can override these. To make this easier, command-pal adds HTML id's to
a few components.

   * The whole palette is identified by `CommandPalette`.
   * The mobile button inside `#CommandPalette` is identified by
     `CommandPalette-button`.
   * Lastly the mask/backdrop for the palette inside `#CommandPalette`
     is identified by `CommandPalette-mask`.
     
The `CommandPalette` part of the id's can be set using the `paletteId`
option to `CommandPal()`.

Using this you can assign different backgrounds to different instances
of command-pal. For example:
```css
  #mypal-button { top: 30px; bottom: auto;} 
  #mypal-mask { background-color: rgb(255,255,0,0.75); }
  #mypal [slot=items] { background-color: red}
```
along with:
```
   c = CommandPal(..., paletteId: 'mypal',)
```

will result in:

   * the mobile button for the palette will be moved 30 pixels from
     the top rather than 10px from the bottom.
   * the backdrop will be yellow at 75% opacity rather than
     black at 50% opacity.
   * the background for the unselected/unhovered items on the command
     list will be red.

The `-button` and `-mask` ids are a shortcut. This is also valid:
```css
  /* mypal-button */
  #mypal > button  { top: 30px; bottom: auto;}
  /* mypal-mask */
  #mypal > div.modal-mask { background-color: rgb(0,128,200,0.75); }
  #mypal [slot=items] { background-color: yellow;}
  #mypal .item {color:black;} /* color of text against yellow background */
```
but is more difficult to use and depends on the structure of the HTML
more than using ids.

## Local Development

To develop on `command-pal` simply clone, install and run

```
npm run dev
```
Then the following link:

- http://localhost:5005/cp-advanced/local-dev.html

When the search input loses focus (receives a blur event), the palette
closes. This makes inspecting the palette using the browser's DevTools
difficult, as switching to DevTools causes the focus to be lost. It is
possible to stop the palette from closing when focus is lost. If you
set `window.commandPalIgnoreBlur = true;` using the console, or in
your JavaScript, it will stop the palette from closing.  To close the
command palette, click/focus on the search input and type the `ESC`
key. Running `delete(window.commandPalIgnoreBlur);` in the DevTools
console will restore the normal close palette action.

Have a go, PR's and issues always welcome.

## Prior Art
Many applications have implemented this before, here's a few. My favourite implementation is the VScode, which is the main influence for this project.

**Editors**

- [VScode (Text Editor)](https://code.visualstudio.com/docs/getstarted/tips-and-tricks#_command-palette)
- [Sublime (Text Editor)](https://www.sublimetext.com/)
- [Atom (Text Editor)](https://atom.io/packages/command-palette)
- [Webstorm's Search Everywhere (IDE)](https://www.jetbrains.com/help/webstorm/searching-everywhere.html?search=search)
- [Caret (Markdown Editor)](https://caret.io/v2)
- [Commander (Eclipse Plugin)](https://github.com/dakaraphi/eclipse-plugin-commander#kavi-implemented-features-for-all-interfaces)

**Misc**

- [Fman (File Manager)](https://fman.io/)
- [Plotinus (GTK desktop extension)](https://github.com/p-e-w/plotinus)
- [command-palette (Wordpress Extension)](https://wordpress.org/plugins/command-palette/)
- [Vimium (Browser Extension)](https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb)
- [JupyterLab (Notebook)](https://jupyterlab.readthedocs.io/en/stable/user/commands.html)
