import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  themeToggle = false;

  ngOnInit() {
    this.darkMode();
  }

  async darkMode() {
    const { value } = await Preferences.get({ key: 'theme' });

    if (!value) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

      this.initializeDarkTheme(prefersDark.matches);
      await Preferences.set({ key: 'theme', value: prefersDark.matches ? 'dark' : 'light' });
    } else if (value) {
      this.initializeDarkTheme(value === 'dark');
    }
  }

  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
