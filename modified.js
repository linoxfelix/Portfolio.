function t(t) {
  // If `t` is an object with a `default` property, return that, otherwise return `t`
  return t && t.__esModule ? t.default : t;
}

// Initialize some variables
const e = {};
const i = function(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
};

// Define a class `t`
const VanillaTilt = class {
  constructor(element, options = {}) {
    // Throw an error if `element` is not a valid HTML node
    if (!(element instanceof Node)) {
      throw new Error(`Can't initialize VanillaTilt because ${element} is not a Node.`);
    }
    
    // Set some properties to `null` initially
    this.width = null;
    this.height = null;
    this.clientWidth = null;
    this.clientHeight = null;
    this.left = null;
    this.top = null;
    this.gammazero = null;
    this.betazero = null;
    this.lastgammazero = null;
    this.lastbetazero = null;
    this.transitionTimeout = null;
    this.updateCall = null;
    this.event = null;
    
    // Bind `this` to some functions
    this.updateBind = this.update.bind(this);
    this.resetBind = this.reset.bind(this);

    // Set some properties of the instance
    this.element = element;
    this.settings = this.extendSettings(options);
    this.reverse = this.settings.reverse ? -1 : 1;
    this.resetToStart = VanillaTilt.isSettingTrue(this.settings['reset-to-start']);
    this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
    this.glarePrerender = VanillaTilt.isSettingTrue(this.settings['glare-prerender']);
    this.fullPageListening = VanillaTilt.isSettingTrue(this.settings['full-page-listening']);
    this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
    this.gyroscopeSamples = this.settings.gyroscopeSamples;
    this.elementListener = this.getElementListener();
    if (this.glare) {
      this.prepareGlare();
    }
    if (this.fullPageListening) {
      this.updateClientSize();
    }
    this.addEventListeners();
    this.reset();
    if (this.resetToStart === false) {
      this.settings.startX = 0;
      this.settings.startY = 0;
    }
  }
  
  // Static method to check if a setting is true
  static isSettingTrue(setting) {
    return (setting === '' || setting === true || setting === 1);
  }
  
  // Get the element to listen for events on
  getElementListener() {
    if (this.fullPageListening) {
      return window.document;
    }
    if (typeof this.settings['mouse-event-element'] === 'string') {
      const el = document.querySelector(this.settings['mouse-event-element']);
      if (el) {
        return el;
      }
    }
    return (this.settings['mouse-event-element'] instanceof Node) ? this.settings['mouse-event-element'] : this.element;
  }

  // Add event listeners
  addEventListeners() {
    this.onMouseEnterBind = this.onMouseEnter.bind(this);
    this.onMouseMoveBind = this.onMouseMove.bind(this);
    this.onMouseLeaveBind = this.onMouseLeave.bind(this);
    this.onWindowResizeBind = this.onWindowResize.bind(this);
    this.onDeviceOrientationBind
