import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FR } from '../i18n/fr';
import { AR } from '../i18n/ar';
import { Translations } from '../models/translations.model';

export type Language = 'fr' | 'ar';
export { Translations };

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<Language>('fr');
  private translations = {
    fr: FR,
    ar: AR
  };

  currentLang$ = this.currentLang.asObservable();

  getTranslations(): Translations {
    return this.translations[this.currentLang.value];
  }

  setLanguage(lang: Language) {
    this.currentLang.next(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  getCurrentLanguage(): Language {
    return this.currentLang.value;
  }
}