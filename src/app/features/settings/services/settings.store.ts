import { Injectable } from '@angular/core';
import { SettingsApiClient } from '@features/settings/services/settings.api-client';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SettingsStore {
  private readonly smtpProfiles$ = new BehaviorSubject<SmtpProfile[]>([]);
  private readonly selectedSmtpProfile$ = new BehaviorSubject<SmtpProfile>(undefined);

  public readonly smtpProfiles = this.smtpProfiles$.asObservable();
  public readonly selectedSmtpProfile = this.selectedSmtpProfile$.asObservable();
  public get snapshot() {
    return this.smtpProfiles$.value;
  }

  constructor(
    private apiClient: SettingsApiClient,
    private loadingWrapper: LoadingWrapperService,
    private dialog: DialogService
  ) {}

  loadData() {
    const call$ = this.loadingWrapper.wrap(this.apiClient.loadData());
    call$.subscribe(
      (data) => {
        this.smtpProfiles$.next(data);
        this.selectedSmtpProfile$.next(undefined);
      },
      (error) => {
        console.error(error);
        this.dialog.snackError(`Loading of SMTP profiles failed!\n${error.error}`);
      }
    );
  }

  saveData() {
    const call$ = this.loadingWrapper.wrap(this.apiClient.saveData(this.smtpProfiles$.value));
    call$.subscribe(
      (_) => this.dialog.snackSuccess('SMTP profiles saved!'),
      (error) => {
        console.error(error);
        this.dialog.snackError(`Saving of SMTP profiles failed!\n${error.error}`);
      }
    );
  }

  selectProfile(name: string) {
    const smtp = this.smtpProfiles$.value.find((s) => s.name === name);
    this.selectedSmtpProfile$.next({ ...smtp });
  }

  newProfile() {
    const name = this.uniqueName();
    const smtp: SmtpProfile = {
      name: name,
      comments: 'New SMTP Profile',
      host: 'localhost',
      port: 25,
      timeout: 300,
      sender: 'nobody@localhost',
      useSsl: false,
      isNew: true,
      userName: '',
      password: '',
    };
    this.selectedSmtpProfile$.next(smtp);
  }

  discardNewProfile = () => this.selectedSmtpProfile$.next(undefined);

  deleteProfile(name: string) {
    const temp = this.smtpProfiles$.value
      .filter((cnx) => cnx.name !== name)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.smtpProfiles$.next(temp);
    this.selectedSmtpProfile$.next(undefined);
    this.saveData();
  }

  saveProfile(originalName: string, profile: SmtpProfile) {
    const temp = this.smtpProfiles$.value.filter((s) => s.name !== originalName);
    const newQryArray = [...temp, profile].sort((a, b) => a.name.localeCompare(b.name));

    this.smtpProfiles$.next(newQryArray);
    this.saveData();

    const prf = { ...profile };
    prf.isNew = false;
    this.selectedSmtpProfile$.next(prf);
  }

  private uniqueName() {
    let name = '';
    let id = this.smtpProfiles$.value.length;
    do {
      id++;
      name = `Profile.#${id}`;
    } while (this.smtpProfiles$.value.findIndex((p) => p.name === name) !== -1);

    return name;
  }
}

export interface SmtpProfile {
  name: string;
  comments?: string;
  host: string;
  port: number;
  timeout: number;
  sender: string;
  useSsl: boolean;
  userName?: string;
  password?: string;
  isNew?: boolean;
}
