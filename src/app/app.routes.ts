import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/app-shell/app-shell').then((m) => m.AppShell),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard) },
      { path: 'learn/:category', loadComponent: () => import('./features/catalog/catalog').then((m) => m.Catalog) },
      { path: 'learn/:category/:slug', loadComponent: () => import('./features/lesson/lesson-page').then((m) => m.LessonPage) },
      { path: 'architecture/:slug', loadComponent: () => import('./features/lesson/lesson-page').then((m) => m.LessonPage) },
      { path: 'distributed-systems/:slug', loadComponent: () => import('./features/lesson/lesson-page').then((m) => m.LessonPage) },
      { path: 'system-design', loadComponent: () => import('./features/system-design/system-design').then((m) => m.SystemDesign) },
      { path: 'system-design/:slug', loadComponent: () => import('./features/lesson/lesson-page').then((m) => m.LessonPage) },
      { path: 'search', loadComponent: () => import('./features/search/search-page').then((m) => m.SearchPage) },
      { path: 'roadmap', loadComponent: () => import('./features/roadmap/roadmap').then((m) => m.Roadmap) },
      { path: 'roadmap/:id', loadComponent: () => import('./features/roadmap/roadmap').then((m) => m.Roadmap) },
      { path: 'interview', loadComponent: () => import('./features/interview/interview').then((m) => m.Interview) },
      { path: 'interview/:category', loadComponent: () => import('./features/interview/interview').then((m) => m.Interview) },
      { path: 'bookmarks', loadComponent: () => import('./features/bookmarks/bookmarks').then((m) => m.Bookmarks) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings').then((m) => m.Settings) },
      { path: '**', loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound) },
    ],
  },
];
