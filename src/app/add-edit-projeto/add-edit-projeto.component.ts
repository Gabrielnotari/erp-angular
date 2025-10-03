import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-edit-projeto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-projeto.component.html',
  styleUrls: ['./add-edit-projeto.component.css']
})
export class AddEditProjetoComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  message: string = '';
  isEditing: boolean = false;
  projetoId: string | null = null;

  formData: any = {
    nome: '',
    cliente: '',
    status: '',
    dataInicio: '',
    previsaoEntrega: '',
    valor: 0,
  };

  ngOnInit(): void {
    this.projetoId = this.router.url.split('/')[2]; // extrair id do projeto da URL
    if (this.projetoId) {
      this.isEditing = true;
      this.fetchProjeto();
    }
  }

  cancelar() {
  this.router.navigate(['/projetos']);
}


  fetchProjeto(): void {
    this.apiService.getProjetoById(this.projetoId!).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.formData = {
            nome: res.projeto.nome,
            cliente: res.projeto.cliente,
            status: res.projeto.status,
            dataInicio: res.projeto.dataInicio,
            previsaoEntrega: res.projeto.previsaoEntrega,
            valor: res.projeto.valor,
          };
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'Não foi possível carregar projeto pelo id: ' + error
        );
      }
    });
  }

  // MANIPULAR O ENVIO DO FORMULÁRIO
  handleSubmit() {
    if (!this.formData.nome || !this.formData.cliente || !this.formData.status || 
        !this.formData.dataInicio || !this.formData.previsaoEntrega || !this.formData.valor) {
      this.showMessage('Todos os campos são obrigatórios');
      return;
    }

    const projetoData = {
      nome: this.formData.nome,
      cliente: this.formData.cliente,
      status: this.formData.status,
      dataInicio: this.formData.dataInicio,
      previsaoEntrega: this.formData.previsaoEntrega,
      valor: this.formData.valor,
    };

    if (this.isEditing) {
      this.apiService.updateProjeto(this.projetoId!, projetoData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Projeto atualizado com sucesso');
            this.router.navigate(['/projetos']);
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || 'Não foi possível editar: ' + error);
        }
      });
    } else {
      this.apiService.addProjeto(projetoData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Projeto adicionado com sucesso');
            this.router.navigate(['/projetos']);
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || 'Não foi possível adicionar o projeto: ' + error);
        }
      });
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
