import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  private router = inject(Router);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private toastCtrl = inject(ToastController);

  errorMessages: { [key: string]: { [key: string]: string } } = {
    name: {
      required: 'Name is required',
      minlength: 'Name must be at least 2 characters',
      maxlength: 'Name cannot be more than 30 characters',
    },
    username: {
      required: 'Username is required',
      minlength: 'Username must be at least 2 characters',
      maxlength: 'Username cannot be more than 25 characters',
    },
    email: {
      required: 'Email is required',
      email: 'Invalid email format',
    },
    password: {
      required: 'Password is required',
      minlength: 'Password must be at least 8 characters',
      maxlength: 'Password cannot be more than 50 characters',
      pattern: 'Password must contain at least one uppercase and one number',
    },
    bio: {
      maxlength: 'Bio cannot be more than 160 characters',
    },
  };

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      bio: ['', [Validators.maxLength(160)]],
    });
  }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Registration successful',
      duration: 2000,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      color: 'success',
    });

    try {
      const res = await this.authService.signup(this.registerForm.value);

      if (res.status == 'success') {
        await toast.present();
        this.registerForm.reset();

        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getErrorMessage(controlName: string) {
    let control = this.registerForm.get(controlName);
    if (control) {
      for (let errorName in control.errors) {
        if (this.errorMessages[controlName][errorName]) {
          return this.errorMessages[controlName][errorName];
        }
      }
    }
    return '';
  }
}
