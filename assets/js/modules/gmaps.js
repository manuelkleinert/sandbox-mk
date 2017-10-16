(function gmaps(UIkit) {
  UIkit.component('gmaps', {

    name: 'gmaps',

    props: {
      apiKey: String,
      lat: Number,
      lng: Number,
      address: String,
      location: Object,
      geoLocation: Boolean,
      zoom: Number,
      zoomControl: Boolean,
      scrollWheel: Boolean,
      draggable: Boolean,
      mapTypeControl: Boolean,
      mapType: String,
      streetView: Boolean,
      showMarker: Boolean,
      markerIcon: String,
      markerAnimation: Boolean,
      markerTitle: String,
      markerContent: String,
      markerOpen: Boolean,
      markerToggle: Boolean,
      markerHover: Boolean,
      style: String,
      styledMap: String,
      centerLatLng: Object,
      overlayLatLng: Boolean,
      overlayImg: Boolean,
      ready: Object,
    },

    defaults: {
      apiKey: 'AIzaSyCWZ8cfcqoAGddyW3WO5lbCdwU2luJwbhc',
      lat: false,
      lng: false,
      address: 'Sandgruebestrasse 4, 6210 Sursee',
      location: false,
      geoLocation: false,
      zoom: 12,
      zoomControl: true,
      scrollWheel: true,
      draggable: true,
      mapTypeControl: true,
      mapType: 'roadmap', // roadmap, satellite, hybrid, terrain
      streetView: false,
      showMarker: true,
      markerIcon: false,
      markerAnimation: false,
      markerContent: '<strong>Wochen Pass AG</strong><br>Sandgruebestrasse 4<br>6210 Sursee',
      markerOpen: true,
      markerToggle: false,
      markerHover: false,
      style: [],
      centerLatLng: false,
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
          this.markerObjectList = [];
          this.mapObj = this.$el[0];
          this.loadMap();
        }
      },

      // Load API
      loadMap() {
        const self = this;

        if (document.querySelectorAll('script[src^="https://maps.googleapis.com/maps/api/js?key"]').length === 0) {
          // Google Map is Ready
          window.mapsCallback = function () {
            if (typeof google === 'object' && typeof google.maps === 'object') {
              self.setLocation(self.setMap);

              // set Event for Second map init
              if (window.CustomEvent) {
                const event = new CustomEvent('gmapsReady', {
                  detail: 'GoogleMaps ready',
                });
                document.dispatchEvent(event);
              } else {
                const event = document.createEvent('CustomEvent');
                event.initCustomEvent('gmapsReady', true, true, {
                  detail: 'GoogleMaps ready',
                });
                document.dispatchEvent(event);
              }
            }
          };

          const googleScript = document.createElement('script');
          googleScript.setAttribute('type', 'text/javascript');
          googleScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=mapsCallback`);
          document.getElementsByTagName('head')[0].appendChild(googleScript);
        } else {
          const gmapInitFn = function () {
            console.log(self.mapObj);
            self.setLocation(self.setMap);
          };
          document.addEventListener('gmapsReady', gmapInitFn, false);
        }
      },

      setLocation(fn) {
        const self = this;

        const setLocationFn = function (pos) {
          if (pos) {
            self.location = pos;
            self.lat = self.location.lat();
            self.lng = self.location.lng();

            if (fn) {
              fn();
            }
          } else {
            console.log('no location');
          }
        };

        if (this.location) {
          setLocationFn(this.location);
          // Geo Daten
        } else if (this.geoLocation) {
          this.getLocationByGeolocation(setLocationFn);
          // Addresse
        } else if (this.address) {
          this.getLocationByAddress(this.address, setLocationFn);
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
            fn(pos);
          } else {
            console.log('GPS inaccurate!');
            self.getLocationByAddress(self.address, fn, false);
          }
        };

        const currentPosFn = function () {
          console.log('GPS is not active');
          self.getLocationByAddress(self.address, fn);
        };

        if (navigator.geolocation && fn) {
          navigator.geolocation.getCurrentPosition(
            currentPosGeoFn,
            currentPosFn,
            { timeout: 8000 },
          );
        } else if (fn) {
          console.log('No GPS!');
          self.getLocationByAddress(self.address, fn);
        } else {
          console.log('GPS: no function');
        }
      },

      // Location by Adress
      getLocationByAddress(addressString, fn) {
        if (fn) {
          const self = this;
          this.geocoder = new google.maps.Geocoder();

          const locationFn = function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              fn(results[0].geometry.location);
            } else {
              fn(new google.maps.LatLng(self.lat, self.lng));
            }
          };

          this.geocoder.geocode(
            { address: addressString },
            locationFn,
          );
        } else {
          console.log('Address: no function');
        }
      },

      // Set Location by Lat / Lon
      getLocationByLatLng(lat, lng, fn) {
        if (fn) {
          fn(new google.maps.LatLng(lat, lng));
        } else {
          console.log('LatLng: no function');
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

        // Set Center Markter
        this.setMarker({
          location: this.location,
          showMarker: this.showMarker,
          markerIcon: this.markerIcon,
          markerContent: this.markerContent,
          markerOpen: this.markerOpen,
          disableAutoPan: false,
        });

        // Ready Function
        if (this.ready) {
          this.ready();
        }
      },

      // Set Google Maps Style
      setStyle() {
        if (this.style) {
          this.styledMap = new google.maps.StyledMapType(JSON.parse(this.style), { name: 'Custom Style' });
          this.map.mapTypes.set('map_style', this.styledMap);
          this.map.setMapTypeId('map_style');
        }
      },

      // Add Marker
      setMarker(config) {
        const markerCustom = {
          obj: false,
          location: false,
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
          isOpen: false,
        };

        const marker = Object.assign({}, markerCustom, config);

        marker.obj = new google.maps.Marker({
          position: marker.location,
          icon: marker.markerIcon ? marker.markerIcon : google.maps.Icon,
          animation: this.markerAnimation ? google.maps.Animation.DROP : false,
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
            marker.isOpen = true;
          };

          const markerCloseFn = function () {
            marker.infowindow.close();
            marker.isOpen = false;
          };

          const markserClickToggleFn = function () {
            if (marker.isOpen) {
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

        this.markerObjectList.push(marker);
      },

      getMarkerList() {
        return this.markerObjectList;
      },
    },
  });
}(UIkit));
