import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  constructor(private apiService: ApiService){}
  user: any = null
  message: string = "";

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  fetchUserInfo():void{
    this.apiService.getLoggedInUserInfo().subscribe({
      next:(res)=>{
        this.user = res;
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Não foi possível obter as informações do perfil' + error
        );
      }
    })
  }

    //SHOW ERROR
  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }


}
