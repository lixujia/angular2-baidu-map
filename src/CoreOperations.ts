import {MapOptions, MarkerOptions} from './interfaces/Options';
import {PreviousMarker} from './interfaces/PreviousMarker';

import {setGeoCtrl} from './controls/GeoControl';
import {setScaleCtrl} from './controls/ScaleControl';
import {setOverviewMapCtrl} from './controls/OverviewMapControl';
import {setNavigationCtrl} from './controls/NavigationControl';

export const reCenter = function(map: any, opts: MapOptions) {
    var BMap: any = (<any>window)['BMap'];
    if (opts.center) {
        map.setCenter(new BMap.Point(opts.center.longitude, opts.center.latitude));
    }
};

export const reZoom = function(map: any, opts: MapOptions) {
    if (opts.zoom) {
        map.setZoom(opts.zoom);
    }
};

export const createInstance = function(opts: MapOptions, element: any) {
    var BMap: any = (<any>window)['BMap'];
    // create map instance
    var map = new BMap.Map(element);

    // init map, set central location and zoom level
    map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);

    setNavigationCtrl(map, opts);
    setScaleCtrl(map, opts);
    setOverviewMapCtrl(map, opts);
    if (opts.enableScrollWheelZoom) {
        //enable scroll wheel zoom
        map.enableScrollWheelZoom();
    }
    setGeoCtrl(map, opts);
    return map;
};

export const createMarker = function(marker: MarkerOptions, pt: any) {
    var BMap: any = (<any>window)['BMap'];
    var opts: any = {};
    if (marker.icon) {
        if (marker.anchor_x && marker.anchor_y) {
            var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height), {
                anchor: new BMap.Size(marker.anchor_x, marker.anchor_y)
            });
        } else {
            var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
        }

        opts['icon'] = icon;
    }
    if (marker.enableDragging) {
        opts['enableDragging'] = true;
    }
    return new BMap.Marker(pt, opts);
};

export const redrawMarkers = function(map: any, previousMarkers: PreviousMarker[], opts: MapOptions) {
    var BMap: any = (<any>window)['BMap'];
    var self = this;

    previousMarkers.forEach(function({marker, listeners}) {
        listeners.forEach(listener => { marker.removeEventListener('click', listener); });
        map.removeOverlay(marker);
    });

    previousMarkers.length = 0;

    if (!opts.markers) {
        return;
    }

    opts.markers.forEach(function(marker: MarkerOptions) {

        var marker2 = createMarker(marker, new BMap.Point(marker.longitude, marker.latitude));

        // add marker to the map
        map.addOverlay(marker2);
        let previousMarker: PreviousMarker = { marker: marker2, listeners: [] };
        previousMarkers.push(previousMarker);


        let onMarkerClickedListener = evt => {
            evt['ori_marker'] = marker;
            self.onMarkerClicked.emit(evt);
        };
        marker2.addEventListener('click', onMarkerClickedListener);
        previousMarker.listeners.push(onMarkerClickedListener);

        if (marker.title || marker.content) {
            let install_info = marker.sensor_names.map((sensor, index) => {
                let install_state = "";

                if (marker.sensor_install[index]) {
                    install_state = "<span style=\"{color: green;}\">已安装</span>";
                } else {
                    install_state = "<span style=\"{color: gray;}\">未安装</span>";
                }

                return `<li>${sensor}: ${install_state}</li>`
            }).join('');
            let info = `<div>
            <h1>${marker.title}</h1>
            <div class="address">
            ${marker.content}
            </div>
            <div class="install-install">
            <ul>
            ${install_info}
            </ul>
            </div>
            </div>`
            let infoWindow2 = new BMap.InfoWindow(info, {
                enableMessage: !!marker.enableMessage
            });
            let openInfoWindowListener = function() {
                this.openInfoWindow(infoWindow2);
            };
            previousMarker.listeners.push(openInfoWindowListener);
            marker2.addEventListener('click', openInfoWindowListener);
        }

        let onMarkerDbClickedListener = evt => {
            evt['ori_marker'] = marker;
            self.onMarkerDbClicked.emit(evt);
        };
        marker2.addEventListener('dblclick', onMarkerDbClickedListener);
        previousMarker.listeners.push(onMarkerDbClickedListener);

        let onMarkerDragStartListener = evt => {
            evt['ori_marker'] = marker;
            self.onMarkerDragStart.emit(evt);
        };
        marker2.addEventListener('dragstart', onMarkerDragStartListener);
        previousMarker.listeners.push(onMarkerDragStartListener);

        let onMarkerDragEndListener = evt => {
            evt['ori_marker'] = marker;
            self.onMarkerDragEnd.emit(evt);
        };
        marker2.addEventListener('dragend', onMarkerDragEndListener);
        previousMarker.listeners.push(onMarkerDragEndListener);

        let onMarkerRightClickedListener = evt => {
            evt['ori_marker'] = marker;
            self.onMarkerRightClicked.emit(evt);
        };
        marker2.addEventListener('rightclick', onMarkerRightClickedListener);
        previousMarker.listeners.push(onMarkerRightClickedListener);
    });
};
