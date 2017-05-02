import 'core-js/es6';
import 'core-js/es7/reflect';
import 'rxjs';
import 'zone.js/dist/zone';
import { NgModule, enableProdMode }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {MainApp} from './demo.app';
import '../css/main.css';

import { BaiduMapModule } from '../../src/';
@NgModule({
  imports:      [ BrowserModule, BaiduMapModule ],
  declarations: [ MainApp ],
  bootstrap:    [ MainApp ]
})
class AppModule { }

class App {

    constructor() {
        enableProdMode();
    }

    destroySplash(): void {
        document.head.removeChild(document.querySelector('#splash-spinner'));
        document.body.removeChild(document.querySelector('.spinner'));
    }

    launch() {
        platformBrowserDynamic().bootstrapModule(AppModule);
    }

    run(): void {
        this.destroySplash();
        this.launch();
    }
}

new App().run();
