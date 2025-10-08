import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../service/dashboard.service';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  data: any;
  alertasEstoque: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.carregarDashboard();
    this.carregarAlertas();
  }

  // Carrega os dados principais do dashboard
  carregarDashboard(): void {
    this.dashboardService.getDashboard().subscribe((res) => {
      console.log('Dados recebidos:', res);
      this.data = res;
    });
  }

  // Carrega e processa os alertas de estoque
carregarAlertas(): void {
  this.apiService.getAllProduto().subscribe({
    next: (res) => {

      // A resposta da API é { status, message, produtos: [...] }
      const produtos = res.produtos || [];

      this.alertasEstoque = produtos
        .map((p: any) => ({
          nome: p.nome,
          quantidade: p.quantidadeEstoque,
          status: this.definirStatusEstoque(p.quantidadeEstoque),
        }))
        .filter((p: any) => p.status !== 'OK'); // só exibe produtos com alerta
    },
    error: (err) => {
      console.error('Erro ao carregar alertas de estoque:', err);
    },
  });
}


  // Define o status conforme a quantidade em estoque
  definirStatusEstoque(qtd: number): string {
    if (qtd <= 3) return 'Crítico';
    if (qtd <= 10) return 'Estoque baixo';
    if (qtd <= 20) return 'Reabastecer';
    return 'OK';
  }

  // Define a classe CSS de acordo com o status
  getStatusClasse(status: string): string {
    return {
      'Crítico': 'critico',
      'Estoque baixo': 'baixo',
      'Reabastecer': 'reabastecer',
    }[status] || '';
  }

  // Controle do progresso dos projetos
  getProgresso(status: string): number {
    const s = status?.toUpperCase();
    switch (s) {
      case 'AGUARDANDO_INICIO':
        return 0;
      case 'EM_PRODUCAO':
        return 65;
      case 'FINALIZADO':
        return 100;
      default:
        return 0;
    }
  }

  // Traduz o status do projeto para texto legível
  traduzirStatus(status: string): string {
    const s = status?.toUpperCase();
    switch (s) {
      case 'AGUARDANDO_INICIO':
        return 'Aguardando início';
      case 'EM_PRODUCAO':
        return 'Em produção';
      case 'FINALIZADO':
        return 'Finalizado';
      default:
        return '';
    }
  }
}
