import {bootstrap, Component, FORM_DIRECTIVES, NgFor, NgIf} from 'angular2/angular2';
import {Http, Headers} from 'angular2/http';

class Hero {
  id: number;
  name: string;
}

@Component({
  selector: 'repeater',
  templateUrl: 'tplUsers.html'
  directives: [FORM_DIRECTIVES,NgFor,NgIf]
})

class AppComponent {
  public title = 'Tour of Heroes';
  public hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };

	 public users = [
    { name: 'Jilles', age: 21 },
    { name: 'Todd', age: 24 },
    { name: 'Lisa', age: 18 }
  ];
}
bootstrap(AppComponent);


