import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { Dataset } from "../dataset";
import { DatasetService } from "../dataset.service";
import { Observable, map, take } from "rxjs";

@Component({
  selector: "app-evaluation",
  template: `
    <ng-container *ngIf="currentDataset$ | async as currentDataset">
      <div class="container pt-5 pb-5 text-white-50">
        <h1 class="text-light text-center">
          Rate the following {{ currentDataset.type }}
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
            <p class="mb-2">
              <b>Have a look at the following context:</b>
            </p>
            <!-- context -->
            <ul>
              <!-- TODO: For some reason, the context of the datasets are a bit faulty. So delete the last two items, they are wrong.
              If thats the case, use: ?.slice(0, -2) -->
              <li
                *ngFor="let part of currentDataset.context?.split('[ITEM]')"
                style="text-align: left;"
              >
                {{ part.slice(2) }}
              </li>
            </ul>
            <hr/>
            <p class="mb-1">
              <b>A student said/asked:</b>
            </p>
            <p class="fw-bold text-primary">
              {{ currentDataset.instruction }}
            </p>
            <hr />
            <p class="mb-1"><b>Rob answered with:</b></p>
            <p class="fw-bold" style="color:purple">
              {{ currentDataset.output }}
            </p>
            <hr />
            <p class="fw-bold">
              Rate Rob's answer on a scale from 1 to 5. <br />Important: Keep
              in mind the provided list of criterias.
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
                  >Rob's answer was nonsensical.</label
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
                  >Rob's answer didn't feel natural and wasn't proactive.</label
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
          </div>
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
export class EvaluationComponent implements OnInit {
  currentDataset$: Observable<Dataset> = new Observable();
  constructor(private datasetService: DatasetService) { }

  ngOnInit(): void {
    // On init (on reload) we want to fetch a dataset and fill it into the UI
    this.currentDataset$ = this.datasetService.getRandomUnratedDataset();
  }

  updateDatasetProperties(rating: number, comments: string, isRated: boolean) {
    this.currentDataset$.subscribe((dataset) => {
      // Modify the dataset properties
      dataset.rating = rating;
      dataset.comment = comments;
      dataset.isRated = isRated;

      // Store the updated dataset
      this.datasetService.updateDataset(dataset._id || "", dataset).subscribe({
        next: () => {
          // Refresh the page and go next
          window.location.reload();
        },
      });
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
