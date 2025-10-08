import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  clientes: any[] = [];
  message: string = '';
  filtro: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getClientes();
  }

  // Filtro de clientes
  get clientesFiltrados() {
    if (!this.filtro) return this.clientes;
    return this.clientes.filter(c =>
      (c.nome || '').toLowerCase().includes(this.filtro.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Buscar todos os clientes
  getClientes(): void {
    this.apiService.getAllClientes().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.clientes = res.clientes || [];
        } else {
          this.showMessage(res.message);
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Não foi possível carregar os clientes'
        );
      },
    });
  }

  // Navegar para página de adicionar cliente
  navigateToAddClientePage(): void {
    this.router.navigate([`/add-cliente`]);
  }

  // Navegar para página de editar cliente
  navigateToEditClientePage(clienteId: number): void {
    this.router.navigate([`/edit-cliente/${clienteId}`]);
  }

  // Buscar projetos de um cliente
  navigateToClienteProjetos(clienteId: number): void {
    this.router.navigate([`/cliente/${clienteId}/projetos`]);
  }

  // Deletar cliente
  handleDeleteCliente(clienteId: number): void {
    if (window.confirm('Tem certeza que deseja excluir permanentemente os dados deste cliente? Essa ação é irreversível conforme o direito de exclusão previsto na LGPD.')) {
      this.apiService.deleteCliente(clienteId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Cliente deletado com sucesso');
            this.getClientes(); // Recarregar lista
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Não foi possível deletar o cliente'
          );
        },
      });
    }
  }

  // Mostrar mensagens temporárias
  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
