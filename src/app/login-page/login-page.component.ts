import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroup } from '@angular/forms';
import {AuthService, AuthResponseData} from '../auth.service';
import { Router } from '@angular/router';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Observable } from 'rxjs';
import { formatCurrency } from '@angular/common';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {


  isLogin = true;
  isLoading = false;
  error: string = null;

  constructor(private authService : AuthService, private router: Router) { }

  ngOnInit(): void {
  }


    onSubmit(form: NgForm) {
      if(!form.valid) {
        return;
      }
      const username = form.value.username;
      const password = form.value.password ;
      let authObs: Observable<AuthResponseData>;
  
  
      this.isLoading = true;
      if(this.isLogin) {
        authObs = this.authService.login(username, password)
      } else {
      }
  
      authObs.subscribe(responseData => {
        this.isLoading = false;
        this.router.navigate(['./home'])
      }, errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      })
  
  
      form.reset();
    }
}
