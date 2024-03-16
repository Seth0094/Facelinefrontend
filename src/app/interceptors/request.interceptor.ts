import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  private excludedEndpointsPattern = /\/(users|face)\/\w+\/(follow|like)/;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Comprueba si la solicitud tiene 'page' o 'date' en los parámetros de consulta
    // o si la solicitud es para seguir a un usuario o darle me gusta a un tweet
    if (
      request.params.has('page') ||
      request.params.has('date') ||
      this.excludedEndpointsPattern.test(request.url)
    ) {
      // Si se cumple alguna de las condiciones, pasa la solicitud sin mostrar el cargador
      return next.handle(request);
    }

    // Muestra el componente de carga
    const loading = this.loadingCtrl.create({
      spinner: 'crescent',
      duration: 10000, // Establece una duración máxima para el componente de carga
    });
    loading.then((loader) => loader.present());

    // Intercepta la solicitud y maneja la respuesta
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Descarta el cargador en caso de error
        loading.then((loader) => loader.dismiss());

        // Muestra un mensaje de error
        const toast = this.toastCtrl.create({
          message: error.error.message || 'Ocurrió un error',
          duration: 2500,
          color: 'danger',
          position: 'bottom',
          icon: 'close-circle-outline',
        });
        toast.then((t) => t.present());

        throw error;
      }),
      finalize(() => {
        // Descarta el cargador después de recibir la respuesta
        loading.then((loader) => loader.dismiss());
      })
    );
  }
}
