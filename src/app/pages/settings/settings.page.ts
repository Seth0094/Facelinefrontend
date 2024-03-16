import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import {
  AlertController,
  LoadingController,
  ToastController,
  ToggleCustomEvent,
} from '@ionic/angular';
import { GetImageService } from 'src/app/services/get-image.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  profileForm: FormGroup = new FormGroup({});
  passwordForm: FormGroup = new FormGroup({});

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);
  private toastCtrl = inject(ToastController);
  private imageService = inject(GetImageService);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  user = this.router.getCurrentNavigation()!.extras.state!['user'];
  themeToggle = false;
  avatar: any = null;
  validateIMG: boolean = false;
  imgToUpload?: any = null;
  blob: any = null;
  loading: boolean = false;

  errorMessages: { [key: string]: { [key: string]: string } } = {
    name: {
      required: 'Name is required',
      minlength: 'Name must be at least 2 characters',
      maxlength: 'Name cannot be more than 30 characters',
    },
    username: {
      required: 'identifier is required',
      minlength: 'identifier must be at least 2 characters',
      maxlength: 'identifier cannot be more than 25 characters',
    },
    bio: {
      maxlength: 'Bio cannot be more than 160 characters',
    },
    oldPassword: {
      required: 'Password is required',
      minlength: 'Password must be at least 8 characters',
      maxlength: 'Password cannot be more than 50 characters',
      pattern: 'Password must contain at least one uppercase and one number',
    },
    newPassword: {
      required: 'Password is required',
      minlength: 'Password must be at least 8 characters',
      maxlength: 'Password cannot be more than 50 characters',
      pattern: 'Password must contain at least one uppercase and one number',
    },
    confirmNewPassword: {
      required: 'Confirm password is required',
      minlength: 'Confirm password must be at least 8 characters',
      maxlength: 'Confirm password cannot be more than 50 characters',
      pattern:
        'Confirm password must contain at least one uppercase and one number',
    },
  };

  ngOnInit() {
    this.avatar = this.user.avatar;

    this.initializeDarkValue();

    this.profileForm = this.formBuilder.group({
      name: [
        this.user.name,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      username: [
        this.user.username,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      bio: [this.user.bio, [Validators.maxLength(160)]],
    });

    this.passwordForm = this.formBuilder.group({
      oldPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      confirmNewPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
    });
  }

  // Check/uncheck the toggle and update the theme based on isDark
  async initializeDarkValue() {
    const { value } = await Preferences.get({ key: 'theme' });
    this.themeToggle = value === 'dark' ? true : false;
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(ev: ToggleCustomEvent) {
    this.toggleDarkTheme(ev.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  async toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
    await Preferences.set({
      key: 'theme',
      value: shouldAdd ? 'dark' : 'light',
    });
  }

  async editAvatar() {
    const res = await this.imageService.takePicture();
    this.validateIMG = true;
    if (res) {
      this.avatar = res.image.dataUrl;
      this.imgToUpload = res.image;
      this.blob = res.blob;
    }
  }

  async updateProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    const toast = await this.toastCtrl.create({
      message: 'Profile updated successfully',
      duration: 2000,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      color: 'success',
    });

    let avatar = '';

    try {
      if (this.avatar && this.validateIMG == true) {
        const loading = await this.loadingCtrl.create({
          spinner: 'crescent',
        });

        await loading.present();
        avatar = await this.imageService.uploadImage(
          this.blob,
          this.imgToUpload
        );
        await loading.dismiss();
      } else {
        avatar = this.avatar;
      }

      const res = await this.usersService.updateProfile({
        ...this.profileForm.value,
        avatar,
      });

      if (res.status == 'success') {
        await toast.present();

        this.router.navigate(['/tabs']);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    if (
      this.passwordForm.get('newPassword')?.value !==
      this.passwordForm.get('confirmNewPassword')?.value
    ) {
      const toast = await this.toastCtrl.create({
        message: 'Passwords do not match',
        duration: 2000,
        position: 'bottom',
        icon: 'alert-circle-outline',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Password changed successfully',
      duration: 2000,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      color: 'success',
    });

    try {
      const res = await this.usersService.updatePassword(
        this.passwordForm.value
      );

      if (res.status == 'success') {
        await toast.present();

        this.router.navigate(['/tabs']);
      }
    } catch (error) {
      console.log(error);
    }
  }

  logout() {
    this.usersService.logout();
    this.router.navigate(['/login']);
  }

  presentAlert() {
    this.alertCtrl
      .create({
        header: 'Warning',
        message: 'Are you sure you want to delete your account? This action is irreversable.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              this.deleteAccount();
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  async deleteAccount() {
    const toast = await this.toastCtrl.create({
      message: 'Account deleted successfully',
      duration: 2000,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      color: 'success',
    });

    try {
      const res = await this.usersService.deleteAccount();
      if (res.status == 'success') {
        await toast.present();

        await this.usersService.logout();
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getErrorMessage(controlName: string) {
    let control = this.profileForm.get(controlName);
    if (!control) control = this.passwordForm.get(controlName);

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
