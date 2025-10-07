import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-edit-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-cliente.component.html',
  styleUrls: ['./add-edit-cliente.component.css']
})
export class AddEditClienteComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  message: string = '';
  isEditing: boolean = false;
  clienteId: string | null = null;

  formData: any = {
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  };

  ngOnInit(): void {
    this.clienteId = this.router.url.split('/')[2]; // extrai o ID da URL
    if (this.clienteId) {
      this.isEditing = true;
      this.fetchCliente();
    }
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }

  fetchCliente(): void {
  if (!this.clienteId) return; // evita erro caso seja null

  const id = Number(this.clienteId); // converte string -> number

  this.apiService.getClienteById(id).subscribe({
    next: (res: any) => {
      if (res.status === 200) {
        this.formData = {
          nome: res.cliente.nome,
          email: res.cliente.email,
          telefone: res.cliente.telefone,
          endereco: res.cliente.endereco,
        };
      }
    },
    error: (error) => {
      this.showMessage(error?.error?.message || 'Erro ao carregar cliente');
    },
  });
}


  handleSubmit() {
    if (!this.formData.nome || !this.formData.email || !this.formData.telefone || !this.formData.endereco) {
      this.showMessage('Todos os campos são obrigatórios');
      return;
    }

    if (this.isEditing) {
      const id = Number(this.clienteId);
      this.apiService.updateCliente(id, this.formData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Cliente atualizado com sucesso');
            this.router.navigate(['/clientes']);
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || 'Erro ao atualizar cliente');
        }
      });
    } else {
      this.apiService.addCliente(this.formData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Cliente adicionado com sucesso');
            this.router.navigate(['/clientes']);
          }
        },
        error: (error) => {
          this.showMessage(error?.error?.message || 'Erro ao adicionar cliente');
        }
      });
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => (this.message = ''), 4000);
  }
}

