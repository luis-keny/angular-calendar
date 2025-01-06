import { Injectable, ComponentRef, EnvironmentInjector, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ModalCustomComponent } from '@shared/components/modal-custom/modal-custom.component';
import { ModalConfig } from '../data/system/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef: ComponentRef<ModalCustomComponent> | null = null;
  private modalCloseSubject = new Subject<any>();
  private viewContainerRef!: ViewContainerRef;

  constructor(
    private environmentInjector: EnvironmentInjector
  ) { }

  public initModal(ref: ViewContainerRef) {
    this.viewContainerRef = ref;
  }

  public openModal(modalConfig: ModalConfig): Observable<any> {
    this.modalRef = this.viewContainerRef.createComponent(ModalCustomComponent, {
      environmentInjector: this.environmentInjector
    });

    const { component, title, alertMessage } = modalConfig;
    if (title) this.modalRef.instance.title = title;
    if (alertMessage !== undefined) this.modalRef.instance.alertMessage = alertMessage;

    this.modalRef.instance.closeEvent.subscribe(() => this.closeModal());

    document.body.appendChild(this.modalRef.location.nativeElement);

    this.modalRef.instance.setComponent(component);

    return this.modalCloseSubject.asObservable();
  }

  public closeModal(result?: any) {
    if (this.modalRef) {
      this.modalRef.destroy();
      this.modalRef = null;
      this.modalCloseSubject.next(result);
      this.modalCloseSubject.complete();
      this.modalCloseSubject = new Subject<any>();
    }
  }
}
