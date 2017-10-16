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
      markerList: Object,
      style: String,
      styledMap: String,
      centerLatLng: Object,
      overlayLatLng: Boolean,
      overlayImg: Boolean,
      ready: Object,
    },

    defaults: {
      apiKey: '',
      lat: false,
      lng: false,
      address: '6210 Sursee',
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
      markerContent: '',
      markerOpen: true,
      markerToggle: false,
      markerHover: false,
      markerList: false,
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
              self.getLocation(self.setMap, self.location, self.address, self.lat, self.lng);

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
            self.getLocation(self.setMap, self.location, self.address, self.lat, self.lng);
          };
          document.addEventListener('gmapsReady', gmapInitFn, false);
        }
      },

      getLocation(fn, location, address, lat, lng) {
        const getLocationFn = function (pos) {
          if (pos && fn) {
            fn(pos);
          } else {
            console.log('no location');
          }
        };

        if (location) {
          getLocationFn(location);
          // Geo Daten
        } else if (this.geoLocation) {
          this.getLocationByGeolocation(getLocationFn);
          // Addresse
        } else if (this.address) {
          this.getLocationByAddress(address, getLocationFn);
          // Lat und Lng
        } else if (this.lat && this.lng) {
          this.getLocationByLatLng(lat, lng, getLocationFn);
        } else {
          console.log('No location');
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
      setMap(pos) {
        this.location = pos;

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

        // Set Marker list
        this.setMarkerList();

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

      setMarkerList() {
        if (this.markerList) {
          const self = this;
          this.markerList = JSON.parse(this.markerList);

          const markerListFn = function (obj) {
            const setMarker = function (pos) {
              self.setMarker({
                location: pos,
                find: true,
                showMarker: obj.showMarker,
                markerOpen: obj.markerOpen,
                markerIcon: obj.markerIcon,
                markerContent: obj.markerContent,
                markerDiv: obj.markerDiv,
              });
            };

            self.getLocation(setMarker, obj.location, obj.address, obj.lat, obj.lng);
          };

          this.markerList.forEach(markerListFn);
          // console.log(this.markerList);
        }
      },

      getMarkerList() {
        return this.markerObjectList;
      },
    },
  });
}(UIkit));
