(function gmaps($, UIkit) {
  UIkit.component('gmaps', {

    name: 'gmaps',

    props: {
      map: Object,
      api: [String, Boolean],
      lat: Number,
      lng: Number,
      address: String,
      geoLocation: [Object, Boolean],
      top: Number,
      left: Number,
      zoom: Number,
      zoomControl: Boolean,
      scrollWheel: Boolean,
      draggable: Boolean,
      mapTypeControl: Boolean,
      mapType: String,
      streetView: Boolean,
      showMarker: Boolean,
      markerIcon: [String, Boolean],
      markerTitle: [String, Boolean],
      markerContent: Boolean,
      markerOpen: Boolean,
      markerToggle: Boolean,
      markerHover: Boolean,
      style: [String, Boolean],
      center: Boolean,
      overlayLatLng: Boolean,
      overlayImg: Boolean,
      triggerObj: Object,
    },

    defaults: {
      map: Object,
      api: String,
      lat: Number,
      lng: Number,
      address: String,
      geoLocation: Object,
      top: Number,
      left: Number,
      zoom: Number,
      zoomControl: Boolean,
      scrollWheel: Boolean,
      draggable: Boolean,
      mapTypeControl: Boolean,
      mapType: String,
      streetView: Boolean,
      showMarker: Boolean,
      markerIcon:  [String, Boolean],
      markerTitle: [String, Boolean],
      markerContent: Boolean,
      markerOpen: Boolean,
      markerToggle: Boolean,
      markerHover: Boolean,
      style: [String, Boolean],
      center: Boolean,
      overlayLatLng: Boolean,
      overlayImg: Boolean,
      triggerObj: Object,
    },

    connected() {
      this.initialize();
    },

    methods: {
      initialize() {
        if (!this.canvas) {
          this.canvas = this.$el[0];
        }
      },

      setSize() {
        this.width = this.window.width();
        this.height = this.window.height();

        this.centerTop = this.height / 2;
        this.centerLeft = this.width / 6;

        this.canvas.width = this.window.width();
        this.canvas.height = this.window.height();
        this.canvas.style.width = `${this.window.width()}px`;
        this.canvas.style.height = `${this.window.height()}px`;
      },

      setBackground() {
        // Set Background
        this.ctxBg = this.canvas.getContext('2d');
        this.ctxBg.fillStyle = this.bgColor;
        this.ctxBg.fillRect(0, 0, this.width, this.height);

        // Set Top
        this.ctxTop = this.canvas.getContext('2d');
        this.ctxTop.beginPath();
        this.ctxTop.moveTo(0, 0);
        this.ctxTop.lineTo(this.width / 2, 0);
        this.ctxTop.lineTo(this.centerLeft, this.centerTop);
        this.ctxTop.lineTo(0, this.height / 4);
        this.ctxTop.lineWidth = 0;
        this.ctxTop.strokeStyle = this.bgTop;
        this.ctxTop.fillStyle = this.bgTop;
        this.ctxTop.fill();
        this.ctxTop.stroke();

        // Set Bottom
        this.ctxBottom = this.canvas.getContext('2d');
        this.ctxBottom.beginPath();
        this.ctxBottom.moveTo(0, this.height);
        this.ctxBottom.lineTo(0, this.height - (this.height / 4));
        this.ctxBottom.lineTo(this.centerLeft, this.centerTop);
        this.ctxBottom.lineTo(this.width / 2, this.height);
        this.ctxBottom.lineWidth = 0;
        this.ctxBottom.strokeStyle = this.bgBottom;
        this.ctxBottom.fillStyle = this.bgBottom;
        this.ctxBottom.fill();
        this.ctxBottom.stroke();

        // Set Left
        this.ctxLeft = this.canvas.getContext('2d');
        this.ctxLeft.beginPath();
        this.ctxLeft.moveTo(0, this.height / 4);
        this.ctxLeft.lineTo(this.centerLeft, this.centerTop);
        this.ctxLeft.lineTo(0, this.height - (this.height / 4));
        this.ctxLeft.lineWidth = 0;
        this.ctxLeft.strokeStyle = this.bgLeft;
        this.ctxLeft.fillStyle = this.bgLeft;
        this.ctxLeft.fill();
        this.ctxLeft.stroke();
      },
    },

    update: [
      {
        read() {
          this.setSize();
        },
        write() {
          this.setBackground();
        },
        events: ['load', 'resize'],
      },
    ],
  });
}(jQuery, UIkit));
