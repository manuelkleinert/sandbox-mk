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
      geoLocation: Boolean,
      top: Number,
      left: Number,
      zoom: Number,
      zoomControl: Boolean,
      scrollWheel: Boolean,
      draggable: Boolean,
      mapTypeControl: Boolean,
      mapType: String,
      streetView: Boolean,
      markerList: Array,
      showMarker: Boolean,
      markerIcon: String,
      markerTitle: String,
      markerContent: String,
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
      address: 'Sursee',
      location: false,
      geoLocation: true,
      top: 0,
      left: 0,
      zoom: 12,
      zoomControl: true,
      scrollWheel: true,
      draggable: true,
      mapTypeControl: true,
      mapType: 'roadmap', // roadmap, satellite, hybrid, terrain
      streetView: false,
      markerList: [],
      showMarker: true,
      markerIcon: 'default',
      markerContent: 'Test',
      markerOpen: true,
      markerToggle: false,
      markerHover: false,
      style: [],
      center: true,
      overlayLatLng: false,
      overlayImg: false,
      ready: false,
    },

    connected() {
      console.log(this.markerContent);
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
        const self = this;

        window.mapsCallback = function () {
          if (typeof google === 'object' && typeof google.maps === 'object') {
            self.setLocation(self.setMap);
          }
        };

        const googleScript = document.createElement('script');
        googleScript.setAttribute('type', 'text/javascript');
        googleScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=mapsCallback`);
        document.getElementsByTagName('head')[0].appendChild(googleScript);
      },

      setLocation(fn) {
        const self = this;

        const setLocationFn = function (pos) {
          if (pos) {
            self.location = pos;
            self.lat = self.location.lat();
            self.lng = self.location.lng();
          }
          if (fn) {
            fn();
          }
        };

        // Geo Daten
        if (this.geoLocation) {
          this.getLocationByGeolocation(setLocationFn);
          // Adresse
        } else if (this.address) {
          this.getLocationByAdress(this.address, setLocationFn);
          // Lat und Lng
        } else {
          this.getLocationByLatLng(this.lat, this.lng, setLocationFn);
        }
      },

      // GPS ermitteln
      getLocationByGeolocation(fn) {
        const self = this;

        const currentPosGeoFn = function (position) {
          if (position.coords.accuracy < 500) {
            const pos = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude);
            self.location = pos;

            if (fn) {
              fn(position);
            }

            console.log('GPS');
          } else {
            console.log('GPS zu ungenau!');
            self.getLocationByAdress(self.address, fn, false);
          }
        };

        const currentPosFn = function () {
          console.log('GPS in ihrem Browser nicht Aktiviert!');
          self.getLocationByAdress(self.address, fn, false);
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            currentPosGeoFn,
            currentPosFn,
            { timeout: 8000 },
          );
        } else {
          console.log('GPS in ihrem Browser nicht Aktiviert!');

          if (fn) {
            fn(false);
          }
        }
      },

      // Location by Adress
      getLocationByAdress(addressString, fn, statusGPS) {
        const self = this;

        this.geocoder = new google.maps.Geocoder();

        const locationFn = function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            self.location = results[0].geometry.location;
          } else {
            self.location = new google.maps.LatLng(self.lat, self.lng);
          }

          if (statusGPS != null && fn) {
            fn(statusGPS);
          } else if (fn) {
            fn(self.location);
          }
        };

        this.geocoder.geocode(
          { address: addressString },
          locationFn,
        );
      },

      // Set Location by Lat / Lon
      getLocationByLatLng(lat, lng, fn) {
        const pos = new google.maps.LatLng(lat, lng);
        this.location = pos;

        if (fn) {
          fn(pos);
        }
      },

      // Set Map
      setMap() {
        this.mapOptions = {
          zoomControl: this.zoomControl,
          mapTypeControl: this.mapTypeControl,
          streetViewControl: this.streetView,
          draggable: this.draggable,
          scrollwheel: this.scrollWheel,
          zoom: this.zoom,
          center: this.location,
          mapTypeId: this.mapType,
        };

        this.map = new window.google.maps.Map(this.mapObj, this.mapOptions);
        // this.directionsDisplay.setMap(this.map);

        // Set Style
        this.setStyle();

        // Ready Function
        if (this.ready) {
          this.ready();
        }

        // Set Center Markter
        this.setMarker({
          location: this.location,
          top: this.top,
          left: this.left,
          find: false,
          address: false,
          showMarker: this.showMarker,
          markerIcon: this.markerIcon,
          markerTitle: this.markerTitle,
          markerContent: this.markerContent,
          markerOpen: this.markerOpen,
          disableAutoPan: false,
        });
      },

      // Set Google Maps Style
      setStyle() {
        if (this.style) {
          this.styledMap = new google.maps.StyledMapType(this.style, { name: 'Custom Style' });
          this.map.mapTypes.set('map_style', this.styledMap);
          this.map.setMapTypeId('map_style');
        }
      },

      // Add Marker
      setMarker(config) {
        const markerCustom = {
          obj: false,
          location: [],
          top: 0,
          left: 0,
          address: false,
          find: false,
          showMarker: true,
          markerOpen: false,
          markerIcon: false,
          markerContent: false,
          markerDiv: false,
          innerRadius: false,
          radiusDictance: false,
          disableAutoPan: true,
          infowindow: false,
          open: false,
        };

        const marker = Object.assign({}, markerCustom, config);

        marker.obj = new google.maps.Marker({
          position: marker.location,
          icon: marker.markerIcon,
          map: this.map,
        });

        if (marker.markerContent) {
          const markerContent = document.createElement('div');
          markerContent.className = 'infowindow';
          markerContent.innerHTML = marker.markerContent;

          marker.infowindow = new google.maps.InfoWindow({
            content: markerContent,
            disableAutoPan: this.disableAutoPan,
          });

          const markerOpenFn = function () {
            marker.infowindow.open(this.map, marker.obj);
            marker.open = true;
          };

          const markerCloseFn = function () {
            marker.infowindow.close();
            marker.open = false;
          };

          const markserClickToggleFn = function () {
            if (marker.open) {
              markerCloseFn();
            } else {
              markerOpenFn();
            }
          };

          if (marker.markerOpen) {
            markerOpenFn();
          }

          google.maps.event.addListener(marker.obj, 'click', markserClickToggleFn);

          if (this.markerToggle) {
            google.maps.event.addListener(marker.obj, 'mouseover', markerOpenFn);
            google.maps.event.addListener(marker.obj, 'mouseout', markerCloseFn);
          }
        }

        this.markerList.push(marker);
      },

      getMarkerList() {
        return this.markerList;
      },
    },
  });
}(UIkit));
