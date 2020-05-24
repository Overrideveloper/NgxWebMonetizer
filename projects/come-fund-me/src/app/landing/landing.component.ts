import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { IProject } from '../../types';
import { TRUNCATE_TEXT, FORMAT_NUMBER_READABLE } from '../../utils';
import { PROJECTS_SUBJECT, AUTH_SUBJECT } from '../../subjects';
import Swal from 'sweetalert2';
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
    PROJECTS_SUBJECT.subscribe(projects => this.projects = projects);

    this.loadProjects();
  }

  private loadProjects() {
    this.data.authorize().then(() => {
      this.data.database.collection('projects').orderBy('timestamp', 'desc').onSnapshot(res => {
        const projects: IProject[] = [];

        res.forEach(doc => projects.push(<IProject> { ...doc.data(), id: doc.id }));
        PROJECTS_SUBJECT.next(projects);
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
    const percentage = (amountRaised/goal) * 100;

    return percentage >= 100 ? 100 : percentage;
  }

  openProject(project: IProject) {
    const navPath = project.auto ? `/project/auto/${project.id}` : `/project/${project.id}`;

    if (AUTH_SUBJECT.getValue()) {
      this.router.navigate([navPath]);
    } else {
      this.loginRedirectPath = navPath;
      this.navbar.openLoginModal();
    }
  }
}
