import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projeto',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, FormsModule ],
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css'],
})
export class ProjetoComponent implements OnInit {
  projetos: any[] = [];
  message: string = '';
  filtro: string = ''; 

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getProjetos();
  }

  
getStatusClass(status: string): string {
  if (!status) return '';
  return status.toString().trim().replace(/\s+/g, '_').toUpperCase();
}

traduzirStatus(status: string): string {
  switch (status?.toUpperCase()) {
    case 'AGUARDANDO_INICIO':
      return 'Aguardando início';
    case 'EM_PRODUCAO':
      return 'Em produção';
    case 'FINALIZADO':
      return 'Finalizado';
    default:
      return status;
  }
}



 get projetosFiltrados() {
  if (!this.filtro) return this.projetos;
  return this.projetos.filter(p =>
    (p.nomeProjeto || '').toLowerCase().includes(this.filtro.toLowerCase()) ||
    (p.clienteNome || '').toLowerCase().includes(this.filtro.toLowerCase())
  );
}



  // Buscar todos os projetos
  // helper para converter datas
private parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  // Tenta interpretar ISO (yyyy-MM-dd)
  const iso = new Date(dateStr);
  if (!isNaN(iso.getTime())) return iso;

  // Se vier dd/MM/yyyy ou dd.MM.yyyy
  const parts = dateStr.split(/[\/.]/);
  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);
    return new Date(year, month, day);
  }

  return null;
}

getProjetos(): void {
  this.apiService.getAllProjetos().subscribe({
    next: (res: any) => {
      if (res.status === 200) {
        this.projetos = (res.projetos || []).map((p: any) => ({
          ...p,
          dataInicio: this.parseDate(p.dataInicio),
          previsaoEntrega: this.parseDate(p.previsaoEntrega),
          valor: p.valor !== null ? Number(p.valor) : null,
        }));
      } else {
        this.showMessage(res.message);
      }
    },
    error: (error) => {
      this.showMessage(
        error?.error?.message ||
          error?.message ||
          'Não foi possível carregar os projetos' + error
      );
    },
  });
}


  // Navegar para página de adicionar projeto
  navigateToAddProjetoPage(): void {
    this.router.navigate([`/add-projeto`]);
  }

  // Navegar para página de editar projeto
  navigateToEditProjetoPage(projetoId: string): void {
    this.router.navigate([`/edit-projeto/${projetoId}`]);
  }

  // Deletar projeto
  handleDeleteProjeto(projetoId: string): void {
    if (window.confirm('Tem certeza de que deseja excluir este projeto?')) {
      this.apiService.deleteProjeto(projetoId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Projeto deletado com sucesso');
            this.getProjetos(); // Recarregar lista
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Não foi possível deletar o projeto' + error
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
