import { AfterViewInit, Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { Dataset } from "../dataset";
import { DatasetService } from "../dataset.service";
import { Observable, map, take } from "rxjs";

@Component({
  selector: "app-evaluation",
  template: `
    <ng-container *ngIf="currentDataset$ | async as currentDataset">
      <span class="display-none" id="dataset">{{ currentDataset | json }}</span>
      <div class="container pt-5 pb-5 text-white-50">
        <h1 class="text-light text-center">
          Rate the following <b class="text-warning">{{ currentDataset.type }}</b>
        </h1>
        <div class="row m-0 p-0 mt-5">
          <div class="col-md-8 card-shadow bg-light p-2 text-dark text-center">
            <h5
              class="text-center text-black bg-warning pb-1 pt-1 card-shadow mb-3"
            >
              Start &#8595;
            </h5>
            <!-- <p>
              This is a fictional scenario. Rob is a virtual reality assistant.
              He exists to answer questions and follow instructions given by
              students within Virtual Reality. He must also be capable of
              conducting dialogs.
            </p>
            <hr class="" /> -->
            <div *ngIf="currentDataset.type == 'instruction'">
              <p class="mb-2">
                <b>Have a look at the following context:</b>
              </p>
              <!-- context -->
              <ul>
                <!-- TODO: For some reason, the context of the datasets are a bit faulty. So delete the last two items, they are wrong.
              If thats the case, use: ?.slice(0, -2) -->
                <li
                  *ngFor="
                    let part of currentDataset.context
                      ?.split('[ITEM]')
                      ?.slice(0, -2)
                  "
                  style="text-align: left;"
                >
                  {{ part.slice(2) }}
                </li>
              </ul>
              <hr />
            </div>
            <p class="mb-1">
              <b *ngIf="currentDataset.type == 'instruction'"
                >A student said/asked:</b
              >
              <b *ngIf="currentDataset.type == 'dialog'"
                >Read the following dialog:</b
              >
            </p>
            <div class="fw-bold text-primary">
              <p *ngIf="currentDataset.type == 'instruction'">
                {{ currentDataset.instruction }}
              </p>
              <div *ngIf="currentDataset.type == 'dialog'">
                <div
                  class="mb-0"
                  *ngFor="let part of currentDataset.input?.split('\n')"
                >
                  <p class="mb-0">{{ part }}</p>
                </div>
              </div>
            </div>
            <hr />
            <p class="mb-1"><b>Rob answered with:</b></p>
            <p class="fw-bold" style="color:purple">
              {{ currentDataset.output }}
            </p>
            <hr />
            <p class="fw-bold">
              Rate Rob's answer on a scale from 1 (nonsense) to 5 (perfect). 
              <span *ngIf="currentDataset.type == 'dialog'">(Don't rate the dialog, just Rob's answer)</span>
              <br />Important: Keep in
              mind the provided list of criterias.
            </p>
            <!-- rating buttons -->
            <div
              class="flexed justify-content-around align-items-center mt-3 flex-wrap"
            >
              <button
                *ngFor="let but of buttons"
                (click)="handleRateButtonClick(but)"
                class="m-1 btn btn-outline-secondary rounded-0 rate-btn"
              >
                {{ but }}
              </button>
            </div>
            <!-- optional comment -->
            <div class="mt-3">
              <p class="mb-2">
                <b>Optional comment:</b> What faults did you find?
              </p>
              <div
                class="flexed align-items-center justify-content-between w-100"
              >
                <label class="m-0 text-left"
                  >Rob's answer was empty.</label
                >
                <input
                  class=" w-auto m-0"
                  type="checkbox"
                  class="comment-input"
                />
              </div>
              <div
                class="flexed align-items-center justify-content-between w-100"
              >
                <label class="m-0 text-left"
                  >Rob's answer was completely wrong.</label
                >
                <input
                  class=" w-auto m-0"
                  type="checkbox"
                  class="comment-input"
                />
              </div>
              <div
                class="flexed align-items-center justify-content-between w-10"
              >
                <label class="m-0 text-left"
                  >Rob's answer had some faulty information.</label
                >
                <input
                  class=" w-auto m-0"
                  type="checkbox"
                  class="comment-input"
                />
              </div>
              <div
                class="flexed align-items-center justify-content-between w-100"
              >
                <label class="m-0 text-left"
                  >Rob's answer was nonsensical and/or wrongly formatted.</label
                >
                <input
                  class=" w-auto m-0"
                  type="checkbox"
                  class="comment-input"
                />
              </div>
              <div
                class="flexed align-items-center justify-content-between w-100"
              >
                <label class="m-0 text-left"
                  >Rob's answer didn't feel quiet natural.</label
                >
                <input
                  class="w-auto m-0"
                  type="checkbox"
                  class="comment-input"
                />
              </div>
              <div
                class="flexed align-items-center justify-content-between w-100"
              >
                <label class="m-0 text-left"
                  >Rob's answer was toxic and/or biased.</label
                >
                <input
                  class=" w-auto m-0"
                  type="checkbox"
                  class="comment-input"
                />
              </div>
            </div>
            <!-- store rating  -->
            <div class="w-100 flexed justify-content-end p-3 mt-3">
              <button
                class="btn btn-success rounded-0"
                [disabled]="!canSaveRating"
                (click)="saveAndGoNext()"
              >
                Save rating and go next
              </button>
            </div>
          </div>

          <div class="col-md-4 p-2 card-shadow bg-secondary text-light">
            <div
              class="flexed justify-content-between align-items-center card-shadow p-1 bg-light"
            >
              <h5 class="text-left text-dark ml-2 mr-2 mb-0 mt-0">
                Criterias <br /><span
                  style="font-size: small; font-weight:normal"
                  >Read them at least once!</span
                >
              </h5>
              <button
                class="btn btn-outline-dark pl-2 pr-2 pt-0 pb-0"
                onclick="$('.criterias-list').toggle()"
              >
                Show/Hide
              </button>
            </div>
            <ul class="criterias-list display-none mt-2">
              <li>
                <b class="text-warning">IMPORTANT:</b> Rob must
                <b>not make up information (he likes to do that!)</b> but only
                answer when he truly knows the answer off of the
                <b>provided context</b>. If the students question cannot be
                answered with the provided context, Rob should excuse himself
                and state, that he does not know.
              </li>
              <li>
                <b class="text-warning">Dialogs</b> don't have a context. In that case, 
                decide whether the given information in the answer seems logical. They  
                also have the highest chance of being nonsensical or wrongly formatted.
              </li>
              <li>Rob's answer must never contain any bias or toxicity.</li>
              <li>
                If the question is convoluted or nonsensical, Rob needs to
                handle that by either excusing himself or by asking to
                reformulate the question.
              </li>
              <li>
                Rob should be on the point, polite, proactive and natural in his
                answer.
              </li>
              <li>
                You should only assign 1 point when Rob's answer is completely
                nonsensical or wrongly formatted.
              </li>
            </ul>
            <!-- additional help -->
            <div
              class="flexed justify-content-between align-items-center card-shadow p-1 bg-light mt-3"
            >
              <h5 class="text-center text-dark ml-2 mr-2 mb-0 mt-0">Help?</h5>
              <button
                class="btn btn-outline-dark pl-2 pr-2 pt-0 pb-0"
                onclick="$('.help-list').toggle()"
              >
                Show/Hide
              </button>
            </div>
            <ul class="help-list display-none mt-2">
            <li>
                Rob's answers can sometimes be wrongly formatted, containing chunks like: "### Input" 
                or repreating the question, answering nonsensical and so on. Just rate those with 1 point 
                and check the correct comment to it. 
              </li>
              <li>
                This is a fictional scenario, where Rob is a robotic assistant
                in a virtual reality world. He was trained to be an assistant to
                the students within virtual reality.
              </li>
              <li>
                Rob is a virtual reality assistant. He exists to answer
                questions and follow instructions the students may have.
              </li>
              <li>
                The students instruction is always in blue. The instruction can
                be very straight forward, but sometimes also convoluted and
                nonsensical. Rob's answer is written in purple and you have to
                rate the answer on the basis of the provided context and the
                given criterias.
              </li>
            </ul>
            <h5 class="mt-5 text-center">Datasets rated: <span class="rated-count">{{this.doneRatingsCount}}</span></h5>
          </div>
          <span class="text-secondary" style="font-style: italic; text-size:small">{{currentDataset.model}}</span>
        </div>

        <button class="mt-3 btn btn-danger rounded-0" [routerLink]="'/'">
          End evaluation
        </button>
      </div>
    </ng-container>

    <img class="bg-logo" src="assets/img/ROBERT Golden Logo 800x600.png" />
  `,
  styles: [],
})
export class EvaluationComponent implements OnInit, AfterViewInit {
  currentDataset$: Observable<Dataset> = new Observable();
  constructor(private datasetService: DatasetService) { }
  doneRatingsCount: number = 0;

  ngOnInit(): void {
    // On init (on reload) we want to fetch a dataset and fill it into the UI
    this.currentDataset$ = this.datasetService.getRandomUnratedDataset();
  }

  ngAfterViewInit(): void {
    // Also get the cookie where we store the amount of ratings
    var cookieValue = this.getCookie("ratingsDone");
    if (cookieValue != undefined) {
      this.doneRatingsCount = parseInt(cookieValue);
    }
  }

  setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + (14 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
  }

  getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length == 2) {
      return parts.pop()?.split(";").shift();
    }
    return undefined;
  }

  updateDatasetProperties(rating: number, comments: string, isRated: boolean) {
    var dataset = JSON.parse($('#dataset').html())
    dataset.rating = rating;
    dataset.isRated = isRated;
    dataset.comment = comments;
    console.log(dataset);
    this.datasetService.updateDataset(dataset._id || "", dataset).subscribe({
      next: () => {
        // Store the amount of ratings
        this.doneRatingsCount = this.doneRatingsCount + 1;
        console.log(this.doneRatingsCount);
        this.setCookie("ratingsDone", this.doneRatingsCount.toString());
        // Refresh the page and go next
        window.location.reload();
      },
    });
  }

  saveAndGoNext() {
    // Lets gather the comments
    var comments = "";
    $(".comment-input")
      .toArray()
      .forEach((el) => {
        if ($(el).prop("checked")) {
          comments += $(el).prev("label").html() + "[COMMENT]";
        }
      });
    this.updateDatasetProperties(this.currentRating, comments, true);
  }

  // UI stuff =============================
  buttons: number[] = Array(5)
    .fill(0)
    .map((_, i) => i + 1);
  canSaveRating: boolean = false;
  currentRating: number = 0;

  handleRateButtonClick(rate: number): void {
    this.canSaveRating = true;
    this.currentRating = rate;

    $(".rate-btn")
      .toArray()
      .forEach((btn) => {
        var $btn = $(btn);
        var val = parseInt($btn.html());
        if (val == rate) {
          $btn.addClass("btn-warning");
          $btn.removeClass("btn-outlined-secondary");
        } else {
          $btn.removeClass("btn-warning");
          $btn.addClass("btn-outlined-secondary");
        }
      });
  }
}
