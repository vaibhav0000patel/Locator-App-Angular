import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      // apiKey: "AIzaSyBRlW3Z1rkaJtobajH0GzSUQdwp-e0_Wcw",
      apiKey: "AIzaSyDEArnN6PcHEu8QNZ7dv8AsqCK9PVPrC1o",
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
