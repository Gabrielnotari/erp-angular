import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fornecedor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './fornecedor.component.html',
  styleUrl: './fornecedor.component.css',
})
export class FornecedorComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  fornecedores: any[] = [];
  message: string = '';

  ngOnInit(): void {
    this.getFornecedores();
  }


   getFornecedores(): void {
    this.apiService.getAllFornecedores().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.fornecedores = res.fornecedores;
        } else {
          this.showMessage(res.message);
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get suppliers' + error
        );
      },
    });
  }


  //Navegar p adicionar fornecedor
  navigateToAddFornecedorPage(): void {
    this.router.navigate([`/add-fornecedor`]);
  }

  //editar pagina do fornecedor
  navigateToEditFornecedorPage(fornecedorId: string): void {
    this.router.navigate([`/edit-fornecedor/${fornecedorId}`]);
  }

  //Deletar categoria
  handleDeleteFornecedor(fornecedorId: string):void{
    if (window.confirm("Tem certeza de que deseja excluir este fornecedor?")) {
      this.apiService.deleteFornecedor(fornecedorId).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Fornecedor deletado com sucesso")
            this.getFornecedores(); //recarregar categoria
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Não foi possível deletar o fornecedor" + error)
        }
      })
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
