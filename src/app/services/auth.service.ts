import { Injectable, NgZone, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private _ngZone = inject(NgZone);

  private supabase!:SupabaseClient;

  constructor() { 
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log("event", event);
      console.log("session",session);

      localStorage.setItem('session', JSON.stringify(session?.user));

      if(session?.user){
        this._ngZone.run(()=>{
          this.router.navigate(['/chat'])
        })
      }
    })  
  }

  get isLoggedIn(): boolean{
    const user =localStorage.getItem("session") as string;

    return user ==='undefined' ? false:true;
  }

  async signInWithGoogle(){
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  async signOut(){
    await this.supabase.auth.signOut()
  }
}
