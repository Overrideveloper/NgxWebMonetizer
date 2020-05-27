import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { IDonation, DonorSortType, DonationEventType } from '../../types';
import { FORMAT_NUMBER_READABLE } from '../../utils';

@Component({
  selector: 'app-donors',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.scss']
})
export class DonorsComponent implements AfterViewInit {
  private instance: HTMLDivElement;

  @Input() amountDonated: number;
  @Input() donations: IDonation[];
  @Input() username: string;
  @Input() isMonetizationSupported: boolean;
  @Input() isMonetizationStartedOrPending: boolean;

  @Output() donationEvent = new EventEmitter<DonationEventType>();

  sortType: DonorSortType = 'recent';

  constructor() { }

  ngAfterViewInit() {
    this.instance = <HTMLDivElement> document.getElementById('donors-modal');
  }

  get noDonations() {
    return !this.donations || (this.donations && !this.donations.length);
  }

  get sortBtnText() {
    return this.sortType === 'top' ? 'See all donations' : 'See top donations';
  }

  open() {
    this.instance.classList.add('is-active');
  }

  close() {
    this.instance.classList.remove('is-active');
  }

  toggleSortType() {
    if (this.sortType === 'recent') {
      this.sortType = 'top';
    } else {
      this.sortType = 'recent';
    }
  }

  sortDonors(sortType: DonorSortType) {
    let donors: IDonation[] = [];

    if (sortType === 'top') {
      donors = this.donations.sort((a, b) => {
        const [A, B] = [a.amount, b.amount];

        return A > B ? -1 : B > A ? 1 : 0;
      });
    } else {
      donors = this.donations.sort((a, b) => {
        const [A, B] = [a.timestamp, b.timestamp];

        return A > B ? -1 : B > A ? 1 : 0;
      });
    }

    return donors;
  }

  formatAmount(value: number) {
    return `$${FORMAT_NUMBER_READABLE(value)}`;
  }

  stopDonating() {
    this.donationEvent.emit('stop');
  }

  startDonating() {
    this.donationEvent.emit('start');
  }
}
