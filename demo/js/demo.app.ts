'use strict';

import { Component, Input, OnInit, AfterContentInit } from '@angular/core';
import { OfflineOptions, ControlAnchor, NavigationControlType } from '../../';

var tpl = <string>require('./demo.app.tpl');
var style = <string>require('./demo.app.style');

var prism: any = require('./prism');

var center1 = {
    longitude: 121.506191,
    latitude: 31.245554
};

var center2 = {
    longitude: 121.500885,
    latitude: 31.190032
};

var markers1 = [{
    longitude: 121.506191,
    latitude: 31.245554,
    title: 'Where',
    content: 'Put description here',
    autoDisplayInfoWindow: true
}];

var markers2 = [{
    longitude: 121.500885,
    latitude: 31.190032,
    enableDragging: true
}];

@Component({
    selector: 'map-presentation',
    template: tpl,
    styles: [style]
})
export class MainApp implements OnInit, AfterContentInit {

    opts: any;
    offlineOpts: OfflineOptions;
    privousCenter: Object = center1;
    privousMarkers: Object[] = markers1;
    display: boolean = true;

    ngOnInit() {
        this.opts = {
            center: center1,
            zoom: 17,
            markers: markers1,
            geolocationCtrl: {
                anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT
            },
            scaleCtrl: {
                anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_LEFT
            },
            overviewCtrl: {
                isOpen: true
            },
            navCtrl: {
                type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE
            }
        };

        this.offlineOpts = {
            retryInterval: 5000,
            txt: 'NO-NETWORK'
        };
    }

    ngAfterContentInit() {
        prism.highlightAll();
    }

    updateCoordinate(e: MouseEvent) {
        this.opts = this.privousCenter === center1 ? { center: center2 } : { center: center1 };
        this.privousCenter = this.opts.center;
    }

    updateMarker(e: MouseEvent) {
        this.opts = this.privousMarkers === markers1 ? { markers: markers2 } : { markers: markers1 };
        this.privousMarkers = this.opts.markers;
    }

    updateZoom(e: MouseEvent) {
        this.opts = {
            zoom: Math.floor(Math.random() * 16) + 3
        };
    }

    loadMap(map: any) {
        console.log('The map instance is created', map);
    }

    clickMarker(marker: any) {
        console.log('The clicked marker is', marker.getPosition());
    }

    clickmap(e: any) {
        console.log(`Map clicked with coordinate: ${e.point.lng}, ${e.point.lat}`);
    }

    toggleDisplay(e: MouseEvent) {
        if (!this.display) {
            this.opts = {
                center: center1,
                zoom: 17,
                markers: markers1,
                geolocationCtrl: {
                    anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT
                },
                scaleCtrl: {
                    anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_LEFT
                },
                overviewCtrl: {
                    isOpen: true
                },
                navCtrl: {
                    type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE
                }
            };
        }
        this.display = !this.display;
    }

}
