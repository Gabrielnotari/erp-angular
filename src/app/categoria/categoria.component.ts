import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface Categoria {
  id: string,
  nome:string
}

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit{

  categories: Categoria[] = [];
  categoryName:string = '';
  message: string = '';
  isEditing:boolean = false;
  editingCategoryId:string | null = null;

  constructor(private apiService: ApiService){}


  ngOnInit(): void {
    this.getCategories();
  }

   //Obter todas as categorias
  getCategories():void{
    this.apiService.getAllCategory().subscribe({
      next:(res:any) =>{
       if (res.status === 200) {
        this.categories = res.categorias;
     }
      },
      error:(error) =>{
        this.showMessage(error?.error?.message || error?.message || "Não foi possível obter todas as categorias" + error)
      }
    })
  }


   //Adicionar categoria
  addCategory():void{
    if (!this.categoryName) {
      this.showMessage("Nome da categoria é obrigatório");
      return;
    }
    this.apiService.createCategory({nome:this.categoryName}).subscribe({
      next:(res:any) =>{
        if (res.status === 200) {
          this.showMessage("Categoria adicionada com sucesso")
          this.categoryName = '';
          this.getCategories();
        }
      },
      error:(error) =>{
        this.showMessage(error?.error?.message || error?.message || "Não foi possível salvar a categoria" + error)
      }
    })
  }


  // Editar categoria
  editCategory():void{
    if (!this.editingCategoryId || !this.categoryName) {
      return;
    }
    this.apiService.updateCategory(this.editingCategoryId, {nome:this.categoryName}).subscribe({
      next:(res:any) =>{
        if (res.status === 200) {
          this.showMessage("Categoria atualizada com sucesso")
          this.categoryName = '';
          this.isEditing = false;
          this.getCategories();
        }
      },
      error:(error) =>{
        this.showMessage(error?.error?.message || error?.message || "Não foi possível editar a categoria" + error)
      }
    })
  }


  //setar categoria para edição
  handleEditCategory(category:Categoria):void{
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryName = category.nome
  }

  //Deletar categoria
  handleDeleteCategory(categoryId: string):void{
    if (window.confirm("Você concorda em deletar essa categoria?")) {
      this.apiService.deleteCategory(categoryId).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Categoria deletada com sucesso")
            this.getCategories(); //recarregar lista
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Não foi possível deletar a categoria" + error)
        }
      })
    }
  }


  showMessage(message:string){
    this.message = message;
    setTimeout(() =>{
      this.message = ''
    }, 4000)
  }

}
