import { Component, OnInit, ViewChild } from '@angular/core';
import { IProject, IDonation, DonationEventType } from '../../types';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FORMAT_NUMBER_READABLE, CALCULATE_PERCENTAGE } from '../../utils';
import { NgxWebMonetizer, WebMonetizerState, MonetizationEvents, IWebMonetizerPayment } from 'ngx-webmonetizer';
import { AUTH_SUBJECT } from '../../subjects';
import { DonorsComponent } from '../donors/donors.component';

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  project: IProject;
  projectID: string;
  paymentPointer: string;
  monetizationState: WebMonetizerState;
  simulatePaymentTimer: any;
  username: string;
  userDonation: IDonation;
  donations: IDonation[];
  @ViewChild('donorsModal', { static: false}) donorsModal: DonorsComponent;

  constructor(private route: ActivatedRoute, private data: DataService, private ngxWebMonetizer: NgxWebMonetizer) { }

  ngOnInit() {
    AUTH_SUBJECT.subscribe(val => this.username = val.username);

    this.getProject();
    this.getDonationEntries();
    
    this.ngxWebMonetizer.state.subscribe(state => this.monetizationState = state);
    this.ngxWebMonetizer.newPayment.subscribe(payment => this.saveNewPaymentEntry(payment));
  }

  get isMonetizationSupported() {
    return this.monetizationState !== 'unsupported';
  }

  get isMonetizationStartedOrPending() {
    return this.monetizationState === 'started' || this.monetizationState === 'pending';
  }

  get donorCount() {
    return this.donations.length;
  }

  get donorCountText() {
    const count = this.donorCount;

    return !count ? null : count === 1 ? '1 person has donated' : `${count} people have donated`; 
  }

  get donorPreviewList() {
    return this.donations.filter(donor => donor.id !== this.username).slice(0, 5);
  }

  get showSeeAllBtn() {
    let flag;

    if (this.userDonation) {
      flag = this.donorCount && ((this.donorPreviewList.length + 1) > this.donorCount);
    } else {
      flag = this.donorCount && (this.donorPreviewList.length > this.donorCount);
    }

    return flag;
  }

  saveNewPaymentEntry(payment: IWebMonetizerPayment) {
    this.data.authorize().then(() => {
      this.data.database.collection('projects').doc(this.projectID).update({ amountRaised: this.project.amountRaised + payment.amount }).then(() => {
        console.log('Amount Raised updated');
      }).catch(err => console.log(err));

      if (this.userDonation) {
        this.data.database.collection('projects').doc(this.projectID).collection('donations').doc(this.username)
        .update({ amount: this.userDonation.amount + payment.amount, timestamp: new Date().getTime() }).then(() => {
          console.log('User donation saved');
        }).catch(err => console.log(err));
      } else {
        const donation: IDonation = { amount: payment.amount, name: this.username, timestamp: new Date().getTime() };

        this.data.database.collection('projects').doc(this.projectID).collection('donations').doc(this.username).set(donation).then(() => {
          console.log('User donation saved');
        }).catch(err => console.log(err));
      }
    }).catch(err => console.log(err));
  }

  startDonating() {
    this.ngxWebMonetizer.start(this.paymentPointer);
    (<any> document).monetization._requestId = 'fc23b14d-70e4-4d55-b0a0-dd86f70ce402';

    const event = new CustomEvent(MonetizationEvents.PENDING);
    (<any> document).monetization.dispatchEvent(event);
    
    setTimeout(() => {
      setTimeout(() => {
        const _event = new CustomEvent(MonetizationEvents.START);
        (<any> document).monetization.dispatchEvent(_event);
      }, 1000);
      this.simulatePaymentTimer = setInterval(() => this.simulatePayment(), 1000);
    }, 2000);
  }

  stopDonating() {
    this.ngxWebMonetizer.stop();
    clearInterval(this.simulatePaymentTimer);

    const event = new CustomEvent(MonetizationEvents.STOP);
    (<any> document).monetization.dispatchEvent(event);
  }

  simulatePayment() {
    const detail = {
      paymentPointer: this.paymentPointer,
      requestId: (<any> document).monetization._requestId,
      amount: String(Math.floor(30000 + Math.random() * 100000)),
      assetCode: 'USD',
      assetScale: 9
    };

    const event = new CustomEvent("monetizationprogress", { detail });
    (<any> document).monetization.dispatchEvent(event);
  }

  getProject() {
    this.projectID = this.route.snapshot.paramMap.get('id');
    this.paymentPointer = `${this.projectID}_POINTER`;

    this.data.authorize().then(() => {
      this.data.database.collection('projects').doc(this.projectID).onSnapshot(doc => {
        if (doc.data()) {
          this.project = <IProject> { ...doc.data(), id: doc.id }
        }
      });
    }).catch(err => console.log(err));
  }

  getDonationEntries() {
    const projectID = this.projectID || this.route.snapshot.paramMap.get('id');

    this.data.authorize().then(() => {
      this.data.database.collection('projects').doc(projectID).collection('donations').orderBy('timestamp', 'desc').onSnapshot(res => {
        const donations: IDonation[] = [];

        res.forEach(doc => {
          donations.push(<IDonation> { ...doc.data(), id: doc.id });

          if (doc.id === this.username) {
            this.userDonation = <IDonation> { ...doc.data(), id: doc.id }
          }
        })

        this.donations = donations;
      });
    }).catch(err => console.log(err));
  }

  formatAmount(value: number) {
    return `$${FORMAT_NUMBER_READABLE(value)}`;
  }
  
  raisedGoalPercent(amountRaised: number, goal: number) {
    const percentage = CALCULATE_PERCENTAGE(amountRaised, goal);

    return percentage >= 100 ? 100 : percentage;
  }

  viewDonors() {
    this.donorsModal.open();
  }

  handleDonationEvent(event: DonationEventType) {
    if (event === 'start') {
      this.startDonating();
    } else {
      this.stopDonating();
    }
  }
}
