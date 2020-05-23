import { Component, NgZone, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MapsAPILoader } from "@agm/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Artivatic Task";
  states: string[] = [];
  districts: string[] = [];
  cities: string[] = [];
  inputState: string = "";
  inputDistrict: string = "";
  inputCity: string = "";
  allCitiesURL = "https://indian-cities-api-nocbegfhqg.now.sh/cities";

  lat: number = 51.673858;
  lng: number = 7.815982;
  zoom: number = 12;
  label: string = "You are Here";
  private geoCoder;

  isDisabled: boolean = false;

  @ViewChild('search')
  public searchElementRef: ElementRef;


  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setStates();
    this.getLocation();
  }

  getLocations(URL: string): Observable<Object[]> {
    URL = URL.replace("&","%26");
    return this.http.get<Object[]>(URL);
  }

  setStates() {
    this.isDisabled = true;
    this.getLocations(this.allCitiesURL).subscribe((response: any) => {
      if (response && response.length > 0) {
        response.forEach(city => {
          if (!this.states.includes(city.State)) {
            this.states.push(city.State);
          }
          this.states.sort();
        });
      }
      this.isDisabled = false;
    });
  }

  getDistricts(state: string) {
    this.districts = [];
    this.cities = [];
    this.isDisabled = true;
    this.renderer.setProperty(this.searchElementRef.nativeElement, 'value', "");
    if (state !== "") {
      let filteredCitiesURL = this.allCitiesURL + "?State=" + state;
      this.getLocations(filteredCitiesURL).subscribe((response: any) => {
        if (response && response.length > 0) {
          response.forEach(city => {
            if(!this.districts.includes(city.District)){
              this.districts.push(city.District);
            }
          });
          this.districts.sort();
        }
        this.isDisabled = false;
      });
    }else{
      this.isDisabled = false;
    }
  }

  getCities(district: string) {
    this.cities = [];
    this.renderer.setProperty(this.searchElementRef.nativeElement, 'value', "");
    this.isDisabled = true;
    if (district !== "") {
      let filteredCitiesURL = this.allCitiesURL + "?District=" + district;
      this.getLocations(filteredCitiesURL).subscribe((response: any) => {
        if (response && response.length > 0) {
          response.forEach(city => {
            this.cities.push(city.City);
          });
          this.cities.sort();
        }
        this.isDisabled = false;
      });
    }else{
      this.isDisabled = false;
    }
  }

  setCurrentLocation() {
    this.isDisabled = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 8;
        this.isDisabled = false;
      });
    }else{
      this.isDisabled = false;
    }
  }

  geLocationOnChange(city: string){
    let address: string = city + ", " + this.inputDistrict + ", " + this.inputState + ", " + "India";
    address = address.replace("*","");
    this.renderer.setProperty(this.searchElementRef.nativeElement, 'value', address);
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      
      this.geoCoder.geocode({ 'address': address }, function(results, status) {
        console.log(results);
        console.log(status);
        if(results && results.length>0){
          this.label = address;
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          this.zoom = 12;
        }
      });
    });
  }

  getLocation() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
}
