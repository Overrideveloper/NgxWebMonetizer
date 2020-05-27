import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { IProject } from '../../types';
import { TRUNCATE_TEXT, FORMAT_NUMBER_READABLE, CALCULATE_PERCENTAGE } from '../../utils';
import { AUTH_SUBJECT } from '../../subjects';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  constructor(private data: DataService, private router: Router) { }
  @ViewChild('navbar', { static: false }) navbar: NavbarComponent;
  loginRedirectPath: string;
  projects: IProject[];

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects() {
    this.data.authorize().then(() => {
      this.data.database.collection('projects').orderBy('timestamp', 'desc').onSnapshot(res => {
        const projects: IProject[] = [];

        res.forEach(doc => projects.push(<IProject> { ...doc.data(), id: doc.id }));
        this.projects = projects;
      });
    }).catch(err => console.log(err));
  }

  truncateText(text: string) {
    return TRUNCATE_TEXT(text, 90);
  }

  formatNumber(value: number) {
    return `$${FORMAT_NUMBER_READABLE(value)}`;
  }

  raisedGoalPercent(amountRaised: number, goal: number) {
    const percentage = CALCULATE_PERCENTAGE(amountRaised, goal);

    return percentage >= 100 ? 100 : percentage;
  }

  openProject(project: IProject) {
    const navPath = `/project/${project.id}`;

    if (AUTH_SUBJECT.getValue()) {
      this.router.navigate([navPath]);
    } else {
      this.loginRedirectPath = navPath;
      this.navbar.openLoginModal();
    }
  }
}
