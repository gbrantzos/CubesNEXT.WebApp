import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from '@core/components/login/login.component';
import { MainLayoutComponent } from '@core/components/main-layout/main-layout.component';
import { NavBarComponent } from '@core/components/nav-bar/nav-bar.component';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { SideNavComponent } from '@core/components/side-nav/side-nav.component';
import { CubesApiResultInterceptor } from '@core/helpers/cubes-api-result.interceptor';
import { loadConfiguration } from '@core/helpers/load-configuration';
import { ConfigurationService } from '@core/services/configuration.service';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    MainLayoutComponent,
    NavBarComponent,
    SideNavComponent,
    LoginComponent,
    NotFoundComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfiguration,
      multi: true,
      deps: [HttpClient, ConfigurationService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CubesApiResultInterceptor,
      multi: true,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        panelClass: 'snack-bar',
        horizontalPosition: 'right',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
