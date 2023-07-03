import { Component } from "@angular/core";

@Component({
  selector: "app-landing",
  template: `
    <div class="container pt-5 pb-5 text-white-50">
      <h1 class="text-center text-light">Hi!</h1>
      <h5 class="text-center text-light">
        Thank you for participating in this evaluation. Let's not waste your time. Here's the situation: <br/>
      </h5>
      <hr class="mt-1 mb-4"/>
      <p class="mt-0 text-center">
        I have trained multiple versions of a language model called Rob. Rob aims to be a virtual reality assistant that follows instructions 
        and answers questions. To simplify: He is a "chat bot" and since I trained multiple versions, I want to know which ones the best, so expect 
        good and bad results.  
      </p>
      <p class="text-center">
        To do so, you will be given an instruction or a question, followed by an answer. Occasionally, you will also see a chat-history 
        and a continuation given by Rob. You will also see some context information 
        to validate whether Rob's answer is correct (it's self explanatory once you start the evaluation, no worries).
      </p>
      <p class="text-light text-center">
        All you have to do is to read the instruction/question/chat-history, look at the given information and then rate Rob's answer with a number between 
        1-10. You will have a list of criterias to better rate Rob's answer once you start the evaluation.
      </p>
      <p class="text-warning text-center">
        There is no start to the evaluation, neither an end. Just press "Start", rate as many datasets as you'd like and then just close the window. 
        You can start again at any time. Again, thanks for participating!<br/>
        -Kevin
      </p>
      <div class="text-center mt-5 mb-5">
        <button class="btn btn-warning text-center" [routerLink]="'/evaluation'">
          Start
        </button>
      </div>
    </div>

    <img class="bg-logo" src="assets/img/ROBERT Golden Logo 800x600.png"/>
  `,
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent { }