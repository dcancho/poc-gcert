import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF1cX2hIfEx0RHxbf1x0ZFdMZFVbR3RPIiBoS35RckRiW3tcc3ZURmBUUUBw');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
