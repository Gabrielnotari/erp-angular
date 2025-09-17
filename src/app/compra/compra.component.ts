import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-compra',
  imports: [CommonModule, FormsModule],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements OnInit {

  constructor(private apiService: ApiService){}

  produtos: any[] = []
  fornecedores: any[] = []
  produtoId:string = ''
  fornecedorId:string = ''
  descricao:string = ''
  quantidade:string = ''
  message:string = ''
  

  ngOnInit(): void {
    this.fetchProdutosAndFornecedores();
  }

  
  fetchProdutosAndFornecedores():void{
    this.apiService.getAllProduto().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.produtos = res.produtos;
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get Products' + error
        );
      },
    });

    this.apiService.getAllFornecedores().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.fornecedores = res.fornecedores;
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get suppliers' + error
        );
      },
    })
  }


  //Handle form submission
  handleSubmit():void{
    if (!this.produtoId || !this.fornecedorId || !this.quantidade) {
      this.showMessage("Please fill all fields")
      return;
    }
    const body = {
      produtoId: this.produtoId,
      fornecedorId: this.fornecedorId,
      quantidade:  parseInt(this.quantidade, 10),
      descricao: this.descricao
    }

    this.apiService.purchaseProduto(body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage(res.message)
          this.resetForm();
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get purchase a product' + error
        );
      },
    })

  }


   resetForm():void{
    this.produtoId = '';
    this.fornecedorId = '';
    this.descricao = '';
    this.quantidade = '';
  }


  

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

}
