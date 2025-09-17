import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-produto',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-produto.component.html',
  styleUrl: './add-edit-produto.component.css'
})
export class AddEditProdutoComponent implements OnInit {

   constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  produtoId: string | null = null
  nome:string = ''
  sku:string = ''
  preco:string = ''
  quantidadeEstoque:string = ''
  categoriaId:string = ''
  descricao:string = ''
  imageFile:File | null = null
  imageUrl:string = ''
  isEditing:boolean = false
  categorias:any[] = []
  message:string = ''


   ngOnInit(): void {
    this.produtoId = this.route.snapshot.paramMap.get('produtoId');
    this.fetchCategorias();
    if (this.produtoId) {
      this.isEditing = true;
      this.fetchProdutoById(this.produtoId)
    }
  }

   //OBTER TODAS CATEGORIAS
  fetchCategorias():void{
    this.apiService.getAllCategory().subscribe({
      next:(res:any) =>{
        if (res.status === 200) {
          this.categorias = res.categorias
        }
      },
      error:(error) =>{
        this.showMessage(error?.error?.message || error?.message || "Não foi possível obter todas categorias" + error)
      }})
  }


   //OBTER CATEGORIA POR ID

  fetchProdutoById(produtoId: string):void{
    this.apiService.getProdutoById(produtoId).subscribe({
      next:(res:any) =>{
        if (res.status === 200) {
          const produto = res.produto;
          this.nome = produto.nome;
          this.sku = produto.sku;
          this.preco = produto.preco;
          this.quantidadeEstoque = produto.quantidadeEstoque;
          this.categoriaId = produto.categoriaId;
          this.descricao = produto.descricao;
          this.imageUrl = produto.imageUrl;
        }else{
          this.showMessage(res.message);
        }
      },
      error:(error) =>{
        this.showMessage(error?.error?.message || error?.message || "Não foi possível obter todas categorias" + error)
      }})
  }


  handleImageChange(event: Event):void{
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.imageFile = input.files[0]
      const reader = new FileReader();
      reader.onloadend = () =>{
        this.imageUrl = reader.result as string
      }
      reader.readAsDataURL(this.imageFile);
    }
  }

   
  handleSubmit(event : Event):void{
    event.preventDefault()
    const formData = new FormData();
    formData.append("nome", this.nome);
    formData.append("sku", this.sku);
    formData.append("preco", this.preco);
    formData.append("quantidadeEstoque", this.quantidadeEstoque);
    formData.append("categoriaId", this.categoriaId);
    formData.append("descricao", this.descricao);

    if (this.imageFile) {
      formData.append("imageFile", this.imageFile);
    }

    if (this.isEditing) {
      formData.append("produtoId", this.produtoId!);
      this.apiService.updateProduto(formData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("produto atualizado com sucesso")
            this.router.navigate(['/produtos'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Não foi possível atualizar um produto" + error)
        }})
    }else{
      this.apiService.addProduto(formData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Produto salvo com sucesso")
            this.router.navigate(['/produtos'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Unable to save a product" + error)
        }})

    }
  }

  showMessage(message:string){
    this.message = message;
    setTimeout(() =>{
      this.message = ''
    }, 4000)
  }
}
