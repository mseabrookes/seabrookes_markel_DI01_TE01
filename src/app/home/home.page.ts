import { Component, signal, computed, inject } from '@angular/core';
import restaurantesJSON from '../../assets/datos/restaurantes.json';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Restaurante } from '../interface/restaurante';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule] ,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  
  busqueda = signal<string>('');

  restaurantes: Restaurante[] = restaurantesJSON as Restaurante[];
  restaurantesCargados = signal<Restaurante[]>(restaurantesJSON as Restaurante[]);

  hayDatos = false;

  cargarDatos() {
    this.hayDatos = true;
  }

  territorioActual = signal<string>('todos');
  localidadActual = signal<string>('todas');

  territorioSeleccionado(event: CustomEvent) {
    const territorioSeleccionado = event.detail.value;
    this.territorioActual.set(territorioSeleccionado);
    this.localidadActual.set('todas');
  }
  localidadSeleccionada(event: CustomEvent) {
    const localidadSeleccionada = event.detail.value;
    this.localidadActual.set(localidadSeleccionada);
  }

  restaurantesBuscados = computed<Restaurante[]>(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const territorio = this.territorioActual().trim().toLowerCase();
    const localidad = this.localidadActual().trim().toLowerCase();
    if(territorio == 'todos' && localidad == 'todas'){
      if (!texto) {
      return this.restaurantesCargados();
      }
      return this.restaurantesCargados().filter(restaurantesCargados =>
      restaurantesCargados.documentName.toLowerCase().includes(texto));
    }
    if(territorio == 'todos'){
      if (!texto) {
      return this.restaurantesCargados().filter(restaurantesCargados =>
      restaurantesCargados.locality.toLowerCase().includes(localidad));;
      }
      return this.restaurantesCargados().filter(restaurantesCargados =>
      restaurantesCargados.documentName.toLowerCase().includes(texto) && 
      restaurantesCargados.locality.toLowerCase().includes(localidad));
    }
    if(localidad == 'todas'){
      if (!texto) {
      return this.restaurantesCargados().filter(restaurantesCargados =>
      restaurantesCargados.territory.toLowerCase().includes(territorio));;
      }
      return this.restaurantesCargados().filter(restaurantesCargados =>
      restaurantesCargados.documentName.toLowerCase().includes(texto) && 
      restaurantesCargados.territory.toLowerCase().includes(territorio));
    }
    if (!texto) {
      return this.restaurantesCargados().filter(restaurantesCargados =>
      restaurantesCargados.territory.toLowerCase().includes(territorio) && 
      restaurantesCargados.locality.toLowerCase().includes(localidad));
    }
    return this.restaurantesCargados().filter(restaurantesCargados =>
      restaurantesCargados.documentName.toLowerCase().includes(texto) && 
      restaurantesCargados.territory.toLowerCase().includes(territorio) && 
      restaurantesCargados.locality.toLowerCase().includes(localidad));
  });
  
}