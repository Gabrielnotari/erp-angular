import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orcamento',
  standalone: true,
  imports: [PaginationComponent, FormsModule, CommonModule],
  templateUrl: './orcamento.component.html',
  styleUrl: './orcamento.component.css'
})
export class OrcamentoComponent implements OnInit  {

   constructor(private apiService: ApiService, private router: Router){}

  orcamentos: any[] = [];  
  message: string = '';
  searchInput:string = '';
  valueToSearch:string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 7;

  ngOnInit(): void {
    this.loadOrcamentos();
  }

    //FETCH orcamentos

  loadOrcamentos(): void {
    this.apiService.getAllOrcamento(this.valueToSearch).subscribe({
      next: (res: any) => {
        const orcamentos = res.orcamentos || [];

        this.totalPages = Math.ceil(orcamentos.length / this.itemsPerPage);

        this.orcamentos = orcamentos.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );
        
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Não foi possível obter todos orçamentos ' + error
        );
      },
    });
  }


  //HANDLE SERCH
  handleSearch():void{
    this.currentPage = 1;
    this.valueToSearch = this.searchInput;
    this.loadOrcamentos()
  }

  //navegar p detalhes do orcamento
  navigateTOOrcamentosDetailsPage(orcamentoId: string):void{
    this.router.navigate([`/orcamento/${orcamentoId}`])
  }

    //HANDLE PAGE CHANGRTE. NAVIGATR TO NEXT< PREVIOUS OR SPECIFIC PAGE CHANGE
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadOrcamentos();
    }

     //SHOW ERROR
  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
  

}
