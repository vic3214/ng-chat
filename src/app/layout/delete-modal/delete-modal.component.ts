import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/supabase/chat.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {

  private chat_service = inject(ChatService);
  private router = inject(Router);

  dismiss = signal(false);

  constructor() { 
    effect(() => {
      console.log("DeleteModalComponent");
    })
  }

  deleteChat(){
    const id = (this.chat_service.savedChat() as {id:string}).id;

    this.chat_service.deleteChat(id).then(()=>{
      let currentUrl = this.router.url;

      this.dismiss.set(true);
      
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>{
        this.router.navigate([currentUrl]);
      }); 
    }).catch((err)=>{
      alert(err.message);
    });
  }
}
