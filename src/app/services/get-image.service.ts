import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GetImageService {
  private storage = inject(Storage);
  private toastCtrl = inject(ToastController);

  async takePicture() {
    try {
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl,
      });
      const blob = this.dataURLtoBlob(image.dataUrl);

      // si la imagen es mayor a 3mb no se sube
      if (blob.size > 3 * 1024 * 1024) {
        const toast = await this.toastCtrl.create({
          icon: 'alert-circle-outline',
          color: 'danger',
          message: 'Image too large. Try again with a smaller image.',
          duration: 3000,
        });
        await toast.present();
        return undefined;
      }

      return { blob, image };
    } catch (e) {
      return undefined;
    }
  }

  dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async uploadImage(blob: any, image: any) {
    try {
      const currentDate = Date.now();
      const filePath = `test/${currentDate}.${image.format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (e) {
      throw e;
    }
  }
}
