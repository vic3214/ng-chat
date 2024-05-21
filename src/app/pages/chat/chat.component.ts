import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ichat } from '../../interfaces/chat-response';
import { DeleteModalComponent } from '../../layout/delete-modal/delete-modal.component';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/supabase/chat.service';
@Component({
    selector: 'app-chat',
    standalone: true,
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css',
    imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent]
})
export class ChatComponent {
  private auth = inject(AuthService);
  private chat_service = inject(ChatService);
  private router = inject(Router);
  private fb= inject(FormBuilder);

  chats= signal<Ichat[]>([]);
  chatForm!:FormGroup;

  constructor(){
    this.chatForm = this.fb.group({
      chat_message:['',Validators.required]
    });


    effect(()=>{
      this.onListChat();
    })
  }



  async logOut(){
    this.auth.signOut().then(()=>{
      this.router.navigate(['/login'])
    }).catch((err)=>{
      alert(err.message)
    })
  }

  onSubmit(){
    const formValue = this.chatForm.value.chat_message;

    this.chat_service.chatMessage(formValue).then((res)=>{
      console.log(res);
      this.chatForm.reset();
      this.onListChat();
    }).catch((err)=>{
      alert(err.message)
    });

  }

  onListChat(){
    this.chat_service.listChat().then((res:Ichat[]|null)=>{
      console.log(res);
      if(res!==null){
        this.chats.set(res);
      } else{
        console.log("No se han encontrado mensajes");
      }
    }).catch((err)=>{
      alert(err.message)
    });
  }

  openDropDown(msg:Ichat){
    this.chat_service.selectedChats(msg);

  }
}
