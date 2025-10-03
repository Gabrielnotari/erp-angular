import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-edit-fornecedor',
  standalone: true,
  imports: [FormsModule, CommonModule, ],
  templateUrl: './add-edit-fornecedor.component.html',
  styleUrl: './add-edit-fornecedor.component.css'
})
export class AddEditFornecedorComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  message: string = '';
  isEditing: boolean = false;
  fornecedorId: string | null = null;

   formData: any = {
    nome: '',
    endereco: '',
  };

  ngOnInit(): void {
    this.fornecedorId = this.router.url.split('/')[2]; //extrair id do fornecedor da URL
    if (this.fornecedorId) {
      this.isEditing = true;
      this.fetchFornecedor();
    }
  }


  fetchFornecedor(): void {
    this.apiService.getFornecedorById(this.fornecedorId!).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.formData = {
            nome: res.fornecedor.nome,
            endereco: res.fornecedor.endereco,
          };
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Não foi possível carregar fornecedor pelo id' + error
        );
      },
    });
  }

  // MANIPULAR O ENVIO DO FORMULÁRIO
  handleSubmit() {
    if (!this.formData.nome || !this.formData.endereco) {
      this.showMessage('Todos os campos são obrigatórios');
      return;
    }

    //DADOS DO FORNECEDOR
    const fornecedorData = {
      nome: this.formData.nome,
      endereco: this.formData.endereco,
    };


    
    if (this.isEditing) {
      this.apiService.updateFornecedor(this.fornecedorId!, fornecedorData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Fornecedor atualizado com sucesso");
            this.router.navigate(['/fornecedores'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Não foi possível editar" + error)
        }
      })
    } else {
      this.apiService.addFornecedor(fornecedorData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Fornecedor adicionado com sucesso");
            this.router.navigate(['/fornecedores'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Não foi possível adicionar o fornecedor" + error)
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
