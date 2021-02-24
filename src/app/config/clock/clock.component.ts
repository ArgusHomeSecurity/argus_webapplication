import { Component, OnInit, OnDestroy, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { Observable } from 'rxjs';
import { startWith, map, finalize } from 'rxjs/operators';

import { TIME_ZONES } from './timezones';
import { ConfigurationBaseComponent } from '../../configuration-base/configuration-base.component';
import { EventService, LoaderService, MonitoringService } from '../../services';
import { environment } from 'src/environments/environment';

const scheduleMicrotask = Promise.resolve( null );


export interface TimeZoneGroup {
  groupName: string;
  zoneNames: string[];
}

export const filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component( {
  templateUrl: 'clock.component.html',
  styleUrls: ['clock.component.scss'],
  providers: []
} )

export class ClockComponent extends ConfigurationBaseComponent implements OnInit, OnDestroy {
  @ViewChild('snackbarTemplate') snackbarTemplate: TemplateRef<any>;
  clockForm: FormGroup;
  clock: any;

  timezoneGroups: TimeZoneGroup[] = [];
  timezoneGroupOptions: Observable<TimeZoneGroup[]>;

  timezoneUngroupped: string[] = [];
  timezoneUngrouppedOptions: Observable<string[]>;

  constructor(
    @Inject('EventService') public eventService: EventService,
    @Inject('LoaderService') public loader: LoaderService,
    @Inject('MonitoringService') public monitoringService: MonitoringService,

    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    dateTimeAdapter: DateTimeAdapter<any>
  ) {
    super(eventService, loader, monitoringService);
    dateTimeAdapter.setLocale(localStorage.getItem('localeId'));

    TIME_ZONES.forEach(timezoneName => {
      const results = timezoneName.match(/(.*)\/(.*)/);
      if (results == null) {
        this.timezoneUngroupped.push(timezoneName);
      } else {
        const timezoneGroup = this.timezoneGroups.find(tzGroup => tzGroup.groupName === results[1]);
        if (timezoneGroup == null) {
          this.timezoneGroups.push({groupName: results[1], zoneNames: [results[2]]});
        } else {
          timezoneGroup.zoneNames.push(results[2]);
        }
      }
    });
  }

  ngOnInit() {
    super.initialize();

    this.updateComponent();
    this.updateForm();

    if (this.clockForm.get('timezone')) {
      this.timezoneGroupOptions = this.clockForm.get('timezone').valueChanges
        .pipe(
          startWith(''),
          map(value => this.filterGroup(value))
        );

      this.timezoneUngrouppedOptions = this.clockForm.get('timezone').valueChanges
        .pipe(
          startWith(''),
          map(value => this.filterUngroupped(value))
        );
    }
  }

  ngOnDestroy() {
    super.destroy();
  }

  updateForm() {
    this.clockForm = this.fb.group( {
      dateTime: new FormControl('', Validators.required),
      timezone: new FormControl('', Validators.required)
    });
  }

  updateComponent() {
    // avoid ExpressionChangedAfterItHasBeenCheckedError
    // https://github.com/angular/angular/issues/17572#issuecomment-323465737
    scheduleMicrotask.then(() => {
      this.loader.display( true );
    } );

    this.monitoringService.getClock()
      .pipe(finalize(() => this.loader.display(false)))
      .subscribe(clock => {
        this.clock = clock;
        if (clock != null) {
          this.clockForm.get('timezone').setValue(clock.timezone);
        }

        this.loader.display(false);
      }
    );
  }

  // onSynchronize() {
  //   this.monitoringService.synchronizeClock()
  //     .subscribe(_ => this.updateComponent()
  //   );
  // }


  onSubmit() {
    const formModel = this.clockForm.value;
    const newDate = formModel.dateTime;
    this.monitoringService.changeClock(newDate.toISOString(), formModel.timezone)
      .subscribe(
        _ => this.updateComponent(),
        _ => this.snackBar.openFromTemplate(this.snackbarTemplate, {duration: environment.snackDuration})
    );
  }

  private filterGroup(value: string): TimeZoneGroup[] {
    if (value) {
      return this.timezoneGroups
        .map(group => ({groupName: group.groupName, zoneNames: filter(group.zoneNames, value)}))
        .filter(group => group.zoneNames.length > 0);
    }

    return this.timezoneGroups;
  }

  private filterUngroupped(value: string): string[] {
    if (value) {
      return filter(this.timezoneUngroupped, value);
    }

    return this.timezoneUngroupped;
  }
}

