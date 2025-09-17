import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-venda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venda.component.html',
  styleUrl: './venda.component.css'
})
export class VendaComponent implements OnInit  {

  constructor(private apiService: ApiService){}


  produtos: any[] = []
  produtoId:string = ''
  descricao:string = ''
  quantidade:string = ''
  message:string = ''



  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts():void{
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
            'Não foi possível obter os produtos ' + error
        );
      },
    });

  }


  handleSubmit():void{
    if (!this.produtoId || !this.quantidade) {
      this.showMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const body = {
      produtoId: this.produtoId,
      quantidade:  parseInt(this.quantidade, 10),
      descricao: this.descricao
    }

    this.apiService.sellProduto(body).subscribe({
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
            'Não foi possível registrar a saída do produto' + error
        );
      },
    })

  }

   resetForm():void{
    this.produtoId = '';
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
