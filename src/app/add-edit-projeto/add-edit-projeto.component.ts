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
  styleUrls: ['./add-edit-projeto.component.css'],
})
export class AddEditProjetoComponent implements OnInit {
  message: string = '';
  isEditing: boolean = false;
  projetoId: string | null = null;
  clientes: any[] = [];

  formData: any = {
    nomeProjeto: '',
    clienteId: '',
    status: '',
    dataInicio: '',
    previsaoEntrega: '',
    valor: 0,
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.projetoId = this.router.url.split('/')[2];
    this.carregarClientes();

    if (this.projetoId) {
      this.isEditing = true;
      this.fetchProjeto();
    }
  }

  /** 🔹 Buscar clientes do sistema */
  carregarClientes(): void {
    this.apiService.getAllClientes().subscribe({
      next: (res: any) => {
        if (res.status === 200 && Array.isArray(res.clientes)) {
          this.clientes = res.clientes;
        } else {
          this.clientes = [];
        }
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.showMessage('Erro ao carregar lista de clientes');
      },
    });
  }

  /** 🔹 Buscar dados do projeto quando estiver editando */
  fetchProjeto(): void {
    this.apiService.getProjetoById(this.projetoId!).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.projeto) {
          const projeto = res.projeto;

          this.formData = {
            nomeProjeto: projeto.nomeProjeto, // ✅ nome correto
            clienteId: projeto.clienteId,
            status: projeto.status,
            dataInicio: this.converterDataParaInput(projeto.dataInicio),
            previsaoEntrega: this.converterDataParaInput(projeto.previsaoEntrega),
            valor: projeto.valor,
          };
        }
      },
      error: () => {
        this.showMessage('Erro ao carregar projeto');
      },
    });
  }

  /** 🔹 Submeter formulário */
  handleSubmit() {
    if (
      !this.formData.nomeProjeto ||
      !this.formData.clienteId ||
      !this.formData.status ||
      !this.formData.dataInicio ||
      !this.formData.previsaoEntrega ||
      !this.formData.valor
    ) {
      this.showMessage('Todos os campos são obrigatórios');
      return;
    }

    const projetoData = {
      nomeProjeto: this.formData.nomeProjeto, // ✅ nome correto
      clienteId: this.formData.clienteId,
      status: this.formData.status,
      dataInicio: this.converterDataParaBackend(this.formData.dataInicio),
      previsaoEntrega: this.converterDataParaBackend(this.formData.previsaoEntrega),
      valor: this.formData.valor,
    };

    const request = this.isEditing
      ? this.apiService.updateProjeto(this.projetoId!, projetoData)
      : this.apiService.addProjeto(projetoData);

    request.subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage(
            this.isEditing
              ? 'Projeto atualizado com sucesso'
              : 'Projeto adicionado com sucesso'
          );
          this.router.navigate(['/projetos']);
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || 'Erro ao salvar o projeto.'
        );
      },
    });
  }

  /** 🔹 Converter data no formato do backend (dd/MM/yyyy) */
  converterDataParaBackend(data: string): string {
    if (!data.includes('-')) return data;
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  /** 🔹 Converter data para o formato aceito pelo input[type=date] (yyyy-MM-dd) */
  converterDataParaInput(data: string): string {
    if (!data.includes('/')) return data;
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  cancelar() {
    this.router.navigate(['/projetos']);
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => (this.message = ''), 4000);
  }
}
