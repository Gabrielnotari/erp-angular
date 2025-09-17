import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private apiService:ApiService, private router:Router){}

  formData: any = {
    email: '',
    senha: ''
  };

  message:string | null = null;

  async handleSubmit(){
    if( 
      !this.formData.email || 
      !this.formData.senha 
    ){
      this.showMessage("Todos campos são obrigatórios");
      return;
    }

    try {
      const response: any = await firstValueFrom(this.apiService.loginUser(this.formData));
this.apiService.encryptAndSaveToStorage('token', response.token);
this.apiService.encryptAndSaveToStorage('role', response.role);
this.router.navigate(['/dashboard']);
      
      if (response.status === 200) {
        const { token, role } = response.body;
        this.apiService.encryptAndSaveToStorage('token', response.token);
        this.apiService.encryptAndSaveToStorage('role', response.role);
        this.router.navigate(["/dashboard"]);
      }
    } catch (error:any) {
      console.log(error)
      this.showMessage(error?.error?.message || error?.message || "Não é possível autenticar um usuário" + error)
      
    }
  }

  showMessage(message:string){
    this.message = message;
    setTimeout(() =>{
      this.message = null
    }, 4000)
  }

}
