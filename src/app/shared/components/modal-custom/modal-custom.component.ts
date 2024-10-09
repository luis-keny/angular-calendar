import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-modal-custom',
  templateUrl: './modal-custom.component.html',
  styleUrl: './modal-custom.component.css'
})
export class ModalCustomComponent {
  @Input() title: string = '';
  @Input() alertMessage: string = '';
  @ViewChild('dynamicComponent', { read: ViewContainerRef }) dynamicComponent!: ViewContainerRef;
  @Output() closeEvent = new EventEmitter<void>();

  private componentToLoad: any;

  ngAfterViewInit() {
    if (this.componentToLoad) {
      this.loadComponent(this.componentToLoad);
    }
  }

  public close() {
    let closing = this.alertMessage !== '' ? confirm(this.alertMessage) : true;
    if (closing) {
      this.closeEvent.emit();
    }
  }

  private loadComponent(component: any) {
    if (this.dynamicComponent) {
      this.dynamicComponent.clear();
      this.dynamicComponent.createComponent(component);
    } else {
      console.error('dynamicComponent ViewContainerRef is not initialized.');
    }
  }

  public setComponent(component: any) {
    this.componentToLoad = component;
    if (this.dynamicComponent) {
      this.loadComponent(component);
    }
  }
}
