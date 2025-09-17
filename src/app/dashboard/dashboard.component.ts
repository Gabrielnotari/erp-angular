import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts'; //charts
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  orcamentos: any[] = []; // Array para armazenar todos os orçamentos
  orcamentoTypeData: any[] = []; // Dados para o gráfico que mostra a quantidade de orcamentos por tipo
  orcamentoAmountData: any[] = []; // Dados para o gráfico que mostra o valor total por tipo de orcamento
  monthlyOrcamentoData: any[] = []; // Dados para o gráfico que mostra os totais diários para o mês selecionado

  // Listas de meses
  meses = [
    { nome: 'Janeiro', valor: '01' },
    { nome: 'Fevereiro', valor: '02' },
    { nome: 'Março', valor: '03' },
    { nome: 'Abril', valor: '04' },
    { nome: 'Maio', valor: '05' },
    { nome: 'Junho', valor: '06' },
    { nome: 'Julho', valor: '07' },
    { nome: 'Agosto', valor: '08' },
    { nome: 'Setembro', valor: '09' },
    { nome: 'Outubro', valor: '10' },
    { nome: 'Novembro', valor: '11' },
    { nome: 'Dezembro', valor: '12' },
  ];

  // Array para armazenar os últimos 10 anos a partir do ano atual
  anos = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // Selecionar mes e ano pra filtragem
  selectedMonth = '';
  selectedYear = '';

  // Configurações de tamanho do gráfico, legenda e animações
  view: [number, number] = [700, 400]; // Tamanho do gráfico: largura x altura
  showLegend = true; // Exibir legenda do gráfico
  showLabels = true; // Exibir rótulos no gráfico
  animations = true; // Ativar animações nos gráficos

  // Construtor para injetar o ApiService e realizar chamadas à API
  constructor(private apiService: ApiService) {}

  // Hook do ciclo de vida ngOnInit, chamado quando o componente é inicializado
  ngOnInit(): void {
    this.loadOrcamento(); // Carrega os orçamentos ao inicializar o componente
  }

  // Método para buscar todos os orçamentos da API
  loadOrcamento(): void {
    this.apiService.getAllOrcamento('').subscribe((data) => {
      this.orcamentos = data.orcamentos; // Armazena os orçamentos retornados
      this.processChartData(); // Processa os dados para gerar os gráficos
    });
  }

  // Método para processar os dados dos orçamentos (gráficos por tipo e por valor total)
  processChartData(): void {
    // Objeto para contar o número de orçamentos por tipo
    const typeCounts: { [key: string]: number } = {};

    // Objeto para somar os valores totais por tipo de orçamento
    const amountByType: { [key: string]: number } = {};

    // Percorre cada orçamento para calcular totais por tipo
    this.orcamentos.forEach((orcamento) => {
      const type = orcamento.tipoOrcamento; // Obtém o tipo de orçamento
      typeCounts[type] = (typeCounts[type] || 0) + 1; // Conta os orçamentos por tipo
      amountByType[type] = (amountByType[type] || 0) + orcamento.precoTotal; // Soma os valores por tipo
    });

    // Prepara os dados para o gráfico que mostra a quantidade de orçamentos por tipo
    this.orcamentoTypeData = Object.keys(typeCounts).map((type) => ({
      name: type,
      value: typeCounts[type],
    }));

    // Prepara os dados para o gráfico que mostra o valor total dos orçamentos por tipo
    this.orcamentoAmountData = Object.keys(amountByType).map((type) => ({
      name: type,
      value: amountByType[type],
    }));
  }

  // Método para carregar orçamentos filtrados por mês e ano
  loadMonthlyData(): void {
    // Se nenhum mês ou ano foi selecionado, sai da função
    if (!this.selectedMonth || !this.selectedYear) {
      return;
    }

    // Chama a API para buscar os orçamentos do mês e ano selecionados
    this.apiService
      .getOrcamentoByMonthAndYear(
        Number.parseInt(this.selectedMonth), // Converte o mês para número
        Number.parseInt(this.selectedYear) // Converte o ano para número
      )
      .subscribe((data) => {
        this.orcamentos = data.orcamentos; // Armazena os orçamentos filtrados
        this.processChartData(); // Processa os dados gerais para os gráficos
        this.processMonthlyData(data.orcamentos); // Processa os dados diários para o gráfico mensal
      });
  }

  // Método para processar os dados diários do mês selecionado
  processMonthlyData(orcamentos: any[]): void {
    // Objeto para armazenar os totais diários (chave = dia, valor = total do dia)
    const dailyTotals: { [key: string]: number } = {};

    // Percorre cada orçamento e acumula os totais por dia
    orcamentos.forEach((orcamento) => {
      const date = new Date(orcamento.dataCriacao).getDate().toString(); // Obtém o dia da data de criação
      dailyTotals[date] = (dailyTotals[date] || 0) + orcamento.precoTotal; // Soma os totais do dia
    });

    // Prepara os dados para o gráfico que mostra os totais diários no mês selecionado
    this.monthlyOrcamentoData = Object.keys(dailyTotals).map((day) => ({
      name: `Day ${day}`,
      value: dailyTotals[day],
    }));
  }
}
