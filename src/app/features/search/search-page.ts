import { ChangeDetectionStrategy, Component, effect, input, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RankedSearchResult, SearchService } from '../../core/services/search.service';

@Component({ selector: 'app-search-page', imports: [FormsModule, RouterLink], templateUrl: './search-page.html', styleUrl: './search-page.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class SearchPage {
 private readonly searchService = inject(SearchService);
 private readonly router = inject(Router);
 readonly q = input(''); protected query=''; protected readonly results=signal<RankedSearchResult[]>([]); protected readonly searching=signal(false); constructor(){effect(()=>{this.query=this.q();void this.run();});} protected submit():void{void this.router.navigate(['/search'],{queryParams:{q:this.query}});} private async run():Promise<void>{this.searching.set(true);this.results.set(await this.searchService.search(this.query));this.searching.set(false);}}
