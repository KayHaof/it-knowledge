import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemePreference } from '../../core/models/learning-state.models';
import { LearningStateService } from '../../core/services/learning-state.service';
@Component({selector:'app-settings',imports:[FormsModule],templateUrl:'./settings.html',styleUrl:'./settings.scss',changeDetection:ChangeDetectionStrategy.OnPush})
export class Settings {
protected readonly state = inject(LearningStateService);
protected importValue='';protected readonly message=signal('');protected changeTheme(value:string):void{this.state.setTheme(value as ThemePreference);}protected download():void{const blob=new Blob([this.state.exportData()],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='it-learning-data.json';link.click();URL.revokeObjectURL(link.href);}protected import():void{this.message.set(this.state.importData(this.importValue)?'Đã nhập dữ liệu thành công.':'Tệp không đúng schema version 1.');}protected reset(kind:'progress'|'bookmarks'|'all'):void{if(confirm('Hành động này thay đổi dữ liệu local và không thể hoàn tác. Tiếp tục?')){this.state.reset(kind);this.message.set('Đã cập nhật dữ liệu local.');}}}
