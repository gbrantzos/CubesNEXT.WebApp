import { Component, OnInit } from '@angular/core';
import { catchError, delay, map } from 'rxjs/operators';
import { empty, forkJoin } from 'rxjs';
import { SchedulerService } from 'src/app/core/services/scheduler.service';
import { LookupService } from 'src/app/core/services/lookup.service';

@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  public data$: any;

  constructor(
    private schedulerService: SchedulerService,
    private lookupService: LookupService) { }
  ngOnInit() { this.refresh(); }

  refresh() {
    this.data$ = forkJoin(
      this.schedulerService.getSchedulerStatus(),
      this.lookupService.getLookup('jobTypes'),
      this.lookupService.getLookup('commandTypes')
    ).pipe(
      delay(2000),
      catchError((err, caught) => {
        // TODO: Add proper error handling and display!
        alert(err.message);
        console.error(err);
        return empty();
      }),
      map(([schedulerStatus, jobTypes, commandTypes]) => {
        return {
          schedulerStatus,
          lookups: {
            jobTypes,
            commandTypes
          }
        };
      })
    );
  }

  onJobListEvent(event: string) {
    if (event === 'refresh') {
      this.refresh();
    }
  }
}
