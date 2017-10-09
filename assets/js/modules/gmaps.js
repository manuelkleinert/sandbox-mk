(function gmaps(UIkit) {
  UIkit.component('gmaps', {
    name: 'gmaps',

    props: {
      map: Object,
      mapObj: Object,
      apiKey: String,
      lat: Number,
      lng: Number,
      address: String,
      location: Object,
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
      markerIcon: String,
      markerTitle: String,
      markerContent: Boolean,
      markerOpen: Boolean,
      markerToggle: Boolean,
      markerHover: Boolean,
      style: String,
      styledMap: String,
      center: Boolean,
      overlayLatLng: Boolean,
      overlayImg: Boolean,
      ready: Object,
    },

    defaults: {
      map: false,
      mapObj: false,
      apiKey: 'AIzaSyCWZ8cfcqoAGddyW3WO5lbCdwU2luJwbhc',
      lat: false,
      lng: false,
      address: false,
      location: false,
      top: 0,
      left: 0,
      zoom: 12,
      zoomControl: true,
      scrollWheel: true,
      draggable: true,
      mapTypeControl: true,
      mapType: 'ROADMAP',
      streetView: false,
      showMarker: true,
      markerIcon: false,
      markerTitle: false,
      markerContent: false,
      markerOpen: false,
      markerToggle: false,
      markerHover: false,
      style: false,
      center: true,
      overlayLatLng: false,
      overlayImg: false,
      ready: false,
    },

    connected() {
      this.initialize();
    },

    methods: {
      initialize() {
        if (!this.mapObj) {
          this.mapObj = this.$el[0];
          this.loadMap();
        }
      },

      // Load API
      loadMap() {
        // window:googleMapsLoad = function{
        //   console.log('load');
        // };

        const googleScript = document.createElement('script');
        googleScript.setAttribute('type', 'text/javascript');
        googleScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=googleMapsLoad`);
        document.getElementsByTagName('head')[0].appendChild(googleScript);
      },

      // Set Map
      setMap() {
        if (typeof window.google !== 'undefined') {
          this.mapOptions = {
            zoomControl: this.zoomControl,
            mapTypeControl: this.mapTypeControl,
            streetViewControl: this.streetView,
            draggable: this.draggable,
            scrollwheel: this.scrollWheel,
            zoom: this.zoom,
            center: this.location,
            mapTypeId: `google.maps.MapTypeId.${this.mapType}`,
          };

          this.map = new window.google.maps.Map(this.mapObj, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          });

          // this.map = new google.maps.Map(this.obj, this.mapOptions);
          // this.directionsDisplay.setMap(this.map);

          // Set Style
          // this.setStyle();

          // Ready Function
          // if (this.ready) {
          //   this.ready();
          // }

          // Set Center Markter
          // this.setMarker({
          //   lat: this.lat,
          //   lng: this.lng,
          //   top: this.top,
          //   left: this.left,
          //   find: false,
          //   address: false,
          //   showMarker: this.showMarker,
          //   markerIcon: this.markerIcon,
          //   markerTitle: this.markerTitle,
          //   markerContent: this.markerContent,
          //   markerOpen: this.markerOpen,
          //   disableAutoPan: false,
          // });
        } else {
          console.log('test');
        }
      },
    },
  });
}(UIkit));
