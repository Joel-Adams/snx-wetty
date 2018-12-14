var term;
var socket = io(location.origin, {path: '/wetty/socket.io'})
var buf = '';
var s7d_colours = {
  'base03': '#002b36',
  'base02': '#073642',
  'base01': '#586e75',
  'base00': '#657b83',
  'base000': '#46565b',
  'base0': '#839496',
  'base1': '#93a1a1',
  'base2': '#eee8d5',
  'base3': '#fdf6e3',
  'base4': '#f2f4f4',
  'yellow': '#b58900',
  'orange': '#cb4b16',
  'red': '#dc322f',
  'magenta': '#d33682',
  'violet': '#6c71c4',
  'blue': '#268bd2',
  'cyan': '#2aa198',
  'green': '#859900'
};

function Wetty(argv) {
    this.argv_ = argv;
    this.io = null;
    this.pid_ = -1;
}

Wetty.prototype.run = function() {
    this.io = this.argv_.io.push();

    this.io.onVTKeystroke = this.sendString_.bind(this);
    this.io.sendString = this.sendString_.bind(this);
    this.io.onTerminalResize = this.onTerminalResize.bind(this);
}

Wetty.prototype.sendString_ = function(str) {
    socket.emit('input', str);
};

Wetty.prototype.onTerminalResize = function(col, row) {
    socket.emit('resize', { col: col, row: row });
};

socket.on('connect', function() {
    lib.init(function() {
        hterm.defaultStorage = new lib.Storage.Local();
        term = new hterm.Terminal();
        window.term = term;
        term.decorate(document.getElementById('terminal'));

        term.setCursorPosition(0, 0);
        term.setCursorVisible(true);
        term.prefs_.set('ctrl-c-copy', true);
        term.prefs_.set('ctrl-v-paste', true);
        term.prefs_.set('use-default-window-copy', true);

	// Disable bold
        term.prefs_.set('enable-bold', true);
        term.prefs_.set('enable-bold-as-bright', false);

        // Use ANSI 16 colour terminal
        term.prefs_.set('environment', {
          "TERM": "xterm-color"
        });

        // Get some cool monospaced fonts
        term.prefs_.set('user-css', 'http://fonts.googleapis.com/css?family=Ubuntu+Mono|Droid+Sans+Mono|Source+Code+Pro|Anonymous+Pro');

        // Solarized Light
        term.prefs_.set('background-color', s7d_colours.base4);
        term.prefs_.set('foreground-color', s7d_colours.base000);
        term.prefs_.set('cursor-color', s7d_colours.base03);
        term.prefs_.set('color-palette-overrides', [s7d_colours.base2, s7d_colours.red, s7d_colours.green, s7d_colours.yellow, s7d_colours.blue, s7d_colours.magneta, s7d_colours.cyan, s7d_colours.base02, s7d_colours.base03, s7d_colours.orange, s7d_colours.base1, s7d_colours.base0, s7d_colours.base00, s7d_colours.violet, s7d_colours.base01, s7d_colours.base03]);

        // Automagically loaded from Google Fonts
        // Choose ONE of the blocks below to select a font
        // term.prefs_.set('font-family', '"Ubuntu Mono", monospace');
        term.prefs_.set('font-family', '"Droid Sans Mono", monospace');
        // term.prefs_.set('font-family', '"Source Code Pro", monospace');
        // term.prefs_.set('font-family', '"Anonymous Pro", monospace');

        term.runCommandClass(Wetty, document.location.hash.substr(1));
        socket.emit('resize', {
            col: term.screenSize.width,
            row: term.screenSize.height
        });

        if (buf && buf != '')
        {
            term.io.writeUTF16(buf);
            buf = '';
        }
    });
});

socket.on('output', function(data) {
    if (!term) {
        buf += data;
        return;
    }
    term.io.writeUTF16(data);
});

socket.on('disconnect', function() {
    console.log("Socket.io connection closed");
});
