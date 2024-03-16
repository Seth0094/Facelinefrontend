import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  selectedTab = 'tab1';

  tabSelected(tab: string) {
    this.selectedTab = tab;
  }
}
