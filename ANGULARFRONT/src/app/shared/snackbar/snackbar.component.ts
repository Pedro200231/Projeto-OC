import { Component, Injectable } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
@Injectable({
  providedIn: 'root'
})

export class SnackbarComponent {

  snackbarMessage(message: string, error: boolean = false) {
    var x = document.getElementById("snackbar");
    if (x !== null) {
      x.innerHTML = message;
      x.className = "show";
      x.classList.add(error ? "error" : "success");
      setTimeout(function(){
        if (x !== null) {
          x.className = x.className.replace("show", "");
        }
      }, 3000);
    }
  }
}
