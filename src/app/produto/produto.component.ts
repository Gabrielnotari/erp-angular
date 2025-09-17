import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produto',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css',
})
export class ProdutoComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}
  produtos: any[] = [];
  message: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;

  ngOnInit(): void {
    this.fetchProdutos();
  }

  //FETCH PRODUTOS
  fetchProdutos(): void {
    this.apiService.getAllProduto().subscribe({
      next: (res: any) => {
        const produtos = res.produtos || [];
        console.log(produtos[0].imageUrl);

        this.totalPages = Math.ceil(produtos.length / this.itemsPerPage);

        this.produtos = produtos.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Não foi possível editar a categoria' + error
        );
      },
    });
  }

  //DELETAR PRODUTO
  handleProdutoDelete(produtoId: string): void {
    if (window.confirm('Tem certeza de que quer deletar esse produto?')) {
      this.apiService.deleteProduto(produtoId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Produto deletado com sucesso!');
            this.fetchProdutos(); //recarregar produtos
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Não foi possível deletar o produto' + error
          );
        },
      });
    }
  }

    //HANDLE PAGE CHANGRTE. NAVIGATR TO NEXT< PREVIOUS OR SPECIFIC PAGE CHANGE
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchProdutos();
  }

  //NAVIGATE TO ADD PRODUCT PAGE
  navigateToAddProdutoPage(): void {
    this.router.navigate(['/add-produto']);
  }

  //NAVIGATE TO EDIT PRODUCT PAGE
  navigateToEditProdutoPage(produtoId: string): void {
    this.router.navigate([`/edit-produto/${produtoId}`]);
  }

  //SHOW ERROR
  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
